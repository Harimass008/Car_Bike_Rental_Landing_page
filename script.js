js file 

<script>
  /* ── 1. Footer Year ── */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ── 2. Navbar Scroll Shadow ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ── 3. Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  /* ── 4. Active Nav Link on Scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link[data-section]');

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

  /* ── 5. Fade-in on Scroll ── */
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

  /* ── 6. Counter Animation ── */
  function animateCounter(el) {
    const target  = parseFloat(el.dataset.count);
    const suffix  = el.dataset.suffix || (target >= 100 ? '+' : '');
    const isFloat = !Number.isInteger(target);
    const duration = 1800;
    const start   = performance.now();

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

  /* ── 7. Fleet Tab Switching ── */
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

  /* ── 8. Toast Helper ── */
  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(msg, type = 'success') {
    clearTimeout(toastTimer);
    toastEl.textContent  = msg;
    toastEl.className    = `toast ${type} show`;
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  /* ── 9. Booking Form Validation ── */
  document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fields = ['pickup', 'pickup-date', 'pickup-time'];
    let valid = true;

    fields.forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });

    if (!valid) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const vehicle  = document.querySelector('input[name="vehicle-type"]:checked').id === 'vehicle-car' ? 'Car' : 'Bike';
    const pickup   = document.getElementById('pickup').value;
    const date     = document.getElementById('pickup-date').value;

    const btn = document.getElementById('search-btn');
    btn.textContent = 'Searching...';
    btn.disabled    = true;

    setTimeout(() => {
      btn.textContent = 'Search Available Rides';
      btn.disabled    = false;
      showToast(`✅ Found rides for ${vehicle} from ${pickup} on ${date}!`);
    }, 1500);
  });

  /* ── 10. Contact Form Validation ── */
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fields = [
      { id: 'name',    check: v => v.trim().length >= 2 },
      { id: 'phone',   check: v => /^\+?\d[\d\s]{8,}$/.test(v.trim()) },
      { id: 'email',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'subject', check: v => v.trim().length >= 3 },
      { id: 'message', check: v => v.trim().length >= 10 },
    ];

    let valid = true;
    fields.forEach(({ id, check }) => {
      const el = document.getElementById(id);
      el.classList.remove('error');
      if (!check(el.value)) { el.classList.add('error'); valid = false; }
    });

    if (!valid) {
      showToast('Please check all fields and try again.', 'error');
      return;
    }

    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    setTimeout(() => {
      this.reset();
      btn.textContent = 'Send Message';
      btn.disabled    = false;
      showToast('✅ Message sent! We\'ll get back to you soon.');
    }, 1600);
  });

  /* ── 11. Book Vehicle Quick CTA ── */
  function bookVehicle(name, price) {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => showToast(`🚀 ${name} selected — ₹${price}/day. Fill the form to confirm!`), 600);
  }

  /* ── 12. Set min date for pickup ── */
  const dateInput = document.getElementById('pickup-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
</script>

