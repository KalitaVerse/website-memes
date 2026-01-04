// ==============================
// TAB NAVIGATION (APP SECTIONS)
// ==============================

const tabLinks = document.querySelectorAll('.sidebar a[data-section]');
const sections = document.querySelectorAll('.content');

tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.getAttribute('data-section');
    if (!target) return;

    // Remove active state from all tabs
    tabLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));

    // Activate clicked tab
    link.classList.add('active');
    const section = document.getElementById(target);
    if (section) section.classList.add('active');
  });
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
}

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    body.classList.toggle('dark');

    // Save preference
    if (body.classList.contains('light')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });
}


// ==============================
// OPTIONAL: SEARCH PLACEHOLDER
// ==============================

const searchInput = document.querySelector('.topbar input[type="search"]');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    // Future: hook backend search here
    console.log('Searching:', searchInput.value);
  });
}
