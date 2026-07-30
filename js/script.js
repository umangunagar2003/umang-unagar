/* ==========================================================================
   Portfolio — script.js
   Modular vanilla JS: navbar, mobile menu, typing effect, dark mode,
   scroll reveal (AOS), active nav highlight, skill bars, form validation,
   back to top.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initTypedText();
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavHighlight();
  initThemeToggle();
  initSkillsCarousel();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initMagneticButtons();
});

/* ==========================================================================
   AOS (Animate On Scroll) init
   ========================================================================== */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-quart',
      once: true,
      offset: 60,
    });
  }
}

/* ==========================================================================
   Magnetic buttons — subtle cursor-follow effect on .magnetic elements.
   Desktop / fine-pointer only; no-op on touch devices and respects
   prefers-reduced-motion. Purely additive: safe to remove the "magnetic"
   class from any element in index.html to opt it back out.
   ========================================================================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic');
  if (!buttons.length) return;

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ==========================================================================
   Typed.js hero animation
   ========================================================================== */
function initTypedText() {
  const el = document.getElementById('typed-text');
  if (!el || typeof Typed === 'undefined') return;

  new Typed('#typed-text', {
    strings: [
      'Full Stack Web Developer',
      'Frontend Engineer',
      'Backend Developer',
      'Problem Solver',
    ],
    typeSpeed: 55,
    backSpeed: 30,
    backDelay: 1500,
    startDelay: 300,
    loop: true,
    smartBackspace: true,
  });
}

/* ==========================================================================
   Sticky navbar background change on scroll
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* ==========================================================================
   Mobile hamburger menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  if (!menuToggle || !mobileMenu) return;

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (menuIcon) {
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  };

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (menuIcon) {
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    }
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   Smooth scrolling for in-page anchor links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}

/* ==========================================================================
   Active section highlight in navbar (Intersection Observer)
   ========================================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === id);
    });
    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   Dark mode toggle with localStorage persistence
   ========================================================================== */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleBtnMobile = document.getElementById('theme-toggle-mobile');
  const themeIcon = document.getElementById('theme-icon');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.classList.add('dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    } else {
      root.classList.remove('dark');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  };

  // Determine initial theme: stored preference > system preference > light
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  const toggleTheme = () => {
    const isDark = root.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', toggleTheme);
}

/* ========================================================================
   Skills carousel — filterable, touch-friendly and dependency-free.
   ======================================================================== */
function initSkillsCarousel() {
  const viewport = document.getElementById('skills-viewport');
  const track = document.getElementById('skills-track');
  if (!viewport || !track) return;

  const cards = Array.from(track.querySelectorAll('.technology-card'));
  const tabs = document.querySelectorAll('.skill-tab');
  const arrows = document.querySelectorAll('.skill-arrow');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = false;

  const visibleCards = () => cards.filter((card) => card.style.display !== 'none');

  const move = (direction) => {
    const firstVisible = visibleCards()[0];
    if (!firstVisible) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    const distance = firstVisible.getBoundingClientRect().width + gap;
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;

    if (direction > 0 && atEnd) {
      viewport.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      viewport.scrollBy({ left: direction * distance, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  const setCategory = (category) => {
    cards.forEach((card) => {
      const show = category === 'all' || card.dataset.skillCategory === category;
      card.style.display = show ? '' : 'none';
    });
    viewport.scrollTo({ left: 0, behavior: 'auto' });
    tabs.forEach((tab) => {
      const active = tab.dataset.skillCategory === category;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => setCategory(tab.dataset.skillCategory)));
  arrows.forEach((arrow) => arrow.addEventListener('click', () => move(arrow.dataset.skillDirection === 'prev' ? -1 : 1)));

  viewport.addEventListener('mouseenter', () => { paused = true; });
  viewport.addEventListener('mouseleave', () => { paused = false; });
  viewport.addEventListener('focusin', () => { paused = true; });
  viewport.addEventListener('focusout', () => { paused = false; });

  if (!reduceMotion) {
    window.setInterval(() => {
      if (!paused && document.visibilityState === 'visible') move(1);
    }, 3600);
  }
}

/* ==========================================================================
   Project filtering — ready for future use
   Currently all projects share the "all" category; extend by adding
   data-category attributes to .project-card elements and wiring up
   filter buttons that call this function with a category value.
   ========================================================================== */
function initProjectFilter() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  window.filterProjects = function (category) {
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const show = category === 'all' || cardCategory === category;
      card.style.display = show ? '' : 'none';
    });
  };
}

/* ==========================================================================
   Contact form validation (client-side, no backend)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => value.trim().length >= 2,
      message: 'Please enter your name (at least 2 characters).',
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: 'Please enter a valid email address.',
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subject-error'),
      validate: (value) => value.trim().length >= 3,
      message: 'Please enter a subject (at least 3 characters).',
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => value.trim().length >= 10,
      message: 'Please enter a message (at least 10 characters).',
    },
  };

  const successMsg = document.getElementById('form-success');

  const validateField = (field) => {
    const { input, error, validate, message } = field;
    const isValid = validate(input.value);

    if (!isValid) {
      input.classList.add('input-error');
      error.textContent = message;
    } else {
      input.classList.remove('input-error');
      error.textContent = '';
    }
    return isValid;
  };

  // Real-time validation on blur
  Object.values(fields).forEach((field) => {
    field.input.addEventListener('blur', () => validateField(field));
    field.input.addEventListener('input', () => {
      if (field.input.classList.contains('input-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.values(fields).forEach((field) => {
      const valid = validateField(field);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      if (successMsg) {
        successMsg.classList.add('hidden');
        successMsg.classList.remove('flex');
      }
      return;
    }

    // No backend — simulate a successful submission
    if (successMsg) {
      successMsg.classList.remove('hidden');
      successMsg.classList.add('flex');
    }

    form.reset();
    Object.values(fields).forEach((field) => field.input.classList.remove('input-error'));

    // Hide success message after a few seconds
    setTimeout(() => {
      if (successMsg) {
        successMsg.classList.add('hidden');
        successMsg.classList.remove('flex');
      }
    }, 5000);
  });
}

/* ==========================================================================
   Back to top button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Footer year
   ========================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
