// ==============================
// TAB NAVIGATION & DEEP LINKING
// ==============================

const tabLinks = document.querySelectorAll('.sidebar a[data-section]');
const sections = document.querySelectorAll('.content');

// 1. Handle Clicks
tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab(link.dataset.section);
  });
});

// 2. Handle Page Load (Fixes the "Always Home" bug)
window.addEventListener('DOMContentLoaded', () => {
  // Get the hash without the '#' (e.g., "images", "trending")
  const hash = window.location.hash.substring(1);
  
  if (hash) {
    activateTab(hash);
  } else {
    // Default to home if no hash exists
    activateTab('home');
  }
});

// Helper function to switch tabs
function activateTab(targetId) {
  const targetSection = document.getElementById(targetId);
  const targetLink = document.querySelector(`.sidebar a[data-section="${targetId}"]`);

  if (!targetSection || !targetLink) return;

  // Remove active class from all
  tabLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  // Add active class to target
  targetLink.classList.add('active');
  targetSection.classList.add('active');
}

// ==============================
// THEME TOGGLE
// ==============================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check saved theme on load
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
