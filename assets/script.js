const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "ink") {
  root.setAttribute("data-theme", "ink");
}

toggle.addEventListener("click", () => {
  const isInk = root.getAttribute("data-theme") === "ink";
  if (isInk) {
    root.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    root.setAttribute("data-theme", "ink");
    localStorage.setItem("theme", "ink");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("section, .hero-right .card").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});
