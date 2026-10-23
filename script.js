/* ==========================================================================
   Bella Vista Restaurant — Script
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Single source of truth for contact details (HTML links are filled from this) */
  var SITE = {
    phoneE164: '919999999999',
    phoneLabel: '+91 99999 99999',
    address: '12 Vista Lane, Marina District, Mumbai'
  };

  // Things that should wait until the loading screen is gone (hero text, typing)
  var ready = false, readyQueue = [];
  function onReady(fn) { if (ready) fn(); else readyQueue.push(fn); }
  function markReady() {
    if (ready) return;
    ready = true;
    readyQueue.splice(0).forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }

  function init() {
    // Each feature runs on its own, so one failure can't stop the rest.
    [
      setYear, loadingScreen, applyContactInfo, scrollProgress, headerScroll, mobileNav, darkModeToggle,
      typingEffect, scrollReveal, counterAnimation, renderMenu, menuFilterAndSearch, countdownTimer,
      galleryLightbox, testimonialSlider, faqAccordion, mapConsent, reservationForm, contactForm,
      newsletterForm, rippleButtons, backToTop
    ].forEach(function (fn) {
      try { fn(); } catch (err) { if (window.console) console.error('Bella Vista: ' + (fn.name || 'feature') + ' failed', err); }
    });
  }

  /* ---------------- Contact info from SITE ---------------- */
  function applyContactInfo() {
    document.querySelectorAll('[data-phone]').forEach(function (a) {
      a.href = a.getAttribute('data-phone') === 'wa' ? 'https://wa.me/' + SITE.phoneE164 : 'tel:+' + SITE.phoneE164;
    });
    document.querySelectorAll('[data-phone-text]').forEach(function (el) { el.textContent = SITE.phoneLabel; });
    document.querySelectorAll('[data-address]').forEach(function (el) { el.textContent = SITE.address; });
  }

  /* ---------------- Map (loads only after the visitor agrees) ---------------- */
  function mapConsent() {
    var box = document.getElementById('map-consent');
    var btn = document.getElementById('load-map-btn');
    var link = document.getElementById('map-link');
    if (!box || !btn) return;
    var q = encodeURIComponent(SITE.address);
    if (link) link.href = 'https://www.google.com/maps/search/?api=1&query=' + q;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.title = 'Bella Vista Restaurant location map';
      f.src = 'https://maps.google.com/maps?q=' + q + '&z=15&output=embed';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.replaceWith(f);
    });
  }

  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------------- Loading screen ---------------- */
  function loadingScreen() {
    var screen = document.getElementById('loading-screen');
    if (!screen) { markReady(); return; }
    function hide() { screen.classList.add('hidden'); markReady(); }
    window.addEventListener('load', function () { setTimeout(hide, 500); });
    // fallback in case load already fired
    setTimeout(hide, 2500);
  }

  /* ---------------- Scroll progress bar ---------------- */
  function scrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    });
  }

  /* ---------------- Sticky header ---------------- */
  function headerScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    function toggle() {
      if (window.scrollY > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    toggle();
    window.addEventListener('scroll', toggle);

    // Active link highlight
    var sections = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 120;
      sections.forEach(function (sec) {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var active = document.querySelector('.nav-link[href="#' + sec.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    });
  }

  /* ---------------- Mobile navigation ---------------- */
  function mobileNav() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');
    if (!hamburger || !nav) return;
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Dark mode ---------------- */
  function darkModeToggle() {
    var btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    var icon = btn.querySelector('i');
    function apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    var stored = null;
    try { stored = localStorage.getItem('bv-theme'); } catch (e) {}
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    apply(stored || (mq && mq.matches ? 'dark' : 'light'));
    btn.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    // follow the system setting until the visitor makes their own choice
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) {
        var chosen = null;
        try { chosen = localStorage.getItem('bv-theme'); } catch (err) {}
        if (!chosen) apply(e.matches ? 'dark' : 'light');
      });
    }
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('bv-theme', next); } catch (err) {}
      apply(next);
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });
  }

  /* ---------------- Typing effect ---------------- */
  function typingEffect() {
    var el = document.getElementById('typing-text');
    if (!el) return;
    var phrases = [
      'Fine Dining Experience Like Never Before',
      'Italian Passion. Continental Elegance.',
      'Where Every Plate Tells A Story'
    ];
    if (reduceMotion) { el.textContent = phrases[0]; return; }
    el.textContent = '';
    var phraseIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      var current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    }
    onReady(tick);
  }

  /* ---------------- Scroll reveal ---------------- */
  function scrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    function show(el) {
      el.classList.add('in-view');
      // after the fade, drop .reveal so the element's own hover transitions apply normally
      setTimeout(function () { el.classList.remove('reveal', 'in-view'); el.style.removeProperty('--d'); }, 1700);
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) {
      el.style.setProperty('--d', i % 5);
      if (el.closest('.hero')) onReady(function () { observer.observe(el); }); // wait for the loader
      else observer.observe(el);
    });
  }

  /* ---------------- Counter animation ---------------- */
  function counterAnimation() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    var animated = false;
    function animate() {
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        if (reduceMotion) { counter.textContent = target; return; }
        var duration = 1400;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          counter.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else counter.textContent = target;
        }
        requestAnimationFrame(step);
      });
    }
    var statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animate();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(statsSection);
  }

  /* ---------------- Menu data + render ---------------- */
  var MENU_ITEMS = [
    { id: 1, name: 'Bruschetta al Pomodoro', desc: 'Toasted sourdough, vine tomatoes, basil, garlic oil.', price: 340, cat: 'starters', veg: true, spice: 0, img: 'https://picsum.photos/id/292/400/300' },
    { id: 2, name: 'Peri Peri Chicken Wings', desc: 'Flame-grilled wings tossed in smoky peri peri.', price: 420, cat: 'starters', veg: false, spice: 2, img: 'https://picsum.photos/id/1080/400/300' },
    { id: 3, name: 'Truffle Butter Risotto', desc: 'Arborio rice, wild mushrooms, shaved black truffle.', price: 690, cat: 'main', veg: true, spice: 0, img: 'https://picsum.photos/id/431/400/300' },
    { id: 4, name: 'Grilled Lemon Herb Salmon', desc: 'Norwegian salmon, herb butter, roasted vegetables.', price: 890, cat: 'main', veg: false, spice: 0, img: 'https://picsum.photos/id/1080/400/300' },
    { id: 5, name: 'Margherita Pizza', desc: 'San Marzano tomato, fior di latte, fresh basil.', price: 450, cat: 'pizza', veg: true, spice: 0, img: 'https://picsum.photos/id/1080/400/300' },
    { id: 6, name: 'Diavola Pizza', desc: 'Spicy salami, chili flakes, mozzarella, tomato.', price: 520, cat: 'pizza', veg: false, spice: 2, img: 'https://picsum.photos/id/292/400/300' },
    { id: 7, name: 'Spaghetti Aglio e Olio', desc: 'Garlic, chili, olive oil, parsley, parmesan.', price: 420, cat: 'pasta', veg: true, spice: 1, img: 'https://picsum.photos/id/431/400/300' },
    { id: 8, name: 'Fettuccine Alfredo Chicken', desc: 'Creamy parmesan sauce, grilled chicken breast.', price: 540, cat: 'pasta', veg: false, spice: 0, img: 'https://picsum.photos/id/1080/400/300' },
    { id: 9, name: 'Butter Chicken', desc: 'Tandoori chicken simmered in a rich tomato gravy.', price: 480, cat: 'indian', veg: false, spice: 1, img: 'https://picsum.photos/id/1025/400/300' },
    { id: 10, name: 'Paneer Tikka Masala', desc: 'Char-grilled paneer in a spiced onion-tomato curry.', price: 440, cat: 'indian', veg: true, spice: 2, img: 'https://picsum.photos/id/1027/400/300' },
    { id: 11, name: 'Tiramisu', desc: 'Espresso-soaked ladyfingers, mascarpone cream.', price: 320, cat: 'desserts', veg: true, spice: 0, img: 'https://picsum.photos/id/106/400/300' },
    { id: 12, name: 'Gulab Jamun', desc: 'Warm milk dumplings in cardamom sugar syrup.', price: 220, cat: 'desserts', veg: true, spice: 0, img: 'https://picsum.photos/id/106/400/300' },
    { id: 13, name: 'Virgin Mojito', desc: 'Mint, lime, soda, a touch of sugarcane.', price: 220, cat: 'drinks', veg: true, spice: 0, img: 'https://picsum.photos/id/163/400/300' },
    { id: 14, name: 'Masala Chai', desc: 'Slow-brewed spiced tea with fresh milk.', price: 140, cat: 'drinks', veg: true, spice: 0, img: 'https://picsum.photos/id/225/400/300' }
  ];

  function spiceLabel(level) {
    if (level === 0) return '';
    return '🌶'.repeat(level);
  }

  var menuStatusReady = false;
  function announceMenu(n) {
    var st = document.getElementById('menu-status');
    if (!st) return;
    if (!menuStatusReady) { menuStatusReady = true; return; } // stay quiet on first render
    st.textContent = n === 0 ? 'No dishes match your search.' : n + (n === 1 ? ' dish shown.' : ' dishes shown.');
  }

  function renderMenu(filtered) {
    var grid = document.getElementById('menu-grid');
    if (!grid) return;
    var items = filtered || MENU_ITEMS;
    var empty = document.getElementById('menu-empty');
    if (!items.length) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      announceMenu(0);
      return;
    }
    if (empty) empty.hidden = true;
    announceMenu(items.length);

    grid.innerHTML = items.map(function (item) {
      return (
        '<div class="menu-card" data-category="' + item.cat + '">' +
          '<div class="menu-card-img">' +
            '<img src="' + item.img + '" alt="' + item.name + '" width="400" height="300" loading="lazy">' +
            '<span class="menu-badge ' + (item.veg ? 'veg' : 'nonveg') + '" role="img" aria-label="' + (item.veg ? 'Vegetarian' : 'Non-vegetarian') + '" title="' + (item.veg ? 'Vegetarian' : 'Non-vegetarian') + '"></span>' +
            (item.spice ? '<span class="menu-spice" role="img" aria-label="Spice level ' + item.spice + ' of 3">' + spiceLabel(item.spice) + '</span>' : '') +
          '</div>' +
          '<div class="menu-card-body">' +
            '<div class="menu-card-top"><h3>' + item.name + '</h3><span class="menu-price">₹' + item.price + '</span></div>' +
            '<p>' + item.desc + '</p>' +
            '<button class="add-cart-btn" data-id="' + item.id + '"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    grid.querySelectorAll('.add-cart-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.classList.add('added');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        setTimeout(function () {
          btn.classList.remove('added');
          btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
        }, 1500);
      });
    });
  }

  function menuFilterAndSearch() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var searchInput = document.getElementById('menu-search-input');
    if (!filterBtns.length) return;
    var activeFilter = 'all';

    function apply() {
      var query = (searchInput && searchInput.value.trim().toLowerCase()) || '';
      var filtered = MENU_ITEMS.filter(function (item) {
        var matchesCategory = activeFilter === 'all' || item.cat === activeFilter;
        var matchesSearch = !query ||
          item.name.toLowerCase().indexOf(query) !== -1 ||
          item.desc.toLowerCase().indexOf(query) !== -1;
        return matchesCategory && matchesSearch;
      });
      renderMenu(filtered);
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeFilter = btn.getAttribute('data-filter');
        apply();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', apply);
    }
  }

  /* ---------------- Countdown timer ---------------- */
  function countdownTimer() {
    var daysEl = document.getElementById('cd-days');
    if (!daysEl) return;
    var hoursEl = document.getElementById('cd-hours');
    var minsEl = document.getElementById('cd-minutes');
    var secsEl = document.getElementById('cd-seconds');

    function nextSunday() {
      var now = new Date();
      var day = now.getDay(); // 0 = Sunday
      var daysUntilSunday = (7 - day) % 7; // today if Sunday
      var target = new Date(now);
      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(23, 59, 59, 0);
      return target;
    }

    var target = nextSunday();

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var now = new Date();
      var diff = target - now;
      if (diff <= 0) { target = nextSunday(); diff = target - now; }
      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var m = Math.floor((diff / (1000 * 60)) % 60);
      var s = Math.floor((diff / 1000) % 60);
      daysEl.textContent = pad(d);
      hoursEl.textContent = pad(h);
      minsEl.textContent = pad(m);
      secsEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- Gallery lightbox ---------------- */
  function galleryLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var lightbox = document.getElementById('lightbox');
    if (!items.length || !lightbox) return;
    var imgEl = document.getElementById('lightbox-img');
    var captionEl = document.getElementById('lightbox-caption');
    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');
    var currentIndex = 0;
    var lastTrigger = null;

    function render() {
      var item = items[currentIndex];
      imgEl.src = item.getAttribute('data-img');
      imgEl.alt = item.getAttribute('data-caption') || '';
      captionEl.textContent = item.getAttribute('data-caption') || '';
    }
    function open(index) {
      lastTrigger = document.activeElement;
      currentIndex = index;
      render();
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    }
    function show(delta) {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render(); // update content only; keep focus where it is
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { open(i); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(-1); });
    nextBtn.addEventListener('click', function () { show(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(-1);
      if (e.key === 'ArrowRight') show(1);
      if (e.key === 'Tab') { // focus trap
        var f = [closeBtn, prevBtn, nextBtn];
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (f.indexOf(document.activeElement) === -1) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------------- Testimonials slider ---------------- */
  function testimonialSlider() {
    var track = document.getElementById('testimonial-track');
    if (!track) return;
    var cards = track.children;
    var dotsWrap = document.getElementById('testimonial-dots');
    var index = 0;

    for (var i = 0; i < cards.length; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.type = 'button';
      if (i === 0) dot.classList.add('active');
      (function (idx) {
        dot.addEventListener('click', function () { goTo(idx); });
      })(i);
      dotsWrap.appendChild(dot);
    }

    function goTo(i) {
      index = i;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
        d.classList.toggle('active', di === index);
        if (di === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      markSlides();
    }

    // Hide off-screen slides from Tab and screen readers
    function markSlides() {
      Array.prototype.forEach.call(cards, function (card, ci) {
        var on = ci === index;
        card.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on) card.removeAttribute('inert'); else card.setAttribute('inert', '');
      });
    }
    markSlides();
    if (dotsWrap.firstChild) dotsWrap.firstChild.setAttribute('aria-current', 'true');

    function next() { goTo((index + 1) % cards.length); }

    var slider = track.parentElement;
    var timer = null, userPaused = reduceMotion; // no autoplay if the visitor prefers reduced motion
    function start() { stop(); if (!userPaused) timer = setInterval(next, 5000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    var pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.className = 'testimonial-pause';
    function label() { pauseBtn.textContent = userPaused ? 'Play slideshow' : 'Pause slideshow'; }
    label();
    pauseBtn.addEventListener('click', function () { userPaused = !userPaused; label(); start(); });
    dotsWrap.parentElement.appendChild(pauseBtn);

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    start();
  }

  /* ---------------- FAQ accordion ---------------- */
  function faqAccordion() {
    var questions = document.querySelectorAll('.faq-question');
    questions.forEach(function (btn, qi) {
      var answer = btn.nextElementSibling;
      btn.id = btn.id || 'faq-q-' + qi;
      answer.id = answer.id || 'faq-a-' + qi;
      btn.setAttribute('aria-controls', answer.id);
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', btn.id);
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        questions.forEach(function (q) {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.style.maxHeight = null;
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------- Form validation helpers ---------------- */
  function showError(input, message) {
    var group = input.closest('.form-group');
    var errorEl = group && group.querySelector('.error-msg');
    if (group) group.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      if (!errorEl.id) errorEl.id = (input.id || 'field') + '-error';
      input.setAttribute('aria-describedby', errorEl.id);
    }
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input) {
    var group = input.closest('.form-group');
    var errorEl = group && group.querySelector('.error-msg');
    if (group) group.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
  // Marks every empty required field in `ids`; returns true if all were filled
  function checkRequired(ids) {
    var ok = true;
    ids.forEach(function (id) {
      var input = document.getElementById(id);
      clearError(input);
      if (!input.value.trim()) { showError(input, 'This field is required.'); ok = false; }
    });
    return ok;
  }
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---------------- Reservation form ---------------- */
  function reservationForm() {
    var form = document.getElementById('reservation-form');
    if (!form) return;
    var success = document.getElementById('form-success');

    var dateInput = document.getElementById('res-date');
    function localISO(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    if (dateInput) dateInput.min = localISO(new Date());

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = checkRequired(['res-name', 'res-phone', 'res-email', 'res-date', 'res-time', 'res-guests']);
      var phone = document.getElementById('res-phone');
      if (phone.value && !/^[0-9+\-\s]{7,15}$/.test(phone.value)) {
        showError(phone, 'Enter a valid phone number.');
        valid = false;
      }
      var email = document.getElementById('res-email');
      if (email.value && !isValidEmail(email.value)) {
        showError(email, 'Enter a valid email address.');
        valid = false;
      }
      var date = document.getElementById('res-date');
      if (date.value && date.value < localISO(new Date())) {
        showError(date, 'Please choose today or a future date.');
        valid = false;
      }
      if (!valid) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

      sendForm(form, success, 'Request received! We will confirm your table by phone or email shortly.');
    });
  }

  /* ---------------- Shared form sender ----------------
     Set FORM_ENDPOINT to a real URL (e.g. a Formspree endpoint
     'https://formspree.io/f/xxxx') so submissions are actually delivered.
     Until then the site tells the visitor honestly that nothing was sent. */
  var FORM_ENDPOINT = '';

  function flash(el, text, isError) {
    el.textContent = text;
    el.classList.toggle('is-error', !!isError);
    el.hidden = false;
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.hidden = true; }, 7000);
  }

  function sendForm(form, statusEl, okMessage) {
    if (!FORM_ENDPOINT) {
      flash(statusEl, 'This demo site is not connected to a server yet, so nothing was sent. Please call us instead.', true);
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (res) {
      if (!res.ok) throw new Error('bad status');
      form.reset();
      flash(statusEl, okMessage, false);
    }).catch(function () {
      flash(statusEl, 'Sorry, something went wrong. Please try again or call us.', true);
    }).then(function () {
      if (btn) btn.disabled = false;
    });
  }

  /* ---------------- Contact form ---------------- */
  function contactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var success = document.getElementById('contact-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = checkRequired(['c-name', 'c-email', 'c-message']);
      var email = document.getElementById('c-email');
      if (email.value && !isValidEmail(email.value)) {
        showError(email, 'Enter a valid email address.');
        valid = false;
      }
      if (!valid) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

      sendForm(form, success, 'Message sent. We will reply as soon as we can.');
    });
  }

  /* ---------------- Newsletter form ---------------- */
  function newsletterForm() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;
    var success = document.getElementById('newsletter-success');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = form.querySelector('input[type="email"]');
      if (!em || !isValidEmail(em.value)) {
        if (em) em.focus();
        flash(success, 'Please enter a valid email address.', true);
        return;
      }
      sendForm(form, success, 'Subscribed! Welcome to Bella Vista.');
    });
  }

  /* ---------------- Ripple button effect ---------------- */
  function rippleButtons() {
    document.querySelectorAll('.ripple').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var circle = document.createElement('span');
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        circle.className = 'ripple-circle';
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
        circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(circle);
        setTimeout(function () { circle.remove(); }, 650);
      });
    });
  }

  /* ---------------- Back to top ---------------- */
  function backToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    function update() { btn.hidden = window.scrollY < 500; }
    window.addEventListener('scroll', update, { passive: true });
    update();
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();