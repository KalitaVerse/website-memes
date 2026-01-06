/* ==============================
   TAB + DEEP LINK SYSTEM (FINAL)
   ============================== */

// All tab sections
const sections = document.querySelectorAll(".content");

// All sidebar links that point to hashes
const links = document.querySelectorAll(".sidebar a[href*='#']");

function activateSection(sectionId) {
  // Remove active state from all sections and links
  sections.forEach(section => section.classList.remove("active"));
  links.forEach(link => link.classList.remove("active"));

  // Activate the target section
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add("active");
  }

  // Activate the matching sidebar link
  const activeLink = document.querySelector(
    `.sidebar a[href$="#${sectionId}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "");
  activateSection(hash || "home");
}

// Run on initial page load
window.addEventListener("DOMContentLoaded", handleHashChange);

// Run on browser back / forward
window.addEventListener("hashchange", handleHashChange);

/* ==============================
   THEME TOGGLE
   ============================== */

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
  body.classList.remove("dark");
} else {
  body.classList.add("dark");
  body.classList.remove("light");
}

// Toggle theme
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
