/* ============================================================
   AIRA PAINTS — Scroll Animation Controller
   High-performance using requestAnimationFrame
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DOM references ─────────────────────────── */
  const paintCan      = document.getElementById('paint-can');
  const heroText      = document.getElementById('hero-text');
  const heroVisual    = document.getElementById('hero-visual');
  const scrollyReveal = document.getElementById('scrolly-reveal');
  const bgCanvas      = document.getElementById('bg-canvas');
  const scrollHint    = document.getElementById('scroll-hint');
  const header        = document.getElementById('site-header');
  const canScene      = document.getElementById('can-scene');

  /* ── State ──────────────────────────────────── */
  let lastScrollY = window.scrollY;
  let ticking     = false;

  /* ── Utility: clamp a value between min and max ── */
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /* ── Utility: linear interpolation ────────────── */
  const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

  /* ── Map scroll to a 0–1 progress value ────────
     The scrollable "hero zone" is 150vh (the spacer div height).
     After 100vh, the sticky hero unpins and scrolls away.        */
  function getScrollProgress() {
    // Hero section is 200vh. The sticky animation runs over the first 100vh of scroll.
    const maxScroll = window.innerHeight;
    return clamp(window.scrollY / maxScroll, 0, 1);
  }

  /* ── Main animation tick ─────────────────────── */
  function animate(scrollY) {
    const progress = getScrollProgress();

    // ── 1. Pass scroll % to CSS for blob and shape transforms
    document.documentElement.style.setProperty('--scroll-pct', progress);

    // ── 2. Paint can rotation: -30deg → +150deg as user scrolls
    const canRotate = lerp(-30, 150, progress);
    paintCan.style.setProperty('--can-rotate', `${canRotate}deg`);

    // ── 3. Can scene floats upward slightly on scroll
    const canLift = lerp(0, -40, progress);
    canScene.style.transform = `translateY(${canLift}px)`;

    // ── 4. Hero text: fade out and slide up
    const textOpacity   = clamp(1 - progress * 2.2, 0, 1);
    const textTranslate = lerp(0, -70, progress);
    heroText.style.opacity   = textOpacity;
    heroText.style.transform = `translateY(${textTranslate}px)`;
    // Prevent interaction when invisible
    heroText.style.pointerEvents = textOpacity < 0.05 ? 'none' : 'auto';

    // ── 5. Hero visual: fade out slower
    const visualOpacity = clamp(1 - progress * 1.6, 0, 1);
    heroVisual.style.opacity = visualOpacity;

    // ── 6. Background color transition
    if (progress > 0.5) {
      bgCanvas.classList.add('tinted');
    } else {
      bgCanvas.classList.remove('tinted');
    }

    // ── 7. Scrolly reveal text: fade in after hero text fades
    if (progress > 0.42) {
      scrollyReveal.classList.add('active');
      scrollyReveal.removeAttribute('aria-hidden');
    } else {
      scrollyReveal.classList.remove('active');
      scrollyReveal.setAttribute('aria-hidden', 'true');
    }

    // ── 8. Scroll hint: hide once user starts scrolling
    if (scrollY > 40) {
      scrollHint.classList.add('hidden');
    } else {
      scrollHint.classList.remove('hidden');
    }

    // ── 9. Header: add scrolled class for box shadow
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

  /* ── Subtle mouse parallax on can ─────────────── */
  document.addEventListener('mousemove', (e) => {
    if (window.scrollY > window.innerHeight * 0.3) return; // only at top

    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy; // -1 to 1

    const rotX = lerp(-10, 10, (dy + 1) / 2);
    const rotY = lerp(-30 + -15, -30 + 15, (dx + 1) / 2);

    paintCan.style.setProperty('--can-rotate', `${rotY}deg`);
    canScene.style.transform = `rotateX(${rotX * -0.3}deg) translateY(0px)`;
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
    '#eef6f3', /* Interior — light green tint */
    '#fdf3ed', /* Exterior — warm terracotta tint */
    '#f5f2fc', /* Primers  — soft purple tint */
    '#eef4fb', /* Water    — pale blue tint */
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
   SECTION 06 — Color Inspiration Experience Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const stickyTrack = document.getElementById('inspiration-sticky-track');
  const items = document.querySelectorAll('#categories-list .category-item');
  const wall = document.getElementById('room-wall');
  const paletteName = document.getElementById('active-palette-name');
  const swatchesContainer = document.getElementById('active-palette-swatches');
  const stage = document.getElementById('inspiration-stage');

  if (!stickyTrack || !items.length) return;

  const TOTAL_CATEGORIES = items.length; // 8

  let activeIndex = -1;

  function updateActivePalette(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    // Update active category class
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });

    const activeItem = items[index];
    const colors = JSON.parse(activeItem.getAttribute('data-colors'));
    const names = JSON.parse(activeItem.getAttribute('data-names'));

    // Apply color variables
    if (wall) {
      wall.style.setProperty('--active-wall-color', colors[2]); // use light shade for wall
      wall.style.setProperty('--active-accent-color', colors[0]); // use primary shade for pillow/art
      wall.parentElement.style.setProperty('--active-accent-color', colors[0]);
    }
    
    if (stage) {
      // Use secondary or dominant color with low opacity for the backdrop container
      stage.style.setProperty('--room-backdrop-color', colors[1] + '12'); 
    }

    // Set Palette Name
    if (paletteName) {
      paletteName.textContent = activeItem.querySelector('h3').textContent;
    }

    // Build Swatches
    if (swatchesContainer) {
      let swatchesHtml = '';
      colors.forEach((color, i) => {
        swatchesHtml += `
          <div class="swatch-item">
            <span class="swatch-dot" style="background-color: ${color}"></span>
            <span class="swatch-name">${names[i]}</span>
          </div>
        `;
      });
      swatchesContainer.innerHTML = swatchesHtml;
    }
  }

  function handleScroll() {
    const rect = stickyTrack.getBoundingClientRect();
    const scrolled = -rect.top;
    const scrollableH = stickyTrack.offsetHeight - window.innerHeight;

    if (scrolled < 0) {
      updateActivePalette(0);
      return;
    }

    if (scrolled > scrollableH) {
      updateActivePalette(TOTAL_CATEGORIES - 1);
      return;
    }

    const pct = scrolled / scrollableH;
    const index = Math.min(Math.floor(pct * TOTAL_CATEGORIES), TOTAL_CATEGORIES - 1);
    updateActivePalette(index);
  }

  // Handle category clicks to scroll directly to the corresponding zone
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      const rect = stickyTrack.getBoundingClientRect();
      const scrollableH = stickyTrack.offsetHeight - window.innerHeight;
      const targetScroll = window.scrollY + rect.top + (scrollableH * (index / (TOTAL_CATEGORIES - 1)));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial load
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




