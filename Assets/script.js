function updateTimePanel() {
  const timeEl = document.getElementById('time-value');
  const dateEl = document.getElementById('date-value');
  const weatherEl = document.getElementById('weather-text');
  if (!timeEl || !dateEl || !weatherEl) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const dateString = now.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  const hour = now.getHours();

  const weatherStates = [
    { icon: '🌙', label: 'Clear Night' },
    { icon: '☁️', label: 'Cloudy' },
    { icon: '☀️', label: 'Sunny' },
    { icon: '⛅', label: 'Partly Cloudy' },
    { icon: '⛈️', label: 'Stormy' }
  ];
  const weather = weatherStates[(Math.floor(hour / 5) + 1) % weatherStates.length];
  const temperature = 68 + Math.round((Math.sin(hour / 24 * Math.PI) + 1) * 8);

  timeEl.textContent = timeString;
  dateEl.textContent = dateString;
  weatherEl.textContent = `${weather.icon} ${weather.label} · ${temperature}°F`;
}

function toggleTimePanel() {
  const panel = document.getElementById('time-panel');
  if (!panel) return;
  const isOpen = panel.classList.toggle('show');
  if (isOpen) updateTimePanel();
}

function closeTimePanel(event) {
  const panel = document.getElementById('time-panel');
  const button = document.getElementById('time-btn');
  if (!panel || !button) return;
  if (!panel.classList.contains('show')) return;
  if (panel.contains(event.target) || button.contains(event.target)) return;
  panel.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('time-btn');
  if (button) button.addEventListener('click', toggleTimePanel);
  document.addEventListener('click', closeTimePanel);

  const overlay = document.getElementById('iframe-overlay');
  const frame = document.getElementById('content-frame');
  const frameTitle = document.getElementById('iframe-title');
  const refreshBtn = document.getElementById('iframe-refresh');
  const fullscreenBtn = document.getElementById('iframe-fullscreen');
  const newTabBtn = document.getElementById('iframe-newtab');
  const closeBtn = document.getElementById('iframe-close');

  function closePreview() {
    if (!overlay || !frame) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    frame.src = '';
  }

  function openPreview(event) {
    const link = event.currentTarget;
    if (!overlay || !frame || !frameTitle) return;
    event.preventDefault();
    const href = link.href;
    const title = link.dataset.title || link.textContent.trim();
    frameTitle.textContent = title;
    frame.src = href;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  }

  document.querySelectorAll('.weapon-link').forEach(link => {
    link.addEventListener('click', openPreview);
  });

  if (closeBtn) closeBtn.addEventListener('click', event => {
    event.preventDefault();
    closePreview();
  });
  if (overlay) overlay.addEventListener('click', event => {
    if (event.target === overlay) closePreview();
  });
  if (refreshBtn) refreshBtn.addEventListener('click', event => {
    event.preventDefault();
    if (!frame || !frame.src) return;
    frame.src = frame.src;
  });
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', event => {
    event.preventDefault();
    if (!frame) return;
    if (frame.requestFullscreen) frame.requestFullscreen();
  });
  if (newTabBtn) newTabBtn.addEventListener('click', event => {
    event.preventDefault();
    if (!frame || !frame.src) return;
    window.open(frame.src, '_blank');
  });
});
