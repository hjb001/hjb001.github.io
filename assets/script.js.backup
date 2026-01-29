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

// 3D tilt effect for cards
document.querySelectorAll(".card, .project, .grid article").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
  });
});

// Parallax effect for floating shapes
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

function animateShapes() {
  const shapes = document.querySelectorAll(".shape");
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 20;
    const x = mouseX * speed;
    const y = mouseY * speed;
    shape.style.transform = `translate(${x}px, ${y}px)`;
  });
  requestAnimationFrame(animateShapes);
}

animateShapes();
