/* ============================================================
   AIRA PAINTS — Scroll Animation Controller
   High-performance using requestAnimationFrame
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DOM references ─────────────────────────── */
  const heroSection  = document.getElementById('hero');
  const heroTrack    = document.getElementById('hero-track');
  const heroSlides   = document.querySelectorAll('.hero-slide');
  const heroDots     = document.querySelectorAll('.hero-dot');
  const header       = document.getElementById('site-header');

  /* ── State ──────────────────────────────────── */
  let lastScrollY = window.scrollY;
  let ticking     = false;

  /* ── Utility: clamp a value between min and max ── */
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /* ── Colors matching each slide ────────────── */
  const slideColors = ['#0F4D3A', '#7a3b1e', '#4a3f6b', '#1b4f72'];

  /* ── Main animation tick ─────────────────────── */
  function animate(scrollY) {
    if (!heroSection || !heroTrack) return;

    const rect = heroSection.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const heroHeight = heroSection.offsetHeight;
    const scrollableRange = heroHeight - window.innerHeight;

    // Calculate progress (0 to 1) of scroll through the 400vh container
    const progress = clamp((scrollY - sectionTop) / scrollableRange, 0, 1);

    // Translate the track horizontally (0% to -75% translation)
    const translatePct = progress * 75;
    heroTrack.style.transform = `translateX(-${translatePct}%)`;

    // Determine the current active slide index (0 to 3)
    const activeIndex = clamp(Math.floor(progress * 4.0), 0, 3);

    // Update background color based on active index
    heroSection.style.backgroundColor = slideColors[activeIndex];

    // Update active slide class
    heroSlides.forEach((slide, idx) => {
      if (idx === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active navigation dot
    heroDots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Header styling based on scrolling
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ── Scroll listener using rAF for 60fps performance ── */
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        animate(lastScrollY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Add click events to pagination dots
  heroDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const heroHeight = heroSection.offsetHeight;
      const scrollableRange = heroHeight - window.innerHeight;
      const targetScroll = sectionTop + (idx / 3.0) * scrollableRange;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });

  /* ── Initial render ────────────────────────────── */
  animate(window.scrollY);

});

/* ============================================================
   SECTION 02 — Scroll Reveal & Stats Counter
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── IntersectionObserver: .reveal-up elements ── */
  const revealUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        revealUpObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => {
    revealUpObserver.observe(el);
  });

  /* ── IntersectionObserver: .reveal-card elements (staggered) ── */
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-card').forEach(el => {
    cardObserver.observe(el);
  });

  /* ── Stats Counter Animation ── */
  function animateCounter(el, target, duration = 1800) {
    const start     = performance.now();
    const startVal  = 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ── Watch the stats bar, trigger counters when visible ── */
  let countersStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-number[data-target]').forEach((el, i) => {
          const target = parseInt(el.dataset.target, 10);
          // Stagger each counter slightly
          setTimeout(() => animateCounter(el, target), i * 120);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statsObserver.observe(statsBar);

});

/* ============================================================
   SECTION 03 — Tirupati Story: Reveal Fades + Counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── reveal-fade IntersectionObserver ── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-fade').forEach(el => {
    fadeObserver.observe(el);
  });

  /* ── Story Counter + Progress Bar Animation ── */
  function runStoryCounter(el, target, duration = 2000) {
    const start    = performance.now();
    const bar      = el.closest('.story-counter-item')?.querySelector('.counter-bar');

    // Trigger bar fill
    if (bar) {
      requestAnimationFrame(() => {
        bar.classList.add('filled');
      });
    }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(target * eased);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ── Observe the counters panel ── */
  let storyCountersStarted = false;

  const storyCounterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !storyCountersStarted) {
        storyCountersStarted = true;

        document.querySelectorAll('.story-counter-num[data-target]').forEach((el, i) => {
          const target = parseInt(el.dataset.target, 10);
          setTimeout(() => runStoryCounter(el, target), i * 180);
        });

        storyCounterObs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const storyCounters = document.querySelector('.story-counters');
  if (storyCounters) storyCounterObs.observe(storyCounters);

  /* ── Subtle video parallax on scroll ── */
  const storyVideo = document.getElementById('story-video');
  if (storyVideo) {
    window.addEventListener('scroll', () => {
      const section   = document.getElementById('story');
      if (!section) return;
      const rect      = section.getBoundingClientRect();
      const inView    = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const pct       = 1 - (rect.bottom / (window.innerHeight + rect.height));
      const offset    = Math.round(pct * 40); // max 40px parallax
      storyVideo.style.transform = `translateY(${offset}px) scale(1.05)`;
    }, { passive: true });
  }

});

/* ============================================================
   SECTION 04 — Product Showcase Scroll Controller
   Apple-style: one product per scroll zone
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const stickyWrap   = document.getElementById('products-sticky-wrap');
  const slides       = document.querySelectorAll('.product-slide');
  const dots         = document.querySelectorAll('.product-dot');
  const progressFill = document.getElementById('products-progress-fill');
  const stage        = document.getElementById('products-stage');

  if (!stickyWrap || !slides.length) return;

  const TOTAL = slides.length; // 4

  /* Background colours per product (match can-color) */
  const stageBgs = [
    '#eef6f3', /* Interior — light emerald tint */
    '#f5faf8', /* Exterior — clean white-green tint */
    '#f0f7f4', /* Primers  — soft emerald-white tint */
    '#eaf2ee', /* Water    — pale emerald tint */
  ];

  let currentIndex = -1; // start invalid to force first paint

  function goToSlide(index) {
    if (index === currentIndex) return;
    const prev = currentIndex;
    currentIndex = index;

    /* Crossfade slides */
    slides.forEach((slide, i) => {
      if (i === index) {
        if (prev >= 0) slide.classList.remove('exit');
        slide.classList.add('active');
        slide.removeAttribute('aria-hidden');
      } else {
        if (i === prev) slide.classList.add('exit');
        else            slide.classList.remove('exit');
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    /* Update dots */
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    /* Update stage background */
    if (stage) {
      stage.style.setProperty('--stage-bg', stageBgs[index]);
    }

    /* Update progress bar width */
    if (progressFill) {
      progressFill.style.width = `${((index + 1) / TOTAL) * 100}%`;
    }
  }

  /* Calculate active slide from scroll position */
  function updateShowcase() {
    const rect      = stickyWrap.getBoundingClientRect();
    const scrolled  = -rect.top; // how far past the top of the wrapper
    const zoneH     = stickyWrap.offsetHeight / TOTAL; // 100vh per product

    if (scrolled < 0) {
      // Above section — show first slide
      goToSlide(0);
      return;
    }

    const index = Math.min(Math.floor(scrolled / zoneH), TOTAL - 1);
    goToSlide(index);
  }

  /* Passive scroll listener */
  window.addEventListener('scroll', updateShowcase, { passive: true });

  /* Dot click → jump-scroll to product zone */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const rect   = stickyWrap.getBoundingClientRect();
      const zoneH  = stickyWrap.offsetHeight / TOTAL;
      const target = window.scrollY + rect.top + zoneH * i + 10;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  /* Initial paint */
  updateShowcase();

});

/* ============================================================
   SECTION 06 — Colour Studio Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const cards    = document.querySelectorAll('#studio-palette-grid .studio-palette-card');
  const wall     = document.getElementById('studio-wall');
  const floor    = document.getElementById('studio-floor');
  const artFill  = document.getElementById('studio-art-fill');
  const sofaBack = document.getElementById('studio-sofa-back');
  const sofaSeat = document.getElementById('studio-sofa-seat');
  const cushionA = document.getElementById('studio-cushion-a');
  const cushionB = document.getElementById('studio-cushion-b');
  const vaseBody = document.getElementById('studio-vase-body');
  const rug      = document.getElementById('studio-rug');
  const badgeName    = document.getElementById('studio-badge-name');
  const badgeSwatches = document.getElementById('studio-badge-swatches');

  if (!cards.length) return;

  function applyPalette(card) {
    const colors = JSON.parse(card.getAttribute('data-colors'));
    const names  = JSON.parse(card.getAttribute('data-names'));
    const title  = card.querySelector('strong').textContent;

    const [primary, secondary, light] = colors;

    // Lighten wall colour: use light shade (index 2)
    if (wall)  wall.style.setProperty('--studio-wall', light);
    // Floor: muted mid shade
    if (floor) floor.style.setProperty('--studio-floor', secondary + '22');

    // Room elements
    const accent = primary;
    if (artFill)  artFill.style.backgroundColor  = accent;
    if (sofaBack) sofaBack.style.backgroundColor = primary;
    if (sofaSeat) sofaSeat.style.backgroundColor = secondary;
    if (cushionA) cushionA.style.backgroundColor = secondary;
    if (cushionB) cushionB.style.backgroundColor = light;
    if (vaseBody) vaseBody.style.backgroundColor = secondary;
    if (rug)      rug.style.backgroundColor      = secondary;

    // Badge
    if (badgeName) badgeName.textContent = title;
    if (badgeSwatches) {
      badgeSwatches.innerHTML = colors.map((c, i) =>
        `<span class="studio-badge-swatch" style="background:${c}" title="${names[i]}"></span>`
      ).join('');
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Deactivate all
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      applyPalette(card);
    });
  });

  // Init with the first (active) card
  const first = document.querySelector('#studio-palette-grid .studio-palette-card.active');
  if (first) applyPalette(first);
});



/* ============================================================
   SECTION 07 — Sustainability Storytelling Parallax Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const sustainSection = document.getElementById('sustainability');
  const leaf1          = document.getElementById('leaf-1');
  const leaf2          = document.getElementById('leaf-2');
  const leaf3          = document.getElementById('leaf-3');
  const shape1         = document.getElementById('sustain-shape-1');
  const shape2         = document.getElementById('sustain-shape-2');
  const seal           = document.getElementById('eco-badge-seal');

  if (!sustainSection) return;

  function handleParallax() {
    const rect = sustainSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    // Map scroll phase to 0-1 progress
    const progress = 1 - (rect.bottom / (window.innerHeight + rect.height));

    // Parallax translations
    if (leaf1) {
      leaf1.style.transform = `translateY(${progress * -100}px) rotate(${15 + progress * 35}deg) scale(0.9)`;
    }
    if (leaf2) {
      leaf2.style.transform = `translateY(${progress * 80}px) rotate(${-45 - progress * 40}deg) scale(1.15)`;
    }
    if (leaf3) {
      leaf3.style.transform = `translateY(${progress * -140}px) rotate(${85 + progress * 55}deg) scale(1)`;
    }
    if (shape1) {
      shape1.style.transform = `translateY(${progress * 90}px)`;
    }
    if (shape2) {
      shape2.style.transform = `translateY(${progress * -90}px)`;
    }
    if (seal) {
      seal.style.transform = `translateY(${progress * -50}px) rotate(${progress * -12}deg)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax(); // Initial check
});

/* ============================================================
   SECTION 08 — Project Gallery Filter Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryCards  = document.querySelectorAll('#gallery-grid .gallery-card');

  if (!filterButtons.length || !galleryCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Update active button state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // 2. Filter gallery grid items
      const filterValue = btn.dataset.filter;

      galleryCards.forEach(card => {
        // Soft fade transition out before hiding
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});

/* ============================================================
   SECTION 09 — Customer Success Stories Carousel & BA Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Video Testimonial Carousel ──
  const track         = document.getElementById('testimonial-carousel');
  const cards         = document.querySelectorAll('#testimonial-carousel .testimonial-card');
  const prevBtn       = document.getElementById('carousel-prev');
  const nextBtn       = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && cards.length) {
    let currentIndex = 0;
    const TOTAL_SLIDES = cards.length;

    // Generate dots
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('#carousel-dots .carousel-dot');

    function goToSlide(index) {
      let targetIndex = index;
      if (index < 0) targetIndex = TOTAL_SLIDES - 1;
      if (index >= TOTAL_SLIDES) targetIndex = 0;

      currentIndex = targetIndex;

      // Slide track
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active cards
      cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === currentIndex);
      });

      // Update active dots
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // ── 2. Before / After Interactive Slider ──
  const slider      = document.getElementById('ba-range-slider');
  const beforeState = document.getElementById('before-state');
  const sliderLine  = document.getElementById('ba-slider-line');

  if (slider && beforeState && sliderLine) {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      beforeState.style.width = `${val}%`;
      sliderLine.style.left = `${val}%`;
    });
  }
});




