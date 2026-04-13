/* ═══════════════════════════════════════════════
   script.js — RideNow Car & Bike Rental
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

/* ══ 1. Footer Year ══ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ══ 2. Navbar — Scroll Shadow ══ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ══ 3. Hamburger Menu ══ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ══ 4. Active Nav Link on Scroll ══ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[data-section]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav__link[data-section="${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ══ 5. Fade-in on Scroll ══ */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ══ 6. Counter Animation ══ */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || (target >= 100 ? '+' : '');
  const isFloat  = !Number.isInteger(target);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = target * eased;
    el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

/* ══ 7. Fleet Tab Switching ══ */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.fleet-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ══ 8. Fleet Sort ══ */
const sortSelect = document.getElementById('sort-select');

sortSelect.addEventListener('change', () => {
  const activePanel = document.querySelector('.fleet-panel.active');
  const grid = activePanel.querySelector('.grid');
  const cards = Array.from(grid.querySelectorAll('.vehicle-card'));

  cards.sort((a, b) => {
    const pa = parseInt(a.dataset.price);
    const pb = parseInt(b.dataset.price);
    if (sortSelect.value === 'price-asc')  return pa - pb;
    if (sortSelect.value === 'price-desc') return pb - pa;
    return 0;
  });

  cards.forEach(card => grid.appendChild(card));
  showToast('Sorted by ' + sortSelect.options[sortSelect.selectedIndex].text);
});

/* ══ 9. Toast Notification ══ */
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.className   = `toast ${type} show`;
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
}

/* ══ 10. Booking Form Validation ══ */
const bookingForm = document.getElementById('booking-form');
const searchBtn   = document.getElementById('search-btn');

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const required = ['pickup', 'pickup-date', 'pickup-time'];
  let valid = true;

  required.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    showToast('⚠️ Please fill in all required fields.', 'error');
    return;
  }

  const vehicle  = document.getElementById('vehicle-car').checked ? 'Car' : 'Bike';
  const pickup   = document.getElementById('pickup').value;
  const date     = document.getElementById('pickup-date').value;
  const days     = document.getElementById('rental-days').value;

  searchBtn.textContent = '🔍 Searching...';
  searchBtn.disabled    = true;

  setTimeout(() => {
    searchBtn.textContent = 'Search Available Rides';
    searchBtn.disabled    = false;
    showToast(`✅ ${vehicle} found from "${pickup}" on ${date} for ${days} day(s)!`);
  }, 1600);
});

/* ══ 11. Contact Form Validation ══ */
const contactForm = document.getElementById('contact-form');
const contactBtn  = document.getElementById('contact-btn');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const fields = [
    { id: 'c-name',    check: v => v.trim().length >= 2 },
    { id: 'c-phone',   check: v => /^\+?\d[\d\s]{8,}$/.test(v.trim()) },
    { id: 'c-email',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'c-subject', check: v => v !== '' },
    { id: 'c-message', check: v => v.trim().length >= 10 },
  ];

  let valid = true;
  fields.forEach(({ id, check }) => {
    const el = document.getElementById(id);
    el.classList.remove('error');
    if (!check(el.value)) {
      el.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    showToast('⚠️ Please check all fields and try again.', 'error');
    return;
  }

  contactBtn.textContent = '📤 Sending...';
  contactBtn.disabled    = true;

  setTimeout(() => {
    contactForm.reset();
    document.getElementById('char-count').textContent = '0';
    contactBtn.textContent = 'Send Message';
    contactBtn.disabled    = false;
    showToast("✅ Message sent! We'll get back to you within 2 hours.");
  }, 1700);
});

/* ══ 12. Character Counter for Message ══ */
const msgTextarea = document.getElementById('c-message');
const charCount   = document.getElementById('char-count');

if (msgTextarea) {
  msgTextarea.addEventListener('input', () => {
    const len = msgTextarea.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 280 ? '#f87171' : '';
    if (len > 300) msgTextarea.value = msgTextarea.value.slice(0, 300);
  });
}

/* ══ 13. Book Vehicle CTA from Fleet Cards ══ */
function bookVehicle(name, price) {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    showToast(`🚀 "${name}" selected — ₹${price}/day. Fill the form to confirm!`);
  }, 600);
}

/* ══ 14. Set Min Date for Pickup ══ */
const dateInput = document.getElementById('pickup-date');
if (dateInput) {
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

/* ══ 15. FAQ Accordion ══ */
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq__question');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ══ 16. Back to Top Button ══ */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

}); // END DOMContentLoaded
