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

  // Clear active states
  tabLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(sec => sec.classList.remove('active'));

  // Activate target
  targetLink.classList.add('active');
  targetSection.classList.add('active');
}

// Handle hash safely (for refresh & back/forward)
function handleHash() {
  const hash = window.location.hash.replace('#', '');
  activateTab(hash || 'home');
}

/* 🔑 IMPORTANT FIX
   Delay hash reading so browser restores it first
*/
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(handleHash, 0);
});

// Handle browser back / forward
window.addEventListener('hashchange', handleHash);


tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.dataset.section;
    if (!target) return;

    // Update URL hash (browser handles navigation)
    window.location.hash = target;
  });
});


const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
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

/* ==============================
   MEME API INTEGRATION
   ============================== */

const API_URL = "https://meme-backend-311j.onrender.com/api/memes";

// Call API and load memes
async function fetchMemes() {
  try {
    const res = await fetch(API_URL);
    const memes = await res.json();
    renderMemes(memes);
  } catch (err) {
    console.error("Failed to fetch memes", err);
  }
}

// Render memes into home section
function renderMemes(memes) {
  const container = document.getElementById("meme-container");
  if (!container) return;

  container.innerHTML = "";

  memes.forEach(meme => {
    const card = document.createElement("div");
    card.className = "meme-card";

    card.innerHTML = `
      <img src="${meme.imageUrl}" alt="${meme.title}">
      <h3>${meme.title}</h3>
    `;

    container.appendChild(card);
  });
}

// Load memes when page loads
window.addEventListener("load", fetchMemes);

