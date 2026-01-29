// ===================================
// Global Functions
// ===================================

function goHome() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ===================================
// Dark Mode Toggle
// ===================================

const darkModeToggle = document.getElementById('dark-mode-toggle-mobile');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  if (darkModeToggle) {
    darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
  }
}

// Toggle theme
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    body.classList.toggle('dark-mode');

    const icon = darkModeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      localStorage.removeItem('theme');
      icon.classList.replace('fa-sun', 'fa-moon');
    }

    // Restart word cloud with new theme
    setTimeout(initWordCloud, 300);
  });
}

// ===================================
// Mobile Navigation
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach(el => {
    el.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });

  // Close mobile menu when clicking a link
  const navbarLinks = document.querySelectorAll('.navbar-menu a');
  navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const burger = document.querySelector('.navbar-burger');
      const menu = document.querySelector('.navbar-menu');
      if (burger && menu) {
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
      }
    });
  });
});

// ===================================
// Card Carousel
// ===================================

let currentCardIndex = 0;
const cards = document.querySelectorAll('.card-container .card');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let autoPlayInterval;

function showCard(index) {
  cards.forEach(card => card.classList.remove('active-card'));
  cards[index].classList.add('active-card');
  currentCardIndex = index;
}

function nextCard() {
  const next = (currentCardIndex + 1) % cards.length;
  showCard(next);
}

function prevCard() {
  const prev = (currentCardIndex - 1 + cards.length) % cards.length;
  showCard(prev);
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

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    prevCard();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextCard();
    resetAutoPlay();
  });

  // Start autoplay
  startAutoPlay();

  // Pause on hover
  const cardContainer = document.querySelector('.card-container');
  if (cardContainer) {
    cardContainer.addEventListener('mouseenter', stopAutoPlay);
    cardContainer.addEventListener('mouseleave', startAutoPlay);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevCard();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextCard();
      resetAutoPlay();
    }
  });
}

// ===================================
// TagCanvas 3D Word Cloud
// ===================================

function initWordCloud() {
  if (typeof TagCanvas === 'undefined') {
    console.warn('TagCanvas library not loaded');
    return;
  }

  try {
    const isDarkMode = body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#FFFFFF';
    const outlineColor = isDarkMode ? 'rgba(224, 224, 224, 0.5)' : 'rgba(255, 255, 255, 0.5)';

    TagCanvas.Start('word-cloud', 'tags', {
      textColour: textColor,
      outlineColour: outlineColor,
      reverse: true,
      depth: 0.8,
      maxSpeed: 0.03,
      textFont: 'Work Sans, sans-serif',
      textHeight: 20,
      shuffleTags: true,
      initial: [0.1, -0.1],
      decel: 0.98,
      dragControl: true,
      weight: true,
      weightMode: 'size',
      weightSize: 1,
      weightSizeMin: 15,
      weightSizeMax: 30,
      shape: 'sphere',
      tooltip: 'native',
      tooltipDelay: 0,
      zoom: 0.9,
      noMouse: false
    });

    // Auto-restart word cloud rotation
    setupWordCloudAutoRestart();
  } catch (e) {
    console.error('TagCanvas initialization error:', e);
  }
}

function setupWordCloudAutoRestart() {
  const canvas = document.getElementById('word-cloud');
  if (!canvas) return;

  let restartTimer = null;
  let isUserInteracting = false;
  let lastInteractionTime = Date.now();

  canvas.addEventListener('mousedown', () => {
    isUserInteracting = true;
    lastInteractionTime = Date.now();
    if (restartTimer) clearTimeout(restartTimer);
  });

  document.addEventListener('mouseup', () => {
    if (isUserInteracting) {
      isUserInteracting = false;
      lastInteractionTime = Date.now();

      if (restartTimer) clearTimeout(restartTimer);

      restartTimer = setTimeout(() => {
        const timeSinceLastInteraction = Date.now() - lastInteractionTime;
        if (timeSinceLastInteraction >= 3000 && !isUserInteracting) {
          startWordCloudRotation();
        }
      }, 3000);
    }
  });

  canvas.addEventListener('mousemove', () => {
    if (isUserInteracting) {
      lastInteractionTime = Date.now();
    }
  });
}

function startWordCloudRotation() {
  if (typeof TagCanvas === 'undefined') return;

  try {
    const canvas = document.getElementById('word-cloud');
    if (canvas && canvas.tc) {
      canvas.tc.animating = true;
      canvas.tc.active = true;

      if (canvas.tc.taglist && canvas.tc.taglist.length > 0) {
        canvas.tc.taglist.forEach(tag => {
          tag.vx = (Math.random() - 0.5) * 0.02;
          tag.vy = (Math.random() - 0.5) * 0.02;
        });
      }

      if (canvas.tc.Draw) {
        canvas.tc.Draw();
      }
    }
  } catch (e) {
    console.error('Error restarting word cloud rotation:', e);
  }
}

// Initialize word cloud when page loads
window.addEventListener('load', () => {
  setTimeout(initWordCloud, 300);
});

// ===================================
// Smooth Scroll
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href === '#' || !href) {
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
      const offsetTop = targetElement.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// Back to Top Button
// ===================================

const backToTop = document.getElementById('back-to-top');

if (backToTop) {
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
}

// ===================================
// Scroll Animations
// ===================================

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

// Observe sections
document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// ===================================
// Active Navigation Highlight
// ===================================

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
    link.classList.remove('is-active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('is-active');
      link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    } else {
      link.style.backgroundColor = '';
    }
  });
});

// ===================================
// Console Easter Egg
// ===================================

console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #ff6b3d;');
console.log('%cWelcome to Junbo Huang\'s Portfolio', 'font-size: 14px; color: #2e6bff;');
console.log('%cFeel free to reach out if you want to collaborate!', 'font-size: 12px; color: #666;');

// ===================================
// Performance Optimizations
// ===================================

// Debounce function
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

// Optimize window resize
window.addEventListener('resize', debounce(() => {
  // Restart word cloud on resize
  if (typeof TagCanvas !== 'undefined') {
    setTimeout(initWordCloud, 300);
  }
}, 250));
