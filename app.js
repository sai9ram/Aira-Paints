/* ============================================================
   AIRA PAINTS — Hero Scrollytelling Controller
   Stack + Fade approach: no translateX, no overflow clipping.
   Scroll progress picks which slide is active → opacity change.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DOM ─────────────────────────────────────── */
  const heroSection  = document.getElementById('hero');
  const heroSlides   = document.querySelectorAll('.hero-slide');
  const heroDots     = document.querySelectorAll('.hero-dot');
  const header       = document.getElementById('site-header');
  const scrollHint   = document.getElementById('hero-scroll-hint');

  if (!heroSection) return;

  /* ── Layout cache (use offsetTop, never getBCR) ─ */
  let sectionTop      = 0;
  let scrollableRange = 0;

  function cacheLayout() {
    sectionTop      = heroSection.offsetTop;
    scrollableRange = heroSection.offsetHeight - window.innerHeight;
  }

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  /* ── Tick ───────────────────────────────────── */
  function animate(scrollY) {
    /* 0 → 1 through the 400 vh scroll range */
    const progress = clamp(
      scrollableRange > 0 ? (scrollY - sectionTop) / scrollableRange : 0,
      0, 1
    );

    /* Which of the 4 slides should be visible (0–3) */
    const activeIdx = clamp(Math.floor(progress * 4), 0, 3);

    /* Toggle .active — CSS handles the fade + Match & Move */
    heroSlides.forEach((s, i) => s.classList.toggle('active', i === activeIdx));
    heroDots.forEach((d, i)   => d.classList.toggle('active', i === activeIdx));

    /* Hide scroll hint once user has scrolled */
    if (scrollHint) scrollHint.classList.toggle('hidden', scrollY > sectionTop + 80);

    /* Compact header after first scroll */
    header.classList.toggle('scrolled', scrollY > 20);
  }

  /* ── rAF-throttled scroll listener ─────────── */
  let lastScrollY = window.scrollY;
  let ticking     = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        animate(lastScrollY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── Dot click → scroll to that slide ────────── */
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      window.scrollTo({
        top: sectionTop + (i / 3) * scrollableRange,
        behavior: 'smooth'
      });
    });
  });

  /* ── Recalculate on resize ───────────────────── */
  window.addEventListener('resize', () => { cacheLayout(); animate(window.scrollY); });

  /* ── Boot ───────────────────────────────────── */
  cacheLayout();
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

/* ============================================================
   SECTION 06 — Colour Studio Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stageFrame    = document.getElementById('studio-stage-frame');
  const cards         = document.querySelectorAll('#studio-palette-grid .studio-palette-card');
  const wall          = document.getElementById('arch-wall-primary');
  const floor         = document.getElementById('arch-floor-plane');
  const artGraphic    = document.getElementById('arch-art-graphic');
  const sofaBody      = document.getElementById('lounge-sofa-body');
  const cushion1      = document.getElementById('lounge-cushion-1');
  const cushion2      = document.getElementById('lounge-cushion-2');
  const rugLayer      = document.getElementById('arch-rug-layer');
  const trimPillar    = document.getElementById('arch-trim-pillar');
  
  const inspectorName = document.getElementById('inspector-name');
  const inspectorCode = document.getElementById('inspector-code');
  const inspectorSwatches = document.getElementById('inspector-swatches');
  const copyBtn       = document.getElementById('copy-code-btn');
  
  // Custom Mixer elements
  const customPicker  = document.getElementById('custom-wall-picker');
  const mixerValueText = document.getElementById('mixer-value-text');
  const applyCustomBtn = document.getElementById('apply-custom-shade-btn');

  // Control Selector Panels
  const scenePills    = document.querySelectorAll('#studio-scene-selector .pill-btn');
  const sheenPills    = document.querySelectorAll('#studio-sheen-selector .pill-btn');
  const lightPills    = document.querySelectorAll('#studio-light-selector .pill-btn');
  const categoryBtns  = document.querySelectorAll('#palette-category-filters .cat-filter-btn');

  let activeColors = ["#3A3530", "#C8B195", "#EFEAE4"];
  let activeNames  = ["Slate Charcoal", "Sandalwood Dusk", "Alabaster Cream"];

  if (!cards.length) return;

  // Apply Palette colors dynamically
  function applyPalette(card) {
    const colors = JSON.parse(card.getAttribute('data-colors'));
    const names  = JSON.parse(card.getAttribute('data-names'));
    const title  = card.querySelector('strong').textContent;

    activeColors = colors;
    activeNames  = names;

    const [accent, secondary, light] = colors;

    // Apply colors using CSS custom properties for smooth transitions
    if (wall) wall.style.setProperty('--studio-wall', light);
    if (trimPillar) trimPillar.style.setProperty('--studio-trim', secondary);
    if (artGraphic) artGraphic.style.setProperty('--studio-accent', accent);
    if (sofaBody) sofaBody.style.setProperty('--studio-furniture', accent);
    if (cushion1) cushion1.style.setProperty('--studio-accent', secondary);
    if (cushion2) cushion2.style.setProperty('--studio-accent', light);
    if (rugLayer) rugLayer.style.setProperty('--studio-accent', secondary);

    // Update inspector view
    if (inspectorName) inspectorName.textContent = title;
    if (inspectorCode) inspectorCode.textContent = `${colors[0]} · ${names[0]}`;
    if (inspectorSwatches) {
      inspectorSwatches.innerHTML = colors.map((color, idx) => 
        `<span class="inspector-swatch" style="background: ${color}" title="${names[idx]}"></span>`
      ).join('');
    }

    // Sync custom color input
    if (customPicker) {
      customPicker.value = colors[0];
      if (mixerValueText) mixerValueText.textContent = colors[0];
    }
  }

  // Preset Card click handler
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      applyPalette(card);
    });
  });

  // Scene switcher
  scenePills.forEach(pill => {
    pill.addEventListener('click', () => {
      scenePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      const scene = pill.getAttribute('data-scene');
      // Living lounge theme setup
      if (scene === 'living') {
        if (trimPillar) trimPillar.style.display = 'block';
        if (sofaBody) sofaBody.style.opacity = '1';
      } else if (scene === 'exterior') {
        // Mock facade setup
        if (trimPillar) trimPillar.style.display = 'none';
        if (sofaBody) sofaBody.style.opacity = '0.1'; // Hide furniture
      } else if (scene === 'bedroom') {
        // Bedroom suite setup
        if (trimPillar) trimPillar.style.display = 'block';
        if (sofaBody) sofaBody.style.opacity = '0.9';
      }
    });
  });

  // Sheen finish switcher
  sheenPills.forEach(pill => {
    pill.addEventListener('click', () => {
      sheenPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const sheen = pill.getAttribute('data-sheen');
      
      // Clear sheen classes and add active sheen class
      stageFrame.classList.remove('sheen-matt', 'sheen-satin', 'sheen-gloss');
      stageFrame.classList.add(`sheen-${sheen}`);
    });
  });

  // Light mood switcher
  lightPills.forEach(pill => {
    pill.addEventListener('click', () => {
      lightPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const light = pill.getAttribute('data-light');

      stageFrame.classList.remove('light-day', 'light-warm');
      stageFrame.classList.add(`light-${light}`);
    });
  });

  // Palette categories filter
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Custom Color Lab Formulation
  if (customPicker) {
    customPicker.addEventListener('input', (e) => {
      const col = e.target.value;
      if (mixerValueText) mixerValueText.textContent = col;
    });

    applyCustomBtn.addEventListener('click', () => {
      const col = customPicker.value;
      if (wall) wall.style.setProperty('--studio-wall', col);
      if (inspectorName) inspectorName.textContent = "Custom Palette Lab";
      if (inspectorCode) inspectorCode.textContent = `${col} · Custom formulated shade`;
    });
  }

  // Copy HEX code
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const hex = activeColors[0];
      navigator.clipboard.writeText(hex).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 1800);
      });
    });
  }

  // Init with first active preset
  const firstActive = document.querySelector('#studio-palette-grid .studio-palette-card.active');
  if (firstActive) applyPalette(firstActive);
});




/* ============================================================
   SECTION 07 — Sustainability Storytelling Parallax Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const sustainSection = document.getElementById('sustainability');
  const sustainImg     = document.querySelector('.sustain-showcase-img');
  const shape1         = document.getElementById('sustain-shape-1');
  const shape2         = document.getElementById('sustain-shape-2');

  if (!sustainSection) return;

  function handleParallax() {
    const rect = sustainSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    // Map scroll phase to 0-1 progress
    const progress = 1 - (rect.bottom / (window.innerHeight + rect.height));

    // Parallax translations
    if (sustainImg) {
      sustainImg.style.transform = `translateY(${progress * -25}px)`;
    }
    if (shape1) {
      shape1.style.transform = `translateY(${progress * 90}px)`;
    }
    if (shape2) {
      shape2.style.transform = `translateY(${progress * -90}px)`;
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




