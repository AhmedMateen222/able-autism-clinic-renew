/**
 * ABLE AUTISM CLINIC — JAVASCRIPT INTERACTIONS
 * Vanilla JS for Navigation, Accordion, Scroll Reveal, Back-to-Top, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initScrollReveal();
  initBackToTop();
  initForms();
  initWhatsAppTracker();
  initClickableCards();
});

/**
 * 1. NAVBAR & MOBILE DRAWER LOGIC
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky Navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  function toggleDrawer(open) {
    const shouldOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    if (shouldOpen) {
      hamburger?.classList.add('is-active');
      drawer?.classList.add('is-open');
      backdrop?.classList.add('is-open');
      hamburger?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      hamburger?.classList.remove('is-active');
      drawer?.classList.remove('is-open');
      backdrop?.classList.remove('is-open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  hamburger?.addEventListener('click', () => toggleDrawer());
  backdrop?.addEventListener('click', () => toggleDrawer(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('is-open')) {
      toggleDrawer(false);
    }
  });

  // Highlight current page active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (currentPath === 'index.html' && (href === './' || href === '/')) {
      link.classList.add('active');
    }
  });
}

/**
 * 2. FAQ ACCORDION
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Optional: Close other FAQs in the same section for clean accordion experience
      const parentContainer = item.closest('.faq-accordion');
      if (parentContainer) {
        parentContainer.querySelectorAll('.faq-item').forEach(sibling => {
          if (sibling !== item && sibling.classList.contains('is-open')) {
            sibling.classList.remove('is-open');
            const sibAnswer = sibling.querySelector('.faq-answer');
            const sibBtn = sibling.querySelector('.faq-question-btn');
            if (sibAnswer) sibAnswer.style.maxHeight = '0px';
            if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (isOpen) {
        item.classList.remove('is-open');
        if (answer) answer.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        if (answer) answer.style.maxHeight = (answer.scrollHeight + 30) + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 3. SCROLL REVEAL (IntersectionObserver)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older environments
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/**
 * 4. BACK TO TOP BUTTON
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 5. FORM VALIDATION & CLEAR FEEDBACK
 */
function initForms() {
  // Contact Form
  const contactForm = document.getElementById('contactClinicForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const phoneInput = document.getElementById('contactPhone');
      const messageInput = document.getElementById('contactMessage');
      const successBanner = document.getElementById('contactSuccessBanner');

      // Clear previous error states
      contactForm.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please provide a valid email address');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message or question');
        isValid = false;
      }

      if (isValid) {
        // Static submission feedback simulation
        contactForm.style.display = 'none';
        if (successBanner) {
          successBanner.classList.add('is-visible');
        }
      }
    });
  }

  // Appointment / Consultation Request Form
  const appointmentForm = document.getElementById('consultationRequestForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const parentName = document.getElementById('parentName');
      const childName = document.getElementById('childName');
      const childAge = document.getElementById('childAge');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const serviceInterest = document.getElementById('serviceInterest');
      const successBanner = document.getElementById('appointmentSuccessBanner');

      appointmentForm.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      if (!parentName.value.trim()) {
        showError(parentName, 'Parent or guardian name is required');
        isValid = false;
      }

      if (!childName.value.trim()) {
        showError(childName, "Please enter your child's name");
        isValid = false;
      }

      if (!childAge.value.trim()) {
        showError(childAge, "Please indicate your child's age");
        isValid = false;
      }

      if (!phone.value.trim() || phone.value.trim().length < 7) {
        showError(phone, 'Please provide a valid phone number');
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }

      if (!serviceInterest || !serviceInterest.value) {
        showError(serviceInterest, 'Please select a primary therapy or program of interest');
        isValid = false;
      }

      if (isValid) {
        appointmentForm.style.display = 'none';
        if (successBanner) {
          successBanner.classList.add('is-visible');
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  function showError(inputEl, message) {
    if (!inputEl) return;
    const group = inputEl.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errorMsg = group.querySelector('.form-error-msg');
      if (errorMsg) errorMsg.textContent = message;

      // Clear error as soon as user types or changes
      const clearErr = () => {
        group.classList.remove('has-error');
        inputEl.removeEventListener('input', clearErr);
        inputEl.removeEventListener('change', clearErr);
      };
      inputEl.addEventListener('input', clearErr);
      inputEl.addEventListener('change', clearErr);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/**
 * 6. WHATSAPP TRACKER / ACCESSIBILITY HELPER
 */
function initWhatsAppTracker() {
  const waBtn = document.querySelector('.floating-whatsapp-btn');
  if (!waBtn) return;

  // Ensure keyboard accessibility
  if (!waBtn.hasAttribute('tabindex')) {
    waBtn.setAttribute('tabindex', '0');
  }
}

/**
 * 7. CLICKABLE SERVICE & CONTENT CARDS
 * Ensures clicking anywhere on the highlighted/hovered card area navigates to the target link
 */
function initClickableCards() {
  const cards = document.querySelectorAll('.service-card, .program-card, .resource-card');

  cards.forEach(card => {
    // If the card itself is an <a>, browser natively handles navigation.
    // If the card is a <div> containing a link (e.g. .card-learn-more or a.btn), make the whole card clickable.
    if (card.tagName.toLowerCase() !== 'a') {
      const primaryLink = card.querySelector('.card-learn-more, a.btn, a[href]');
      if (primaryLink) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          // If clicked directly on a link or button inside, let standard behavior handle it
          if (e.target.closest('a, button')) return;
          primaryLink.click();
        });
      }
    }
  });
}

