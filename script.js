// Section switching
document.querySelectorAll(".sidebar a[data-section]").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    const section = link.dataset.section;
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
    document.getElementById(section).classList.add("active");
  });
});

// Theme toggle
const toggle = document.getElementById("themeToggle");
const body = document.body;

toggle.addEventListener("click", () => {
  body.classList.toggle("light");
  toggle.textContent = body.classList.contains("light") ? "🌞" : "🌙";
});
