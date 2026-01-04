// ==============================
// TAB NAVIGATION (APP SECTIONS)
// ==============================

const tabLinks = document.querySelectorAll('.sidebar a[data-section]');
const sections = document.querySelectorAll('.content');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.dataset.section;

    // Safety check
    if (!target) return;

    // Prevent page jump
    e.preventDefault();

    // Remove active states
    tabLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));

    // Activate clicked tab
    link.classList.add('active');
    const section = document.getElementById(target);
    if (section) section.classList.add('active');
  });
});

// ==============================
// ACTIVATE DEFAULT TAB ON LOAD
// ==============================

window.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('.sidebar a[data-section].active')
    || document.querySelector('.sidebar a[data-section]');

  if (!activeTab) return;

  const target = activeTab.dataset.section;
  const section = document.getElementById(target);

  if (section) section.classList.add('active');
});


// ==============================
// THEME TOGGLE (DARK / LIGHT)
// ==============================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light');
  body.classList.remove('dark');
} else {
  body.classList.add('dark');
}

// Toggle theme
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
// SEARCH PLACEHOLDER (SAFE)
// ==============================

const searchInput = document.querySelector('.topbar input[type="search"]');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    // Future backend hook
    console.log('Searching:', searchInput.value);
  });
}
