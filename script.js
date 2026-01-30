// ==============================
// SECTION / TAB HANDLING
// ==============================

const sections = document.querySelectorAll(".content");
const tabLinks = document.querySelectorAll(".sidebar a[data-section]");

function activateTab(targetId) {
  const targetSection = document.getElementById(targetId);
  const targetLink = document.querySelector(
    `.sidebar a[data-section="${targetId}"]`
  );

  if (!targetSection || !targetLink) return;

  tabLinks.forEach(l => l.classList.remove("active"));
  sections.forEach(sec => sec.classList.remove("active"));

  targetLink.classList.add("active");
  targetSection.classList.add("active");
}

function handleHash() {
  const hash = window.location.hash.replace("#", "");
  activateTab(hash || "home");
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(handleHash, 0);
});

window.addEventListener("hashchange", handleHash);

tabLinks.forEach(link => {
  link.addEventListener("click", () => {
    const target = link.dataset.section;
    if (!target) return;
    window.location.hash = target;
  });
});

// ==============================
// THEME TOGGLE
// ==============================

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
  body.classList.remove("dark");
} else {
  body.classList.add("dark");
  body.classList.remove("light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");
    body.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      body.classList.contains("light") ? "light" : "dark"
    );
  });
}

// ==============================
// MEME API
// ==============================

const API_URL = "https://meme-backend-311j.onrender.com/api/memes";

// Fetch memes
async function fetchMemes() {
  try {
    const res = await fetch(API_URL);
    const memes = await res.json();
    renderMemes(memes);
  } catch (err) {
    console.error("Failed to fetch memes", err);
  }
}

// Render memes
function renderMemes(memes) {
  const container = document.getElementById("meme-container");
  if (!container) return;

  container.innerHTML = "";

  memes.forEach(meme => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${meme.imageUrl}" alt="${meme.title}">
      <h3>${meme.title}</h3>

      <button class="like-btn" data-id="${meme._id}">
        ❤️ <span>${meme.likes ?? 0}</span>
      </button>
    `;

    container.appendChild(card);
  });
}

// ==============================
// LIKE BUTTON HANDLER (GLOBAL)
// ==============================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;

  const memeId = btn.dataset.id;

  try {
    const res = await fetch(
      `https://meme-backend-311j.onrender.com/api/memes/${memeId}/like`,
      { method: "PATCH" }
    );

    const updated = await res.json();
    btn.querySelector("span").textContent = updated.likes;
  } catch (err) {
    console.error("Like failed", err);
  }
});

// Load memes on page load
window.addEventListener("load", fetchMemes);
