// ==============================
// CONFIG / API URLS
// ==============================

const API_URL = "https://meme-backend-311j.onrender.com/api/memes";
const TRENDING_API ="https://meme-backend-311j.onrender.com/api/memes/trending";

// ==============================
// THEME
// ==============================

(function initTheme() {
  const body       = document.body;
  const themeBtn   = document.getElementById("themeToggle");
  const saved      = localStorage.getItem("theme") || "dark";

  const applyTheme = (theme) => {
    body.classList.toggle("light", theme === "light");
    if (themeBtn) themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  };

  applyTheme(saved);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = body.classList.contains("light") ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }
})();

// ==============================
// SECTION / TAB ROUTING
// ==============================

const tabLinks = document.querySelectorAll("a[data-section]"); // sidebar + mobile nav
const sections = document.querySelectorAll(".content");

function activateTab(targetId) {
  const targetSection = document.getElementById(targetId);

  // Fall back to "home" if the id doesn't exist in the DOM
  if (!targetSection) {
    if (targetId !== "home") activateTab("home");
    return;
  }

  tabLinks.forEach(l => l.classList.remove("active"));
  sections.forEach(s => s.classList.remove("active"));

  targetSection.classList.add("active");

  // Activate matching links in both sidebar and mobile nav
  document.querySelectorAll(`a[data-section="${targetId}"]`).forEach(l => l.classList.add("active"));

  window.scrollTo({ top: 0, behavior: "instant" });
}

function handleHash() {
  const hash = window.location.hash.replace("#", "").trim();
  activateTab(hash || "home");
}

// Route on load & on back/forward navigation
window.addEventListener("DOMContentLoaded", handleHash);
window.addEventListener("hashchange", handleHash);

tabLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.section;
    if (!target) return;
    activateTab(target);
    history.pushState(null, "", `#${target}`);
  });
});

// ==============================
// FILTER CHIPS
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".filter-row").forEach(row => {
    row.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      row.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
});

// ==============================
// CARD BUILDER (shared helper)
// ==============================

/**
 * Creates a meme card element.
 * @param {{ _id: string, imageUrl: string, title: string, likes: number }} meme
 * @returns {HTMLElement}
 */
function buildCard(meme) {
  const liked = !!localStorage.getItem(`liked_${meme._id}`);

  const card = document.createElement("div");
  card.className = "card";

  // Sanitise text content to avoid XSS via API data
  const img    = document.createElement("img");
  img.src      = meme.imageUrl;
  img.alt      = meme.title;
  img.loading  = "lazy";

  const title  = document.createElement("h3");
  title.textContent = meme.title;

  const btn    = document.createElement("button");
  btn.className   = `like-btn${liked ? " liked" : ""}`;
  btn.dataset.id  = meme._id;
  btn.setAttribute("aria-label", `Like ${meme.title}`);
  btn.setAttribute("aria-pressed", String(liked));

  const icon   = document.createElement("i");
  icon.className = `fa-${liked ? "solid" : "regular"} fa-thumbs-up`;

  const count  = document.createElement("span");
  count.textContent = meme.likes ?? 0;

  btn.append(icon, count);
  card.append(img, title, btn);

  return card;
}

// ==============================
// RENDER HELPERS
// ==============================

function renderMemes(containerId, countId, memes) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;

  container.innerHTML = "";

  if (!memes.length) {
    container.innerHTML = `<p class="muted">No memes found.</p>`;
    if (countEl) countEl.textContent = "0 memes";
    return;
  }

  const frag = document.createDocumentFragment();
  memes.forEach(meme => frag.appendChild(buildCard(meme)));
  container.appendChild(frag);

  if (countEl) countEl.textContent = `${memes.length} memes`;
}

// ==============================
// FETCH HELPERS
// ==============================

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${url}`);
  return res.json();
}

async function fetchMemes() {
  try {
    const memes = await fetchJSON(API_URL);
    renderMemes("home-container", "home-count", memes);
  } catch (err) {
    console.error("Failed to fetch memes:", err);
    showError("home-container", "Could not load memes. Please try again later.");
  }
}

async function fetchTrendingMemes() {
  try {
    const memes = await fetchJSON(TRENDING_API);
    renderMemes("trending-container", "trending-count", memes);
  } catch (err) {
    console.error("Failed to fetch trending memes:", err);
    showError("trending-container", "Could not load trending memes.");
  }
}

function showError(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<p class="error-msg" style="color:var(--accent);padding:24px 0;">${message}</p>`;
}

// ==============================
// LIKE HANDLER (delegated, with optimistic UI)
// ==============================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;

  const memeId = btn.dataset.id;
  if (!memeId) return;

  // Already liked — do nothing
  if (localStorage.getItem(`liked_${memeId}`)) return;

  // Optimistic update
  const icon  = btn.querySelector("i");
  const count = btn.querySelector("span");
  const prev  = parseInt(count.textContent, 10) || 0;

  btn.disabled  = true;
  btn.classList.add("liked");
  btn.setAttribute("aria-pressed", "true");
  icon.className = "fa-solid fa-thumbs-up";
  count.textContent = prev + 1;

  try {
    const res = await fetch(`${API_URL}/${memeId}/like`, { method: "PATCH" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const updated = await res.json();
    count.textContent = updated.likes ?? prev + 1;

    localStorage.setItem(`liked_${memeId}`, "true");

    // Refresh trending in background — no need to await
    fetchTrendingMemes();
  } catch (err) {
    console.error("Like failed:", err);

    // Roll back optimistic update
    btn.classList.remove("liked");
    btn.setAttribute("aria-pressed", "false");
    icon.className = "fa-regular fa-thumbs-up";
    count.textContent = prev;
  } finally {
    btn.disabled = false;
  }
});

// ==============================
// SOUND PLAY TOGGLE
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".play-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card      = btn.closest(".sound-card");
      const isPlaying = card.classList.toggle("playing");
      btn.innerHTML   = isPlaying
        ? '<i class="fa-solid fa-pause"></i>'
        : '<i class="fa-solid fa-play"></i>';
      btn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    });
  });
});

// ==============================
// FOOTER YEAR
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ==============================
// INITIAL DATA LOAD
// ==============================

window.addEventListener("load", () => {
  fetchMemes();
  fetchTrendingMemes();
});
