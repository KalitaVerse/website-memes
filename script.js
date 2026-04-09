
// ==============================
// CONFIG / API URLS
// ==============================

const BASE_URL      = "https://meme-backend-311j.onrender.com/api/memes";
const API_URL       = BASE_URL;
const TRENDING_API  = `${BASE_URL}/trending`;
const IMAGES_API    = `${BASE_URL}/images`;
const VIDEOS_API    = `${BASE_URL}/videos`;
const TEMPLATES_API = `${BASE_URL}/templates`;
const SOUNDS_API    = `${BASE_URL}/sounds`;

// ==============================
// THEME
// ==============================

(function initTheme() {
  const body     = document.body;
  const themeBtn = document.getElementById("themeToggle");
  const saved    = localStorage.getItem("theme") || "dark";

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

const tabLinks = document.querySelectorAll("a[data-section]");
const sections = document.querySelectorAll(".content");

const fetched = new Set();

function activateTab(targetId) {
  const targetSection = document.getElementById(targetId);
  if (!targetSection) {
    if (targetId !== "home") activateTab("home");
    return;
  }

  tabLinks.forEach(l => l.classList.remove("active"));
  sections.forEach(s => s.classList.remove("active"));

  targetSection.classList.add("active");
  document.querySelectorAll(`a[data-section="${targetId}"]`).forEach(l => l.classList.add("active"));
  window.scrollTo({ top: 0, behavior: "instant" });

  // Lazy-load section data on first visit
  if (!fetched.has(targetId)) {
    fetched.add(targetId);
    switch (targetId) {
      case "images":    fetchImages();    break;
      case "videos":    fetchVideos();    break;
      case "templates": fetchTemplates(); break;
      case "sound":     fetchSounds();    break;
    }
  }
}

function handleHash() {
  const hash = window.location.hash.replace("#", "").trim();
  activateTab(hash || "home");
}

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
// FETCH HELPER
// ==============================

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${url}`);
  return res.json();
}

function showError(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<p class="error-msg" style="color:var(--accent);padding:24px 0;">${message}</p>`;
}

// ==============================
// CARD BUILDERS
// ==============================

/** Home / Trending — standard image card */
function buildCard(meme) {
  const liked = !!localStorage.getItem(`liked_${meme._id}`);
  const card  = document.createElement("div");
  card.className = "card";

  const thumb = document.createElement("div");
  thumb.className = "card-thumb";

  // Show image or video thumbnail depending on type
  if (meme.type === "video") {
    const vid = document.createElement("video");
    vid.src = meme.imageUrl;
    vid.style.cssText = "width:100%;aspect-ratio:16/9;object-fit:cover;display:block;";
    vid.preload = "metadata";
    thumb.appendChild(vid);
  } else {
    const img = document.createElement("img");
    img.src = meme.imageUrl;
    img.alt = meme.title;
    img.loading = "lazy";
    thumb.appendChild(img);
  }

  const body  = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = meme.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `<span>${meme.likes ?? 0} likes</span>`;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const likeBtn = document.createElement("button");
  likeBtn.className = `like-btn${liked ? " liked" : ""}`;
  likeBtn.dataset.id = meme._id;
  likeBtn.setAttribute("aria-label", `Like ${meme.title}`);
  likeBtn.setAttribute("aria-pressed", String(liked));
  likeBtn.innerHTML = `<i class="fa-${liked ? "solid" : "regular"} fa-heart"></i> ${liked ? "Liked" : "Like"}`;

  const shareBtn = document.createElement("button");
  shareBtn.className = "share-btn";
  shareBtn.innerHTML = `<i class="fa-solid fa-arrow-up-from-bracket"></i>`;

  actions.append(likeBtn, shareBtn);
  body.append(title, meta, actions);
  card.append(thumb, body);
  return card;
}

/** Images section — <img> only */
function buildImageCard(meme) {
  const liked = !!localStorage.getItem(`liked_${meme._id}`);
  const card  = document.createElement("div");
  card.className = "card";

  const thumb = document.createElement("div");
  thumb.className = "card-thumb";

  const img = document.createElement("img");
  img.src     = meme.imageUrl;
  img.alt     = meme.title;
  img.loading = "lazy";
  thumb.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = meme.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `<span>${meme.likes ?? 0} likes</span><span class="card-meta-dot"></span><span>Image</span>`;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const likeBtn = document.createElement("button");
  likeBtn.className = `like-btn${liked ? " liked" : ""}`;
  likeBtn.dataset.id = meme._id;
  likeBtn.setAttribute("aria-pressed", String(liked));
  likeBtn.innerHTML = `<i class="fa-${liked ? "solid" : "regular"} fa-heart"></i> ${liked ? "Liked" : "Like"}`;

  const shareBtn = document.createElement("button");
  shareBtn.className = "share-btn";
  shareBtn.innerHTML = `<i class="fa-solid fa-arrow-up-from-bracket"></i>`;

  actions.append(likeBtn, shareBtn);
  body.append(title, meta, actions);
  card.append(thumb, body);
  return card;
}

/** Videos section — <video controls>, no images */
function buildVideoCard(meme) {
  const liked = !!localStorage.getItem(`liked_${meme._id}`);
  const card  = document.createElement("div");
  card.className = "card";

  const thumb = document.createElement("div");
  thumb.className = "card-thumb";
  thumb.style.cssText = "background:#000;";

  const vid = document.createElement("video");
  vid.src      = meme.imageUrl;  // imageUrl holds the video URL
  vid.controls = true;
  vid.preload  = "metadata";
  vid.style.cssText = "width:100%;aspect-ratio:16/9;object-fit:contain;display:block;background:#000;";
  vid.setAttribute("playsinline", "");
  thumb.appendChild(vid);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = meme.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `<span>${meme.likes ?? 0} likes</span><span class="card-meta-dot"></span><span>Video</span>`;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const likeBtn = document.createElement("button");
  likeBtn.className = `like-btn${liked ? " liked" : ""}`;
  likeBtn.dataset.id = meme._id;
  likeBtn.setAttribute("aria-pressed", String(liked));
  likeBtn.innerHTML = `<i class="fa-${liked ? "solid" : "regular"} fa-heart"></i> ${liked ? "Liked" : "Like"}`;

  const shareBtn = document.createElement("button");
  shareBtn.className = "share-btn";
  shareBtn.innerHTML = `<i class="fa-solid fa-arrow-up-from-bracket"></i>`;

  actions.append(likeBtn, shareBtn);
  body.append(title, meta, actions);
  card.append(thumb, body);
  return card;
}

/** Templates section — image with "Use Template" overlay */
function buildTemplateCard(meme) {
  const card = document.createElement("div");
  card.className = "template-card";

  const img = document.createElement("img");
  img.src     = meme.imageUrl;
  img.alt     = meme.title;
  img.loading = "lazy";

  const overlay = document.createElement("div");
  overlay.className = "template-card-use";
  const useBtn = document.createElement("button");
  useBtn.className   = "use-btn";
  useBtn.textContent = "Use Template";
  // Open the image URL in a new tab as a simple "use" action
  useBtn.addEventListener("click", () => window.open(meme.imageUrl, "_blank"));
  overlay.appendChild(useBtn);

  const body = document.createElement("div");
  body.className = "template-card-body";

  const title = document.createElement("div");
  title.className   = "template-card-title";
  title.textContent = meme.title;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `<span>${meme.likes ?? 0} likes</span><span class="card-meta-dot"></span><span>Template</span>`;

  body.append(title, meta);
  card.append(img, overlay, body);
  return card;
}

/** Sound section — real <audio> with play/pause toggle */
function buildSoundCard(meme) {
  const card = document.createElement("div");
  card.className = "sound-card";

  // Hidden audio element
  const audio = document.createElement("audio");
  audio.src     = meme.imageUrl;  // imageUrl holds the audio file URL
  audio.preload = "none";

  // Icon
  const iconWrap = document.createElement("div");
  iconWrap.className = "sound-icon";
  iconWrap.innerHTML = `<i class="fa-solid fa-music"></i>`;

  // Info
  const info = document.createElement("div");
  info.className = "sound-info";
  const soundTitle = document.createElement("div");
  soundTitle.className   = "sound-title";
  soundTitle.textContent = meme.title;
  const soundMeta = document.createElement("div");
  soundMeta.className   = "sound-meta";
  soundMeta.textContent = `${meme.likes ?? 0} likes · Sound`;
  info.append(soundTitle, soundMeta);

  // Animated bars
  const bar = document.createElement("div");
  bar.className = "sound-bar";
  bar.innerHTML = "<span></span><span></span><span></span><span></span><span></span>";

  // Play/Pause button
  const playBtn = document.createElement("button");
  playBtn.className = "play-btn";
  playBtn.setAttribute("aria-label", "Play");
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

  playBtn.addEventListener("click", () => {
    // Pause all other playing sounds first
    document.querySelectorAll(".sound-card.playing").forEach(otherCard => {
      if (otherCard !== card) {
        const otherAudio = otherCard.querySelector("audio");
        const otherBtn   = otherCard.querySelector(".play-btn");
        if (otherAudio) otherAudio.pause();
        otherCard.classList.remove("playing");
        if (otherBtn) {
          otherBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
          otherBtn.setAttribute("aria-label", "Play");
        }
      }
    });

    const isPlaying = card.classList.toggle("playing");
    if (isPlaying) {
      audio.play().catch(() => {});
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      playBtn.setAttribute("aria-label", "Pause");
    } else {
      audio.pause();
      playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
      playBtn.setAttribute("aria-label", "Play");
    }
  });

  // Auto-reset when audio ends
  audio.addEventListener("ended", () => {
    card.classList.remove("playing");
    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    playBtn.setAttribute("aria-label", "Play");
  });

  card.append(audio, iconWrap, info, bar, playBtn);
  return card;
}

// ==============================
// RENDER HELPERS
// ==============================

function renderSection(containerId, countId, items, buildFn, emptyMsg = "Nothing here yet.") {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;

  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<p class="muted" style="padding:24px 0;">${emptyMsg}</p>`;
    if (countEl) countEl.textContent = "0 items";
    return;
  }

  const frag = document.createDocumentFragment();
  items.forEach(item => frag.appendChild(buildFn(item)));
  container.appendChild(frag);

  if (countEl) countEl.textContent = `${items.length} items`;
}

function renderMemes(containerId, countId, memes) {
  const container = document.getElementById(containerId);
  const countEl   = document.getElementById(countId);
  if (!container) return;

  container.innerHTML = "";

  if (!memes.length) {
    container.innerHTML = `<p class="muted" style="padding:24px 0;">No memes found.</p>`;
    if (countEl) countEl.textContent = "0 memes";
    return;
  }

  const frag = document.createDocumentFragment();
  memes.forEach(meme => frag.appendChild(buildCard(meme)));
  container.appendChild(frag);

  if (countEl) countEl.textContent = `${memes.length} memes`;
}

// ==============================
// FETCH FUNCTIONS
// ==============================

async function fetchMemes() {
  try {
    const memes = await fetchJSON(API_URL);
    renderMemes("home-container", "home-count", memes);
  } catch (err) {
    console.error("Home fetch failed:", err);
    showError("home-container", "Could not load memes. Please try again later.");
  }
}

async function fetchTrendingMemes() {
  try {
    const memes = await fetchJSON(TRENDING_API);
    renderMemes("trending-container", "trending-count", memes);
  } catch (err) {
    console.error("Trending fetch failed:", err);
    showError("trending-container", "Could not load trending memes.");
  }
}

async function fetchImages() {
  try {
    const items = await fetchJSON(IMAGES_API);
    renderSection("images-container", "images-count", items, buildImageCard, "No images uploaded yet.");
  } catch (err) {
    console.error("Images fetch failed:", err);
    showError("images-container", "Could not load images.");
  }
}

async function fetchVideos() {
  try {
    const items = await fetchJSON(VIDEOS_API);
    renderSection("videos-container", "videos-count", items, buildVideoCard, "No videos uploaded yet.");
  } catch (err) {
    console.error("Videos fetch failed:", err);
    showError("videos-container", "Could not load videos.");
  }
}

async function fetchTemplates() {
  try {
    const items = await fetchJSON(TEMPLATES_API);
    renderSection("templates-container", "templates-count", items, buildTemplateCard, "No templates uploaded yet.");
  } catch (err) {
    console.error("Templates fetch failed:", err);
    showError("templates-container", "Could not load templates.");
  }
}

async function fetchSounds() {
  try {
    const items = await fetchJSON(SOUNDS_API);
    // Sounds grid gets a special column width
    const container = document.getElementById("sounds-container");
    if (container) container.style.gridTemplateColumns = "repeat(auto-fill, minmax(320px, 1fr))";
    renderSection("sounds-container", "sounds-count", items, buildSoundCard, "No sounds uploaded yet.");
  } catch (err) {
    console.error("Sounds fetch failed:", err);
    showError("sounds-container", "Could not load sounds.");
  }
}

// ==============================
// LIKE HANDLER (delegated, optimistic UI)
// ==============================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;

  const memeId = btn.dataset.id;
  if (!memeId) return;

  if (localStorage.getItem(`liked_${memeId}`)) return;

  const countSpan = btn.querySelector("span") || btn;
  const icon      = btn.querySelector("i");
  const prev      = parseInt(btn.textContent.match(/\d+/)?.[0] ?? "0", 10);

  btn.disabled = true;
  btn.classList.add("liked");
  btn.setAttribute("aria-pressed", "true");
  if (icon) icon.className = "fa-solid fa-heart";
  btn.innerHTML = `<i class="fa-solid fa-heart"></i> Liked`;

  try {
    const res = await fetch(`${API_URL}/${memeId}/like`, { method: "PATCH" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    btn.innerHTML = `<i class="fa-solid fa-heart"></i> ${updated.likes ?? prev + 1} likes`;
    localStorage.setItem(`liked_${memeId}`, "true");
    fetchTrendingMemes();
  } catch (err) {
    console.error("Like failed:", err);
    btn.classList.remove("liked");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `<i class="fa-regular fa-heart"></i> Like`;
  } finally {
    btn.disabled = false;
  }
});

// ==============================
// FOOTER YEAR
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ==============================
// INITIAL DATA LOAD (Home + Trending always load upfront)
// ==============================

window.addEventListener("load", () => {
  fetchMemes();
  fetchTrendingMemes();
});
