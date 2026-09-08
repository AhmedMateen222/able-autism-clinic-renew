/**
 * ABLE AUTISM CLINIC — JAVASCRIPT INTERACTIONS
 * Vanilla JS for Navigation, Accordion, Scroll Reveal, Back-to-Top, and Form Validation
 */

import { submitAppointment } from './supabase.js';

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
    let isSubmitting = false;

    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      let isValid = true;

      const parentName = document.getElementById('parentName');
      const childName = document.getElementById('childName');
      const childAge = document.getElementById('childAge');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const serviceInterest = document.getElementById('serviceInterest');
      const preferredSchedule = document.getElementById('preferredSchedule');
      const diagnosisStatus = document.getElementById('diagnosisStatus');
      const additionalNotes = document.getElementById('additionalNotes');
      const submitBtn = document.getElementById('submitAppointmentBtn');
      const successBanner = document.getElementById('appointmentSuccessBanner');
      const errorBanner = document.getElementById('appointmentFormError');
      const errorText = document.getElementById('appointmentFormErrorText');

      // Clear any previous form-level error alert
      if (errorBanner) {
        errorBanner.classList.remove('is-visible');
        errorBanner.style.display = 'none';
      }

      appointmentForm.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      if (!parentName || !parentName.value.trim()) {
        showError(parentName, 'Parent or guardian name is required');
        isValid = false;
      }

      if (!childName || !childName.value.trim()) {
        showError(childName, "Please enter your child's name");
        isValid = false;
      }

      if (!childAge || !childAge.value.trim()) {
        showError(childAge, "Please indicate your child's age");
        isValid = false;
      }

      if (!phone || !phone.value.trim() || phone.value.trim().length < 7) {
        showError(phone, 'Please provide a valid phone number');
        isValid = false;
      }

      if (!email || !email.value.trim() || !isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }

      if (!serviceInterest || !serviceInterest.value) {
        showError(serviceInterest, 'Please select a primary therapy or program of interest');
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Map fields strictly as specified:
      // parentName → parent_name
      // childName → child_name
      // childAge → child_age
      // phone → phone
      // email → email
      // serviceInterest → service_interest
      // preferredSchedule → preferred_schedule
      // diagnosisStatus → diagnosis_status
      // additionalNotes → additional_notes
      const formData = {
        parent_name: parentName.value.trim(),
        child_name: childName.value.trim(),
        child_age: childAge.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        service_interest: serviceInterest.value,
        preferred_schedule: preferredSchedule ? preferredSchedule.value : '',
        diagnosis_status: diagnosisStatus ? diagnosisStatus.value : '',
        additional_notes: additionalNotes ? additionalNotes.value.trim() : ''
      };

      // Prevent duplicate submissions while request is being processed
      isSubmitting = true;
      let originalBtnContent = '';
      if (submitBtn) {
        originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.classList.add('is-submitting');
        submitBtn.innerHTML = '<span>Submitting Request...</span>';
      }

      try {
        await submitAppointment(formData);

        // Success: hide form and show existing success banner
        appointmentForm.reset();
        appointmentForm.style.display = 'none';
        if (successBanner) {
          successBanner.classList.add('is-visible');
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        console.error('Error saving appointment to Supabase:', err);

        // Show clear error message to user
        if (errorBanner) {
          const message = err?.message || 'An error occurred while submitting your appointment. Please try again or contact us directly.';
          if (errorText) {
            errorText.textContent = message;
          } else {
            errorBanner.textContent = message;
          }
          errorBanner.style.display = 'flex';
          errorBanner.classList.add('is-visible');
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-submitting');
          submitBtn.innerHTML = originalBtnContent;
        }
      } finally {
        isSubmitting = false;
      }
    });

    // Automatically hide error alert when user modifies inputs
    appointmentForm.addEventListener('input', () => {
      const errorBanner = document.getElementById('appointmentFormError');
      if (errorBanner && errorBanner.classList.contains('is-visible')) {
        errorBanner.classList.remove('is-visible');
        errorBanner.style.display = 'none';
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

