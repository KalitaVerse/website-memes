// Exit if not on index page (safety guard)
if (!document.querySelector('.content')) {
  console.warn('Tab navigation disabled (not index.html)');
  return;
}

/* ==============================
   TAB NAVIGATION & DEEP LINKING (FIXED)
   ============================== */

// Sections (only exist on index.html)
const sections = document.querySelectorAll('.content');

// Sidebar links that control tabs
const tabLinks = document.querySelectorAll('.sidebar a[data-section]');

// Activate a tab by id
function activateTab(targetId) {
  const targetSection = document.getElementById(targetId);
  const targetLink = document.querySelector(
    `.sidebar a[data-section="${targetId}"]`
  );

  if (!targetSection || !targetLink) return;

  tabLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  targetLink.classList.add('active');
  targetSection.classList.add('active');
}

function handleHash() {
  const hash = window.location.hash.replace('#', '');
  activateTab(hash || 'home');
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(handleHash, 0);
});

window.addEventListener('hashchange', handleHash);

tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.dataset.section;
    if (!target) return;
    window.location.hash = target;
  });
});

/* ==============================
   THEME TOGGLE
   ============================== */

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light');
  body.classList.remove('dark');
} else {
  body.classList.add('dark');
  body.classList.remove('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    body.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      body.classList.contains('light') ? 'light' : 'dark'
    );
  });
}
