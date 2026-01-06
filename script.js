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
// HANDLE URL HASH ON LOAD
// ==============================
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1); // Remove the '#'
  
  if (hash) {
    const targetLink = document.querySelector(`.sidebar a[data-section="${hash}"]`);
    const targetSection = document.getElementById(hash);

    if (targetLink && targetSection) {
      // Remove active class from defaults
      tabLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(sec => sec.classList.remove('active'));

      // Activate the specific tab and section
      targetLink.classList.add('active');
      targetSection.classList.add('active');
    }
  }
});
