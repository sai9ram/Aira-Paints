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

// Visualizer section removed





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

  // Video play trigger controller
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    const video   = card.querySelector('.testimonial-video');
    const mediaWrap = card.querySelector('.card-media-wrap');

    if (playBtn && video && mediaWrap) {
      const togglePlay = () => {
        if (video.paused) {
          // Pause all other videos first
          document.querySelectorAll('.testimonial-video').forEach(v => {
            if (v !== video) {
              v.pause();
              const parentWrap = v.closest('.card-media-wrap');
              if (parentWrap) parentWrap.classList.remove('video-playing');
            }
          });
          video.play();
          mediaWrap.classList.add('video-playing');
          video.controls = true;
        } else {
          video.pause();
          mediaWrap.classList.remove('video-playing');
          video.controls = false;
        }
      };

      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });

      // Pause styling when video finishes
      video.addEventListener('ended', () => {
        mediaWrap.classList.remove('video-playing');
        video.controls = false;
        video.load(); // Reset poster
      });
    }
  });

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

  // ── 3. Sizing & Pricing Tabs Selector ──
  const priceTabBtns = document.querySelectorAll('.price-tab-btn');
  const priceCards   = document.querySelectorAll('.price-card');

  if (priceTabBtns.length && priceCards.length) {
    priceTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active states for buttons
        priceTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update pricing cards values
        const selectedSeries = btn.getAttribute('data-series');
        priceCards.forEach(card => {
          const prices = JSON.parse(card.getAttribute('data-base-prices'));
          const valueField = card.querySelector('.price-value');
          if (valueField && prices && prices[selectedSeries] !== undefined) {
            valueField.textContent = `₹${prices[selectedSeries].toLocaleString('en-IN')}`;
          }
        });
      });
    });
  }

  // ── 4. Volume & Cost Estimator Calculator ──
  const carpetInput = document.getElementById('carpet-area-input');
  const coatsSelect = document.getElementById('coating-coats-select');
  const calcVolText = document.getElementById('calc-volume-needed');
  const priceEconomyText = document.getElementById('calc-price-economy');
  const pricePremiumText = document.getElementById('calc-price-premium');
  const priceLuxuryText  = document.getElementById('calc-price-luxury');

  function calculateCheapestBucketMix(litres, seriesPrices) {
    let remaining = litres;
    let cost = 0;
    
    if (remaining >= 20) {
      const qty20 = Math.floor(remaining / 20);
      cost += qty20 * seriesPrices[20];
      remaining = remaining % 20;
    }
    
    if (remaining > 0) {
      let opt1 = seriesPrices[20]; // 20L option
      let opt2 = 0; // Mix option
      let rem2 = remaining;
      
      if (rem2 >= 10) {
        opt2 += seriesPrices[10];
        rem2 -= 10;
      }
      if (rem2 >= 4) {
        const qty4 = Math.floor(rem2 / 4);
        opt2 += qty4 * seriesPrices[4];
        rem2 = rem2 % 4;
      }
      opt2 += rem2 * seriesPrices[1];
      
      let opt3 = remaining <= 10 ? seriesPrices[10] : Infinity;
      let opt4 = remaining <= 4 ? seriesPrices[4] : Infinity;
      
      cost += Math.min(opt1, opt2, opt3, opt4);
    }
    return cost;
  }

  function updateEstimatorStats() {
    if (!carpetInput || !coatsSelect || !calcVolText) return;
    
    const carpetArea = parseFloat(carpetInput.value) || 0;
    const coats = parseInt(coatsSelect.value) || 2;
    
    // Coverage: ~120 sq. ft. per Litre per coat
    const totalLitres = Math.ceil((carpetArea * coats) / 120);
    calcVolText.textContent = `~${totalLitres} Litres`;
    
    const pricesDef = {
      economy: { 20: 4299, 10: 2199, 4: 949, 1: 249 },
      premium: { 20: 6899, 10: 3499, 4: 1499, 1: 399 },
      luxury:  { 20: 9899, 10: 4999, 4: 2099, 1: 549 }
    };
    
    if (priceEconomyText) {
      const price = calculateCheapestBucketMix(totalLitres, pricesDef.economy);
      priceEconomyText.textContent = `₹${price.toLocaleString('en-IN')}`;
    }
    if (pricePremiumText) {
      const price = calculateCheapestBucketMix(totalLitres, pricesDef.premium);
      pricePremiumText.textContent = `₹${price.toLocaleString('en-IN')}`;
    }
    if (priceLuxuryText) {
      const price = calculateCheapestBucketMix(totalLitres, pricesDef.luxury);
      priceLuxuryText.textContent = `₹${price.toLocaleString('en-IN')}`;
    }
  }

  if (carpetInput && coatsSelect) {
    carpetInput.addEventListener('input', updateEstimatorStats);
    coatsSelect.addEventListener('change', updateEstimatorStats);
    // Initial run
    updateEstimatorStats();
  }
});




