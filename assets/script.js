// ==========================================
// Dark Mode Toggle
// ==========================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    localStorage.removeItem('theme');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
});

// ==========================================
// Mobile Navigation
// ==========================================

const navbarBurger = document.getElementById('navbarBurger');
const navbarMenu = document.getElementById('navbarMenu');

navbarBurger.addEventListener('click', () => {
  navbarMenu.classList.toggle('active');

  // Animate burger icon
  const spans = navbarBurger.querySelectorAll('span');
  if (navbarMenu.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  } else {
    spans.forEach(span => {
      span.style.transform = '';
      span.style.opacity = '';
    });
  }
});

// Close menu when clicking a link
navbarMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbarMenu.classList.remove('active');
    const spans = navbarBurger.querySelectorAll('span');
    spans.forEach(span => {
      span.style.transform = '';
      span.style.opacity = '';
    });
  });
});

// ==========================================
// Cards Carousel
// ==========================================

const cards = document.querySelectorAll('.info-card');
const prevBtn = document.getElementById('prevCard');
const nextBtn = document.getElementById('nextCard');
const dotsContainer = document.getElementById('carouselDots');
let currentCard = 0;
let autoPlayInterval;

// Create dots
cards.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('carousel-dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToCard(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function showCard(index) {
  cards.forEach(card => card.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  cards[index].classList.add('active');
  dots[index].classList.add('active');
  currentCard = index;
}

function nextCard() {
  const next = (currentCard + 1) % cards.length;
  showCard(next);
}

function prevCard() {
  const prev = (currentCard - 1 + cards.length) % cards.length;
  showCard(prev);
}

function goToCard(index) {
  showCard(index);
  resetAutoPlay();
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextCard, 4000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// Event listeners
nextBtn.addEventListener('click', () => {
  nextCard();
  resetAutoPlay();
});

prevBtn.addEventListener('click', () => {
  prevCard();
  resetAutoPlay();
});

// Start autoplay
startAutoPlay();

// Pause on hover
const cardsCarousel = document.querySelector('.cards-carousel');
cardsCarousel.addEventListener('mouseenter', stopAutoPlay);
cardsCarousel.addEventListener('mouseleave', startAutoPlay);

// ==========================================
// Back to Top Button
// ==========================================

const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#home') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault();
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ==========================================
// Word Cloud Animation Enhancement
// ==========================================

const cloudWords = document.querySelectorAll('.cloud-word');

cloudWords.forEach(word => {
  // Random animation delay
  const delay = Math.random() * 4;
  word.style.animationDelay = `-${delay}s`;

  // Add interactive rotation on mouse move
  word.addEventListener('mouseenter', function() {
    this.style.transform = `scale(1.3) rotate(${Math.random() * 20 - 10}deg)`;
  });

  word.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// Parallax effect for word cloud
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateWordCloud() {
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  cloudWords.forEach((word, index) => {
    const speed = (index % 3 + 1) * 10;
    const x = targetX * speed;
    const y = targetY * speed;
    word.style.transform = `translate(${x}px, ${y}px)`;
  });

  requestAnimationFrame(animateWordCloud);
}

animateWordCloud();

// ==========================================
// Intersection Observer for Scroll Animations
// ==========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe content sections
document.querySelectorAll('.content-section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(item);
});

// Observe experience cards
document.querySelectorAll('.experience-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
  observer.observe(card);
});

// Observe contact cards
document.querySelectorAll('.contact-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
  observer.observe(card);
});

// ==========================================
// Active Navigation Link Highlight
// ==========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.style.color = 'var(--accent-orange)';
    }
  });
});

// ==========================================
// Prevent FOUC (Flash of Unstyled Content)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
});

// ==========================================
// Console Easter Egg
// ==========================================

console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #ff6b3d;');
console.log('%cLooking at the code? I like your curiosity!', 'font-size: 14px; color: #2e6bff;');
console.log('%cFeel free to reach out if you want to collaborate!', 'font-size: 12px; color: #666;');

// ==========================================
// Performance Optimization
// ==========================================

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize window resize handler
window.addEventListener('resize', debounce(() => {
  // Recalculate any layout-dependent features
  console.log('Window resized');
}, 250));

// ==========================================
// Accessibility Enhancements
// ==========================================

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevCard();
    resetAutoPlay();
  } else if (e.key === 'ArrowRight') {
    nextCard();
    resetAutoPlay();
  }
});

// Focus management for mobile menu
navbarBurger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navbarBurger.click();
  }
});

// Announce theme change to screen readers
themeToggle.addEventListener('click', () => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  announcement.textContent = body.classList.contains('dark-mode')
    ? 'Dark mode enabled'
    : 'Light mode enabled';
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
});
