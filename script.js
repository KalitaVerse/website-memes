// ==============================
// TAB NAVIGATION (HOME PAGE ONLY)
// ==============================

const tabLinks = document.querySelectorAll('.sidebar a[data-section]');
const sections = document.querySelectorAll('.content');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const target = link.dataset.section;
    if (!target) return;

    tabLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));

    link.classList.add('active');
    const section = document.getElementById(target);
    if (section) section.classList.add('active');
  });
});

// ==============================
// THEME TOGGLE
// ==============================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light');
} else {
  body.classList.add('dark');
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
// ==============================
// DEEP LINK / HASH FIX
// ==============================

function loadSectionFromHash() {
  const hash = window.location.hash.replace("#", "");

  if (!hash) return;

  const targetLink = document.querySelector(
    `.sidebar a[data-section="${hash}"]`
  );

  if (targetLink) {
    targetLink.click();
  }
}

// Run on page load
window.addEventListener("DOMContentLoaded", loadSectionFromHash);

// Run when hash changes (back/forward buttons)
window.addEventListener("hashchange", loadSectionFromHash);
