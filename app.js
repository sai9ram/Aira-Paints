/* ============================================================
   AIRA PAINTS — Hero Controller
   All viewports: manual carousel via ← → arrow buttons & dot clicks
   Scroll no longer changes slides.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DOM ─────────────────────────────────────── */
  const heroSection = document.getElementById('hero');
  const heroSlides  = document.querySelectorAll('.hero-slide');
  const heroDots    = document.querySelectorAll('.hero-dot');
  const header      = document.getElementById('site-header');
  const prevBtn     = document.getElementById('hero-arrow-prev');
  const nextBtn     = document.getElementById('hero-arrow-next');

  if (!heroSection || heroSlides.length === 0) return;

  const totalSlides = heroSlides.length;

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  /* ── Unified Carousel State ──────────────────── */
  let activeIdx = 0;

  function goToSlide(idx) {
    activeIdx = clamp(idx, 0, totalSlides - 1);
    heroSlides.forEach((s, i) => s.classList.toggle('active', i === activeIdx));
    heroDots.forEach((d, i)   => d.classList.toggle('active', i === activeIdx));
    /* Dim arrows at ends */
    if (prevBtn) prevBtn.classList.toggle('hero-arrow--disabled', activeIdx === 0);
    if (nextBtn) nextBtn.classList.toggle('hero-arrow--disabled', activeIdx === totalSlides - 1);
  }

  /* ── Scroll listener (header only — no slide change) ── */
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Arrow buttons ────────────────────────────── */
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(activeIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(activeIdx + 1));

  /* ── Dot clicks ──────────────────────────────── */
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  /* ── Touch / swipe support ───────────────────── */
  let touchStartX = 0;
  heroSection.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  heroSection.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? goToSlide(activeIdx + 1) : goToSlide(activeIdx - 1);
    }
  }, { passive: true });

  /* ── Boot ────────────────────────────────────── */
  goToSlide(0);

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
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
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
    const start = performance.now();
    const bar = el.closest('.story-counter-item')?.querySelector('.counter-bar');

    // Trigger bar fill
    if (bar) {
      requestAnimationFrame(() => {
        bar.classList.add('filled');
      });
    }

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * eased);
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
      const section = document.getElementById('story');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const pct = 1 - (rect.bottom / (window.innerHeight + rect.height));
      const offset = Math.round(pct * 40); // max 40px parallax
      storyVideo.style.transform = `translateY(${offset}px) scale(1.05)`;
    }, { passive: true });
  }

});

/* ============================================================
   SECTION 04 — Product Showcase Scroll Controller
   Apple-style: one product per scroll zone
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const stickyWrap = document.getElementById('products-sticky-wrap');
  const slides = document.querySelectorAll('.product-slide');
  const dots = document.querySelectorAll('.product-dot');
  const progressFill = document.getElementById('products-progress-fill');
  const stage = document.getElementById('products-stage');

  if (!stickyWrap || !slides.length) return;

  const TOTAL = slides.length; // 5

  /* Background colours per product (match can-color) */
  const stageBgs = [
    '#eef6f3', /* Interior — light emerald tint */
    '#f2f6fa', /* Exterior — clean dark blue tint */
    '#f0f7f4', /* Primers  — soft emerald-white tint */
    '#eaf2ee', /* Water    — pale emerald tint */
    '#f7edf4', /* Luxury   — soft satin grape tint */
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
        else slide.classList.remove('exit');
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
    const rect = stickyWrap.getBoundingClientRect();
    const scrolled = -rect.top; // how far past the top of the wrapper
    const zoneH = stickyWrap.offsetHeight / TOTAL; // 100vh per product

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
      const rect = stickyWrap.getBoundingClientRect();
      const zoneH = stickyWrap.offsetHeight / TOTAL;
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
  const sustainImg = document.querySelector('.sustain-showcase-img');
  const shape1 = document.getElementById('sustain-shape-1');
  const shape2 = document.getElementById('sustain-shape-2');

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
  const galleryCards = document.querySelectorAll('#gallery-grid .gallery-card');

  if (!filterButtons.length || !galleryCards.length) return;

  filterButtons.forEach(btn => {
    const activateFilter = (e) => {
      if (e && e.type === 'touchend') e.preventDefault();
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
    };
    btn.addEventListener('click', activateFilter);
    btn.addEventListener('touchend', activateFilter, { passive: false });
  });
});

/* ============================================================
   SECTION 09 — Customer Success Stories Carousel & BA Controller
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Video Testimonial Carousel ──
  const track = document.getElementById('testimonial-carousel');
  const cards = document.querySelectorAll('#testimonial-carousel .testimonial-card');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
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

    // ── Touch Swipe Support for Mobile ──
    let swipeTouchStartX = 0;
    let swipeTouchStartY = 0;

    track.addEventListener('touchstart', (e) => {
      swipeTouchStartX = e.changedTouches[0].clientX;
      swipeTouchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - swipeTouchStartX;
      const deltaY = e.changedTouches[0].clientY - swipeTouchStartY;
      // Only register horizontal swipe (deltaX > deltaY to ignore scroll)
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goToSlide(currentIndex + 1); // swipe left → next
        } else {
          goToSlide(currentIndex - 1); // swipe right → prev
        }
      }
    }, { passive: true });
  }

  // Video play trigger controller
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    const video = card.querySelector('.testimonial-video');
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
  const slider = document.getElementById('ba-range-slider');
  const beforeState = document.getElementById('before-state');
  const sliderLine = document.getElementById('ba-slider-line');

  if (slider && beforeState && sliderLine) {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      beforeState.style.width = `${val}%`;
      sliderLine.style.left = `${val}%`;
    });
  }

  // ── 3. Sizing & Pricing Tabs Selector ──
  const priceTabBtns = document.querySelectorAll('.price-tab-btn');
  const priceCards = document.querySelectorAll('.price-card');

  if (priceTabBtns.length && priceCards.length) {
    priceTabBtns.forEach(btn => {
      const activatePriceTab = (e) => {
        if (e && e.type === 'touchend') e.preventDefault();
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
      };
      btn.addEventListener('click', activatePriceTab);
      btn.addEventListener('touchend', activatePriceTab, { passive: false });
    });
  }

  // ── 4. Volume & Cost Estimator Calculator ──
  const carpetInput = document.getElementById('carpet-area-input');
  const coatsSelect = document.getElementById('coating-coats-select');
  const calcVolText = document.getElementById('calc-volume-needed');
  const pricePremiumText = document.getElementById('calc-price-premium');
  const priceEssentialText = document.getElementById('calc-price-essential');

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
      premium: { 20: 6899, 10: 3499, 4: 1499, 1: 399 },
      essential: { 20: 4299, 10: 2199, 4: 949, 1: 249 }
    };

    if (pricePremiumText) {
      const price = calculateCheapestBucketMix(totalLitres, pricesDef.premium);
      pricePremiumText.textContent = `₹${price.toLocaleString('en-IN')}`;
    }
    if (priceEssentialText) {
      const price = calculateCheapestBucketMix(totalLitres, pricesDef.essential);
      priceEssentialText.textContent = `₹${price.toLocaleString('en-IN')}`;
    }
  }

  if (carpetInput && coatsSelect) {
    carpetInput.addEventListener('input', updateEstimatorStats);
    coatsSelect.addEventListener('change', updateEstimatorStats);
    // Initial run
    updateEstimatorStats();
  }

  // ── 5. Dealer Registration Popup Modal Controller ──
  const openModalBtn = document.getElementById('open-dealer-modal-btn');
  const closeModalBtn = document.getElementById('close-dealer-modal');
  const dealerModal = document.getElementById('dealer-popup-modal');
  const dealerForm = document.getElementById('dealer-modal-form');

  if (openModalBtn && closeModalBtn && dealerModal) {
    const showModal = () => {
      dealerModal.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden'; // Stop page scroll
    };

    const hideModal = () => {
      dealerModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore page scroll
    };

    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal();
    });

    closeModalBtn.addEventListener('click', hideModal);

    // Close when clicking overlay backdrop
    dealerModal.addEventListener('click', (e) => {
      if (e.target === dealerModal) {
        hideModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dealerModal.getAttribute('aria-hidden') !== 'true') {
        hideModal();
      }
    });

    // Handle form submit in JS to properly restore page scrolling
    if (dealerForm) {
      dealerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Agreement signed successfully! Our distribution team will review your application and contact you.');
        hideModal();
        dealerForm.reset();
      });
    }
  }

  // ── 6. Animated Splash Screen Controller ──
  const splashScreen = document.getElementById('splash-screen');
  const isMobile = window.innerWidth <= 768;

  if (splashScreen) {
    const activeVideo = isMobile
      ? (document.getElementById('splash-video-mobile') || splashScreen.querySelector('video'))
      : (document.getElementById('splash-video-desktop') || splashScreen.querySelector('video'));
    const inactiveVideo = isMobile
      ? document.getElementById('splash-video-desktop')
      : document.getElementById('splash-video-mobile');

    if (inactiveVideo) {
      try {
        inactiveVideo.pause();
      } catch (e) {}
    }

    let dismissed = false;
    const dismissSplash = () => {
      if (dismissed) return;
      dismissed = true;
      splashScreen.classList.add('splash-fade-out');
      document.body.classList.remove('loading');

      // Completely remove element from DOM after transition finishes
      setTimeout(() => {
        splashScreen.remove();
      }, 1200);

      // Auto-trigger Quick Enquiry modal 3 seconds after page is revealed
      setTimeout(() => {
        const modal = document.getElementById('enquiry-popup-modal');
        if (modal && modal.getAttribute('aria-hidden') === 'true') {
          modal.removeAttribute('aria-hidden');
          document.body.style.overflow = 'hidden';
        }
      }, 3000);
    };

    // Auto-dismiss timeout (dynamically adapts to video duration or ends on video completion)
    let timer = setTimeout(dismissSplash, isMobile ? 4200 : 5000);

    if (activeVideo) {
      activeVideo.addEventListener('loadedmetadata', () => {
        if (activeVideo.duration && !isNaN(activeVideo.duration)) {
          clearTimeout(timer);
          timer = setTimeout(dismissSplash, Math.ceil(activeVideo.duration * 1000) + 400);
        }
      });
      activeVideo.addEventListener('ended', () => {
        clearTimeout(timer);
        dismissSplash();
      });
      activeVideo.play().catch(() => {});
    }
  } else {
    document.body.classList.remove('loading');
    setTimeout(() => {
      const modal = document.getElementById('enquiry-popup-modal');
      if (modal && modal.getAttribute('aria-hidden') === 'true') {
        modal.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
      }
    }, 3000);
  }
});

/* ============================================================
   CREATIVE SHADES — Colour Palette Explorer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const PALETTES = {
    'modern-neutrals': [
      { name: 'Sand Silk', shades: [['50','#FCFBF5'],['100','#F6F3E6'],['200','#EDE9D6'],['300','#E3DEC3'],['400','#D8D1B1'],['500','#CEC69F'],['600','#C1BA8C'],['700','#B4AE79'],['800','#A79F66'],['900','#9A9453'],['1000','#8E8847'],['1100','#817C3C'],['1200','#757031'],['1300','#686632'],['1400','#5C571F'],['1500','#4F481A'],['1600','#423F16'],['1700','#353212'],['1800','#28280D'],['1900','#1B1909']] },
      { name: 'Warm Linen', shades: [['50','#FBF9F5'],['100','#F4F0E7'],['200','#E9E3D4'],['300','#DDD5BF'],['400','#D1C7AA'],['500','#C5B995'],['600','#B8A980'],['700','#AA996C'],['800','#9B885A'],['900','#8B764A'],['1000','#7A6539'],['1100','#695429'],['1200','#58431A'],['1300','#47340C'],['1400','#392800'],['1500','#2D1E00'],['1600','#221500'],['1700','#170D00'],['1800','#0E0700'],['1900','#060300']] },
      { name: 'Ivory Stone', shades: [['50','#FEFEFE'],['100','#F8F6F2'],['200','#F0EDE4'],['300','#E8E3D4'],['400','#DDD7C4'],['500','#D2CAB4'],['600','#C6BCA4'],['700','#BAAD93'],['800','#AD9E82'],['900','#9F8E71'],['1000','#917F61'],['1100','#826F52'],['1200','#736044'],['1300','#645137'],['1400','#55432B'],['1500','#46351F'],['1600','#382815'],['1700','#2A1C0C'],['1800','#1D1105'],['1900','#100800']] },
      { name: 'Dune Mist', shades: [['50','#FDFCF8'],['100','#F5F2E9'],['200','#ECE8D8'],['300','#E2DCC5'],['400','#D8CFB2'],['500','#CCC29E'],['600','#C0B48A'],['700','#B4A676'],['800','#A79762'],['900','#9A8850'],['1000','#8D7A3F'],['1100','#7F6C2F'],['1200','#715E21'],['1300','#635014'],['1400','#564309'],['1500','#493700'],['1600','#3C2C00'],['1700','#2F2200'],['1800','#221900'],['1900','#161100']] }
    ],
    'earthy-greens': [
      { name: 'Forest Fern', shades: [['50','#F2F9F5'],['100','#DFF0E7'],['200','#C3E2CE'],['300','#A4D0B3'],['400','#83BC97'],['500','#61A87B'],['600','#449360'],['700','#2F7D49'],['800','#1D6635'],['900','#0F5022'],['1000','#043B14'],['1100','#022C0C'],['1200','#011F07'],['1300','#011404'],['1400','#000B02'],['1500','#000500'],['1600','#000200'],['1700','#000100'],['1800','#000000'],['1900','#000000']] },
      { name: 'Sage Mist', shades: [['50','#F4F8F2'],['100','#E4EFE0'],['200','#CCE2C6'],['300','#B2D1AA'],['400','#96BE8D'],['500','#79AB70'],['600','#5E9655'],['700','#45803C'],['800','#2F6926'],['900','#1C5312'],['1000','#0D3E05'],['1100','#082E02'],['1200','#052001'],['1300','#031500'],['1400','#020C00'],['1500','#010500'],['1600','#010200'],['1700','#000100'],['1800','#000000'],['1900','#000000']] },
      { name: 'Olive Branch', shades: [['50','#F6F7EE'],['100','#EAECA0'],['200','#D8DC8F'],['300','#C5CA7A'],['400','#B1B864'],['500','#9CA54D'],['600','#879137'],['700','#727D23'],['800','#5E680F'],['900','#4B5400'],['1000','#3A4200'],['1100','#2B3100'],['1200','#1E2300'],['1300','#131700'],['1400','#0A0E00'],['1500','#050800'],['1600','#020400'],['1700','#010200'],['1800','#000100'],['1900','#000000']] },
      { name: 'Deep Moss', shades: [['50','#F1F7F3'],['100','#DEECE2'],['200','#BFDAC8'],['300','#9EC6AB'],['400','#7BB18C'],['500','#599C6D'],['600','#3F8453'],['700','#2C6D3D'],['800','#1C562A'],['900','#10401C'],['1000','#082F12'],['1100','#04220A'],['1200','#021806'],['1300','#011003'],['1400','#000A02'],['1500','#000501'],['1600','#000200'],['1700','#000100'],['1800','#000000'],['1900','#000000']] }
    ],
    'elegant-whites': [
      { name: 'Pure Pearl', shades: [['50','#FFFFFF'],['100','#FDFDFB'],['200','#F9F9F6'],['300','#F7F6F1'],['400','#F3F2ED'],['500','#EFEDE7'],['600','#EAE8E0'],['700','#E5E3D9'],['800','#DDDBD0'],['900','#D4D2C7'],['1000','#CACABE'],['1100','#C0BFB4'],['1200','#B6B5A9'],['1300','#ACAB9F'],['1400','#A2A194'],['1500','#97968A'],['1600','#8D8C80'],['1700','#838275'],['1800','#79786B'],['1900','#706F62']] },
      { name: 'Snow Drift', shades: [['50','#FFFFFF'],['100','#FEFEFE'],['200','#FCFCFC'],['300','#F9F9F7'],['400','#F5F5F2'],['500','#F0F0EC'],['600','#EAEBE5'],['700','#E4E4DD'],['800','#DCDDD4'],['900','#D4D5CB'],['1000','#CCCDC2'],['1100','#C3C4B9'],['1200','#BABAB0'],['1300','#B1B2A6'],['1400','#A9A99D'],['1500','#A0A093'],['1600','#979789'],['1700','#8E8E80'],['1800','#858577'],['1900','#7C7C6E']] },
      { name: 'Whisper White', shades: [['50','#FFFFFF'],['100','#FCFDFD'],['200','#F7FAFA'],['300','#F1F5F5'],['400','#E9EFEF'],['500','#E0E8E8'],['600','#D5DFDF'],['700','#C9D4D4'],['800','#BCC8C8'],['900','#ADBBBB'],['1000','#9DAEAE'],['1100','#8D9F9F'],['1200','#7D9090'],['1300','#6E8181'],['1400','#607171'],['1500','#526161'],['1600','#445151'],['1700','#374141'],['1800','#2A3232'],['1900','#1E2323']] }
    ],
    'royal-blues': [
      { name: 'Sapphire Sky', shades: [['50','#EEF4FF'],['100','#D9E8FF'],['200','#B8D3FF'],['300','#93BCFF'],['400','#6BA3FF'],['500','#4589FF'],['600','#2870F5'],['700','#1558E0'],['800','#0844C7'],['900','#0233AF'],['1000','#002698'],['1100','#001B82'],['1200','#00116D'],['1300','#000B59'],['1400','#000648'],['1500','#000338'],['1600','#00012A'],['1700','#00001E'],['1800','#000014'],['1900','#00000C']] },
      { name: 'Ocean Depths', shades: [['50','#EBF7FF'],['100','#D2EEFF'],['200','#AADEFF'],['300','#7ECBFF'],['400','#52B6FF'],['500','#2AA1FF'],['600','#0D8EEA'],['700','#007AD2'],['800','#0065B8'],['900','#00519F'],['1000','#003E87'],['1100','#002D70'],['1200','#001E5A'],['1300','#001246'],['1400','#000A34'],['1500','#000424'],['1600','#000117'],['1700','#00000D'],['1800','#000007'],['1900','#000003']] },
      { name: 'Regal Indigo', shades: [['50','#F0F2FF'],['100','#DCE1FF'],['200','#BAC3FF'],['300','#94A1FF'],['400','#6B7DFF'],['500','#4559FF'],['600','#263BF5'],['700','#1326E0'],['800','#0715C7'],['900','#020CAF'],['1000','#000798'],['1100','#000482'],['1200','#00036D'],['1300','#000259'],['1400','#000148'],['1500','#000138'],['1600','#00002A'],['1700','#00001E'],['1800','#000014'],['1900','#00000C']] }
    ],
    'luxury-golds': [
      { name: 'Burnished Gold', shades: [['50','#FFF9EC'],['100','#FFF1CE'],['200','#FFE49D'],['300','#FFD666'],['400','#FFC733'],['500','#FFB800'],['600','#E6A200'],['700','#CC8C00'],['800','#B27600'],['900','#996000'],['1000','#7F4C00'],['1100','#663A00'],['1200','#4D2A00'],['1300','#361C00'],['1400','#221100'],['1500','#130900'],['1600','#0A0500'],['1700','#050200'],['1800','#020100'],['1900','#010000']] },
      { name: 'Amber Glow', shades: [['50','#FFFBEE'],['100','#FFF3CC'],['200','#FFE99A'],['300','#FFDC64'],['400','#FFCE2E'],['500','#FFBE00'],['600','#E8A900'],['700','#D09400'],['800','#B87E00'],['900','#A06900'],['1000','#885400'],['1100','#704100'],['1200','#582F00'],['1300','#421E00'],['1400','#2E1000'],['1500','#1C0700'],['1600','#0E0300'],['1700','#070100'],['1800','#030000'],['1900','#010000']] },
      { name: 'Venetian Ochre', shades: [['50','#FFF9E8'],['100','#FFF1C7'],['200','#FFE295'],['300','#FFD161'],['400','#FFBE2C'],['500','#F5A700'],['600','#D68E00'],['700','#B87500'],['800','#995D00'],['900','#7C4700'],['1000','#613400'],['1100','#492400'],['1200','#341700'],['1300','#230D00'],['1400','#160700'],['1500','#0C0300'],['1600','#060100'],['1700','#030000'],['1800','#010000'],['1900','#000000']] }
    ],
    'contemporary-greys': [
      { name: 'Slate Cloud', shades: [['50','#F8F9FA'],['100','#EFF0F2'],['200','#DEE0E4'],['300','#CDD0D5'],['400','#BBC0C6'],['500','#A9ADB5'],['600','#969AA3'],['700','#838690'],['800','#70737D'],['900','#5E606B'],['1000','#4D4F58'],['1100','#3D3F46'],['1200','#2E2F36'],['1300','#202127'],['1400','#141519'],['1500','#0A0B0E'],['1600','#050507'],['1700','#020304'],['1800','#010102'],['1900','#000000']] },
      { name: 'Silver Mist', shades: [['50','#FAFAFA'],['100','#F3F3F3'],['200','#E7E7E7'],['300','#DADADA'],['400','#CCCCCC'],['500','#BDBDBD'],['600','#AEAEAE'],['700','#9E9E9E'],['800','#8E8E8E'],['900','#7E7E7E'],['1000','#6F6F6F'],['1100','#606060'],['1200','#515151'],['1300','#434343'],['1400','#363636'],['1500','#292929'],['1600','#1D1D1D'],['1700','#131313'],['1800','#0A0A0A'],['1900','#030303']] },
      { name: 'Charcoal Loft', shades: [['50','#F5F5F7'],['100','#E6E6EA'],['200','#CDCDD7'],['300','#B1B1C2'],['400','#9494AC'],['500','#777796'],['600','#5E5E7E'],['700','#4A4A67'],['800','#373750'],['900','#26263B'],['1000','#191929'],['1100','#11111E'],['1200','#0B0B15'],['1300','#07070E'],['1400','#040409'],['1500','#020205'],['1600','#010103'],['1700','#000002'],['1800','#000001'],['1900','#000000']] }
    ],
    'warm-terracotta': [
      { name: 'Rust Bloom', shades: [['50','#FFF4EE'],['100','#FFE5D5'],['200','#FFCAAB'],['300','#FFA97C'],['400','#FF8550'],['500','#FF6128'],['600','#F44610'],['700','#D93407'],['800','#BE2505'],['900','#A41B03'],['1000','#8B1201'],['1100','#730A00'],['1200','#5C0400'],['1300','#480100'],['1400','#360000'],['1500','#270000'],['1600','#1A0000'],['1700','#100000'],['1800','#080000'],['1900','#030000']] },
      { name: 'Spice Trail', shades: [['50','#FFF5EF'],['100','#FFE8D6'],['200','#FFD1AE'],['300','#FFB77E'],['400','#FF9C52'],['500','#FF8030'],['600','#F06416'],['700','#D44B09'],['800','#B83502'],['900','#9D2200'],['1000','#831200'],['1100','#6B0600'],['1200','#560200'],['1300','#430000'],['1400','#320000'],['1500','#230000'],['1600','#170000'],['1700','#0D0000'],['1800','#060000'],['1900','#020000']] },
      { name: 'Tuscan Clay', shades: [['50','#FFF6F1'],['100','#FFEADF'],['200','#FFD6C1'],['300','#FFBFA0'],['400','#FFA67E'],['500','#F98B5C'],['600','#E47141'],['700','#C8582A'],['800','#A94218'],['900','#892F0C'],['1000','#6B1F05'],['1100','#511302'],['1200','#3B0A01'],['1300','#290500'],['1400','#1A0200'],['1500','#0F0100'],['1600','#080000'],['1700','#040000'],['1800','#020000'],['1900','#000000']] }
    ],
    'classic-pastels': [
      { name: 'Baby Blush', shades: [['50','#FFF5F7'],['100','#FFEBEF'],['200','#FFD6E0'],['300','#FFBECF'],['400','#FFA3BC'],['500','#FF89A8'],['600','#F06E93'],['700','#D4557E'],['800','#B83E6A'],['900','#9D2A57'],['1000','#831A46'],['1100','#6B0D37'],['1200','#560429'],['1300','#43001D'],['1400','#320013'],['1500','#23000C'],['1600','#170006'],['1700','#0D0003'],['1800','#060001'],['1900','#020000']] },
      { name: 'Mint Frost', shades: [['50','#F2FBF8'],['100','#E1F6EF'],['200','#C3EDE0'],['300','#A3E2CF'],['400','#81D5BC'],['500','#5EC8A9'],['600','#3DB995'],['700','#27A882'],['800','#13966E'],['900','#06845B'],['1000','#027149'],['1100','#015D39'],['1200','#00492C'],['1300','#003720'],['1400','#002715'],['1500','#00180C'],['1600','#000C06'],['1700','#000603'],['1800','#000201'],['1900','#000000']] },
      { name: 'Lavender Haze', shades: [['50','#F8F5FF'],['100','#F0EBFF'],['200','#E2D6FF'],['300','#D1BFFF'],['400','#BDA8FF'],['500','#A88FFF'],['600','#9174F4'],['700','#795AE6'],['800','#6242D6'],['900','#4E2DC5'],['1000','#3C1BB4'],['1100','#2C0CA3'],['1200','#1F0390'],['1300','#14007E'],['1400','#0B006C'],['1500','#05005B'],['1600','#02004C'],['1700','#01003D'],['1800','#00002F'],['1900','#000022']] }
    ],
    'deep-navys': [
      { name: 'Night Sky', shades: [['50','#EDEEF5'],['100','#D5D8EC'],['200','#ADB1D9'],['300','#848AC5'],['400','#5B65B2'],['500','#36429E'],['600','#1F2A8E'],['700','#10187C'],['800','#060B6A'],['900','#020358'],['1000','#010047'],['1100','#000038'],['1200','#00002B'],['1300','#00001F'],['1400','#000015'],['1500','#00000D'],['1600','#000007'],['1700','#000004'],['1800','#000001'],['1900','#000000']] },
      { name: 'Astral Abyss', shades: [['50','#E9EDF5'],['100','#CBD6EC'],['200','#9EAFD6'],['300','#748BBD'],['400','#4F6AA4'],['500','#314C8A'],['600','#1D3774'],['700','#10265F'],['800','#08194C'],['900','#030E3A'],['1000','#01072C'],['1100','#000421'],['1200','#000217'],['1300','#000110'],['1400','#00000A'],['1500','#000006'],['1600','#000003'],['1700','#000001'],['1800','#000000'],['1900','#000000']] },
      { name: 'Sovereign Navy', shades: [['50','#ECF0F7'],['100','#D1DCED'],['200','#A6BCDC'],['300','#7D9CC9'],['400','#577EB5'],['500','#3862A0'],['600','#224C8B'],['700','#143A76'],['800','#0A2A61'],['900','#041D4E'],['1000','#02133D'],['1100','#010B2F'],['1200','#000723'],['1300','#000418'],['1400','#000210'],['1500','#000109'],['1600','#000005'],['1700','#000003'],['1800','#000001'],['1900','#000000']] }
    ],
    'soft-pinks': [
      { name: 'Rose Quartz', shades: [['50','#FFF5F8'],['100','#FFECF2'],['200','#FFD8E7'],['300','#FFC1D9'],['400','#FFA8CA'],['500','#FF8DB9'],['600','#F070A4'],['700','#D9548E'],['800','#C03A7A'],['900','#A62268'],['1000','#8C0E57'],['1100','#740447'],['1200','#5D0139'],['1300','#48002C'],['1400','#360021'],['1500','#260016'],['1600','#190010'],['1700','#0F0009'],['1800','#080004'],['1900','#030001']] },
      { name: 'Blush Petal', shades: [['50','#FFF7FA'],['100','#FFEFF5'],['200','#FFDDED'],['300','#FFCAE4'],['400','#FFB4DA'],['500','#FF9ECF'],['600','#F085BB'],['700','#D96DA7'],['800','#C05593'],['900','#A73F80'],['1000','#8D2B6D'],['1100','#741A5C'],['1200','#5D0D4C'],['1300','#48053D'],['1400','#36002E'],['1500','#270021'],['1600','#1A0016'],['1700','#100010'],['1800','#080007'],['1900','#030003']] },
      { name: 'Dusty Peony', shades: [['50','#FFF5F7'],['100','#FFE8ED'],['200','#FFD2DD'],['300','#FFB7C7'],['400','#F898AE'],['500','#E67993'],['600','#CE5C78'],['700','#B34360'],['800','#962E4A'],['900','#7B1D36'],['1000','#621026'],['1100','#4C071A'],['1200','#390311'],['1300','#29010A'],['1400','#1B0006'],['1500','#110003'],['1600','#090001'],['1700','#050000'],['1800','#020000'],['1900','#000000']] }
    ]
  };

  const tagsEl  = document.getElementById('cp-tags');
  const gridEl  = document.getElementById('cp-swatches-grid');
  const nameEl  = document.getElementById('cp-palette-name');
  const hexEl   = document.getElementById('cp-palette-hex');
  const backBtn = document.getElementById('cp-back-btn');

  if (!tagsEl || !gridEl) return;

  let currentFamily  = 'modern-neutrals';
  let currentPalette = null;

  function renderShades(palette) {
    currentPalette = palette;
    if (nameEl) nameEl.textContent = palette.name;
    if (hexEl)  hexEl.textContent  = palette.shades[3][1];

    gridEl.innerHTML = palette.shades.map(([label, hex]) => `
      <div class="cp-swatch" role="listitem" tabindex="0"
           style="--sw-color:${hex}"
           aria-label="${palette.name} ${label} ${hex}">
        <div class="cp-swatch-color"></div>
        <span class="cp-swatch-label">${label}</span>
        <span class="cp-swatch-hex">${hex}</span>
      </div>
    `).join('');

    gridEl.querySelectorAll('.cp-swatch').forEach((sw, i) => {
      sw.addEventListener('click', () => {
        if (hexEl) hexEl.textContent = palette.shades[i][1];
        gridEl.querySelectorAll('.cp-swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
      });
      sw.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (hexEl) hexEl.textContent = palette.shades[i][1];
          gridEl.querySelectorAll('.cp-swatch').forEach(s => s.classList.remove('selected'));
          sw.classList.add('selected');
        }
      });
    });
  }

  function renderFamily(family) {
    currentFamily = family;
    const list = PALETTES[family] || [];
    gridEl.innerHTML = list.map((pal, idx) => {
      const previews = pal.shades.slice(0, 5).map(([,h]) => `<span style="background:${h}"></span>`).join('');
      return `
        <div class="cp-family-card" role="button" tabindex="0" data-idx="${idx}" aria-label="View ${pal.name} palette">
          <div class="cp-fc-preview">${previews}</div>
          <p class="cp-fc-name">${pal.name}</p>
        </div>
      `;
    }).join('');

    gridEl.querySelectorAll('.cp-family-card').forEach(card => {
      const idx = parseInt(card.dataset.idx, 10);
      const activate = () => renderShades(PALETTES[currentFamily][idx]);
      card.addEventListener('click', activate);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
    });

    if (nameEl) nameEl.textContent = `${list.length} Palettes Available`;
    if (hexEl)  hexEl.textContent  = 'Select a palette below to view full 50-1900 shades';
  }

  tagsEl.querySelectorAll('.cp-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tagsEl.querySelectorAll('.cp-tag').forEach(t => { 
        t.classList.remove('active'); 
        t.setAttribute('aria-selected','false'); 
      });
      tag.classList.add('active');
      tag.setAttribute('aria-selected','true');
      tag.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      
      const fam = tag.dataset.family;
      currentFamily = fam;
      // Auto-show first palette shades directly for immediate visual impact
      if (PALETTES[fam]?.[0]) {
        renderShades(PALETTES[fam][0]);
      } else {
        renderFamily(fam);
      }
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => renderFamily(currentFamily));
  }

  // Initial load: show Modern Neutrals -> Sand Silk
  if (PALETTES['modern-neutrals']?.[0]) {
    renderShades(PALETTES['modern-neutrals'][0]);
  }
});




