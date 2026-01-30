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

  // 🔥 FIX: load trending when tab opens
  if (targetId === "trending") {
    fetchTrendingMemes();
  }
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
body.classList.add(savedTheme === "light" ? "light" : "dark");

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
// API URLS
// ==============================

const API_URL = "https://meme-backend-311j.onrender.com/api/memes";
const TRENDING_API =
  "https://meme-backend-311j.onrender.com/api/memes/trending";

// ==============================
// FETCH MEMES (HOME)
// ==============================

async function fetchMemes() {
  try {
    const res = await fetch(API_URL);
    const memes = await res.json();
    renderHome(memes);
  } catch (err) {
    console.error("Failed to fetch memes", err);
  }
}

function renderHome(memes) {
  const container = document.getElementById("home-container");
  if (!container) return;

  container.innerHTML = "";

  memes.forEach(meme => {
    container.appendChild(createCard(meme));
  });
}

// ==============================
// FETCH TRENDING MEMES
// ==============================

async function fetchTrendingMemes() {
  try {
    const res = await fetch(TRENDING_API);
    const memes = await res.json();
    renderTrending(memes);
  } catch (err) {
    console.error("Failed to fetch trending memes", err);
  }
}

function renderTrending(memes) {
  const container = document.getElementById("trending-container");
  if (!container) return;

  container.innerHTML = "";

  memes.forEach(meme => {
    container.appendChild(createCard(meme));
  });
}

// ==============================
// CARD TEMPLATE (REUSED)
// ==============================

function createCard(meme) {
  const card = document.createElement("div");
  card.className = "card";

  const liked = localStorage.getItem(`liked_${meme._id}`);

  card.innerHTML = `
    <img src="${meme.imageUrl}" alt="${meme.title}">
    <h3>${meme.title}</h3>

    <button class="like-btn ${liked ? "liked" : ""}" data-id="${meme._id}">
      <i class="fa-${liked ? "solid" : "regular"} fa-thumbs-up"></i>
      <span>${meme.likes ?? 0}</span>
    </button>
  `;

  return card;
}

// ==============================
// GLOBAL LIKE HANDLER
// ==============================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;

  const memeId = btn.dataset.id;

  if (localStorage.getItem(`liked_${memeId}`)) return;

  try {
    const res = await fetch(`${API_URL}/${memeId}/like`, {
      method: "PATCH",
    });

    const updated = await res.json();

    btn.querySelector("span").textContent = updated.likes;
    btn.classList.add("liked");

    const icon = btn.querySelector("i");
    icon.classList.replace("fa-regular", "fa-solid");

    localStorage.setItem(`liked_${memeId}`, "true");

    // 🔥 keep trending live
    fetchTrendingMemes();
  } catch (err) {
    console.error("Like failed", err);
  }
});

// ==============================
// INITIAL LOAD
// ==============================

window.addEventListener("load", () => {
  fetchMemes(); // Home
  fetchTrendingMemes(); // Preload trending
});
