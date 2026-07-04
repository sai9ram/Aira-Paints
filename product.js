document.addEventListener('DOMContentLoaded', () => {
  // ── Header Scroll State Controller ──
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ── Central Stage Interactive Product Swapping ──
  const heroSection = document.getElementById('product-hero');
  const bucketImg = document.getElementById('hero-bucket-img');
  const canGlow = document.getElementById('hero-can-glow');
  const stageTitle = document.getElementById('stage-product-title');
  const statCoverage = document.getElementById('stat-val-coverage');
  const statFeatures = document.getElementById('stat-val-features');
  const paletteItems = document.querySelectorAll('.palette-item');

  paletteItems.forEach((item) => {
    item.addEventListener('click', () => {
      // Toggle active states
      paletteItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Extract metadata values
      const color = item.getAttribute('data-color');
      const imgPath = item.getAttribute('data-image');
      const glowColor = item.getAttribute('data-glow');
      const title = item.getAttribute('data-title');
      const coverage = item.getAttribute('data-cov');
      const features = item.getAttribute('data-res');

      // Smooth background color shift
      if (heroSection) {
        heroSection.style.backgroundColor = color;
      }

      // Smooth text transitions (fade-out, swap, fade-in)
      if (stageTitle) {
        stageTitle.style.opacity = '0';
        stageTitle.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          stageTitle.textContent = title;
          stageTitle.style.opacity = '1';
          stageTitle.style.transform = 'translateY(0)';
        }, 300);
      }

      if (statCoverage) {
        statCoverage.style.opacity = '0';
        statCoverage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          statCoverage.textContent = coverage;
          statCoverage.style.opacity = '1';
          statCoverage.style.transform = 'translateY(0)';
        }, 300);
      }

      if (statFeatures) {
        statFeatures.style.opacity = '0';
        statFeatures.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          statFeatures.textContent = features;
          statFeatures.style.opacity = '1';
          statFeatures.style.transform = 'translateY(0)';
        }, 300);
      }

      // Paint can visual swap transition
      if (bucketImg) {
        bucketImg.style.transform = 'scale(0.8)';
        bucketImg.style.opacity = '0.3';
        bucketImg.style.filter = 'blur(10px)';

        setTimeout(() => {
          bucketImg.src = imgPath;
          bucketImg.style.transform = 'scale(1)';
          bucketImg.style.opacity = '1';
          bucketImg.style.filter = 'drop-shadow(0 25px 45px rgba(0, 0, 0, 0.35))';
        }, 300);
      }

      if (canGlow) {
        canGlow.style.setProperty('--glow-color', glowColor);
      }
    });
  });

  // ── Cursor Ripple Follower Effect ──
  const rippleTracker = document.getElementById('paint-ripple-tracker');
  let lastRippleTime = 0;

  if (heroSection && rippleTracker) {
    heroSection.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastRippleTime < 100) return; // Limit ripple frequency to 10Hz
      lastRippleTime = now;

      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('div');
      ripple.classList.add('paint-ripple');
      
      // Get current active color to tint the ripple
      const activePalette = document.querySelector('.palette-item.active');
      const tint = activePalette ? activePalette.getAttribute('data-glow') : 'rgba(255, 255, 255, 0.22)';
      ripple.style.background = `radial-gradient(circle, ${tint} 0%, rgba(255, 255, 255, 0) 70%)`;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      rippleTracker.appendChild(ripple);

      // Clean up ripple element after animation finishes
      setTimeout(() => {
        ripple.remove();
      }, 800);
    });
  }

  // ── Splashes & Benefit Badges Parallax Effect on Mouse Move ──
  const splashes = document.querySelectorAll('.floating-splash');
  const benefitBadges = document.querySelectorAll('.benefit-badge');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
      const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

      // Parallax splashes
      splashes.forEach((splash, idx) => {
        const factor = (idx + 1) * 20; // Different depth weights
        const moveX = xPercent * factor;
        const moveY = yPercent * factor;
        splash.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      // Parallax benefit badges
      benefitBadges.forEach((badge, idx) => {
        const factor = (idx + 1) * 15;
        const moveX = xPercent * factor;
        const moveY = yPercent * factor;
        // Keep the floating float loop animation active while shifting position slightly
        badge.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  // ── Scroll Reveal for Category Cards ──
  const categoryCards = document.querySelectorAll('.category-card');
  
  function handleCategoriesReveal() {
    const viewportHeight = window.innerHeight;
    categoryCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.88) {
        card.style.transitionDelay = `${(idx % 4) * 0.15}s`; // Stagger up to 4 items in a row
        card.classList.add('revealed');
      } else {
        card.style.transitionDelay = '0s';
        card.classList.remove('revealed');
      }
    });
  }

  // ── Scroll Reveal for Standout Section ──
  const standoutWrapper = document.querySelector('.standout-image-wrapper');
  const standoutCards = document.querySelectorAll('.standout-feature-card');

  function handleStandoutReveal() {
    const viewportHeight = window.innerHeight;
    
    if (standoutWrapper) {
      const rect = standoutWrapper.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.85) {
        standoutWrapper.classList.add('revealed');
      } else {
        standoutWrapper.classList.remove('revealed');
      }
    }

    standoutCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.88) {
        card.style.transitionDelay = `${(idx % 2) * 0.15}s`; // Stagger in 2 columns
        card.classList.add('revealed');
      } else {
        card.style.transitionDelay = '0s';
        card.classList.remove('revealed');
      }
    });
  }

  // ── Comparison Table Tabs Switcher ──
  const tabBtns = document.querySelectorAll('.comparison-tabs .tab-btn');
  const tablePanels = document.querySelectorAll('.comparison-table .table-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = btn.getAttribute('data-target');
      tablePanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ── Timeline Progress Scroll Tracker ──
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const timelineFill = document.getElementById('timeline-scroll-fill');
  const timelineContainer = document.querySelector('.timeline-container');

  function handleTimelineProgress() {
    if (!timelineContainer) return;
    const viewportHeight = window.innerHeight;
    const rect = timelineContainer.getBoundingClientRect();
    
    const startThreshold = viewportHeight * 0.85;
    const endThreshold = viewportHeight * 0.2;
    const totalRange = startThreshold - endThreshold;
    
    let progress = 0;
    if (rect.top <= startThreshold) {
      const relativePosition = startThreshold - rect.top;
      progress = Math.min(Math.max(relativePosition / totalRange, 0), 1);
    }

    if (timelineFill) {
      if (window.innerWidth <= 900) {
        timelineFill.style.width = '100%';
        timelineFill.style.height = `${progress * 100}%`;
      } else {
        timelineFill.style.height = '100%';
        timelineFill.style.width = `${progress * 100}%`;
      }
    }

    timelineSteps.forEach((step, idx) => {
      const stepThreshold = (idx + 0.25) / timelineSteps.length;
      if (progress >= stepThreshold) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleCategoriesReveal();
    handleStandoutReveal();
    handleTimelineProgress();
  });
  handleCategoriesReveal();
  handleStandoutReveal();
  handleTimelineProgress();
  window.addEventListener('resize', () => {
    handleCategoriesReveal();
    handleStandoutReveal();
    handleTimelineProgress();
  });
});
