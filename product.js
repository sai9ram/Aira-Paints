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
  const stageDesc = document.getElementById('stage-product-desc');
  const statCoverage = document.getElementById('stat-val-coverage');
  const statFeatures = document.getElementById('stat-val-features');
  const paletteItems = document.querySelectorAll('.palette-item');

  // Gradient generator for background mood
  const getHeroGradient = (hex) => {
    switch (hex) {
      case '#0F4D3A': // Eco Green
        return 'radial-gradient(circle at 75% 45%, #155e47 0%, #0c3d2e 60%, #07261c 100%)';
      case '#0B2E59': // Dark Blue
        return 'radial-gradient(circle at 75% 45%, #144985 0%, #0a294f 60%, #05162b 100%)';
      case '#4A3F6B': // Violet Primer
        return 'radial-gradient(circle at 75% 45%, #62538c 0%, #3e3359 60%, #1e192c 100%)';
      case '#1D709A': // Sky Blue
        return 'radial-gradient(circle at 75% 45%, #258ec2 0%, #14597b 60%, #092a3b 100%)';
      case '#5C2B4E': // Premier Velvet
        return 'radial-gradient(circle at 75% 45%, #80396b 0%, #4a203e 60%, #240d1e 100%)';
      default:
        return 'radial-gradient(circle at 75% 45%, #155e47 0%, #0c3d2e 60%, #07261c 100%)';
    }
  };

  paletteItems.forEach((item) => {
    const activatePalette = () => {
      // Toggle active states
      paletteItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Extract metadata values
      const color = item.getAttribute('data-color');
      const imgPath = item.getAttribute('data-image');
      const glowColor = item.getAttribute('data-glow');
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');
      const coverage = item.getAttribute('data-cov');
      const features = item.getAttribute('data-res');

      // Smooth background color shift
      if (heroSection) {
        heroSection.style.background = getHeroGradient(color);
      }

      // Smooth text transitions (fade-out, swap, fade-in)
      if (stageTitle) {
        stageTitle.style.opacity = '0';
        stageTitle.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          stageTitle.textContent = title;
          stageTitle.style.opacity = '1';
          stageTitle.style.transform = 'translateY(0)';
        }, 220);
      }

      if (stageDesc && desc) {
        stageDesc.style.opacity = '0';
        setTimeout(() => {
          stageDesc.textContent = desc;
          stageDesc.style.opacity = '1';
        }, 220);
      }

      if (statCoverage) {
        statCoverage.style.opacity = '0';
        setTimeout(() => {
          statCoverage.textContent = coverage;
          statCoverage.style.opacity = '1';
        }, 220);
      }

      if (statFeatures) {
        statFeatures.style.opacity = '0';
        setTimeout(() => {
          statFeatures.textContent = features;
          statFeatures.style.opacity = '1';
        }, 220);
      }

      // Paint can visual swap transition
      if (bucketImg) {
        bucketImg.style.transform = 'translateY(12px) scale(0.92)';
        bucketImg.style.opacity = '0.4';
        bucketImg.style.filter = 'blur(6px)';

        setTimeout(() => {
          bucketImg.src = imgPath;
          bucketImg.style.transform = 'translateY(0) scale(1)';
          bucketImg.style.opacity = '1';
          bucketImg.style.filter = 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.45))';
        }, 250);
      }

      if (canGlow) {
        canGlow.style.setProperty('--glow-color', glowColor);
      }
    };

  // ── Mobile Hero: Move product image below pill tabs ──
  // On mobile, physically re-insert the visual after the pill switcher
  const heroContainer   = document.querySelector('.product-hero-container');
  const heroCopy        = document.querySelector('.product-hero-copy');
  const heroVisual      = document.querySelector('.product-hero-visual');
  const switcherWrap    = document.querySelector('.product-switcher-wrap');

  let visualMoved = false;

  function reorderMobileHeroVisual() {
    if (!heroContainer || !heroCopy || !heroVisual || !switcherWrap) return;

    if (window.innerWidth <= 768 && !visualMoved) {
      // Move visual right after the pill switcher, inside hero-copy
      switcherWrap.insertAdjacentElement('afterend', heroVisual);
      visualMoved = true;
    } else if (window.innerWidth > 768 && visualMoved) {
      // Restore visual back as last child of hero-container (desktop layout)
      heroContainer.appendChild(heroVisual);
      visualMoved = false;
    }
  }

  reorderMobileHeroVisual();
  window.addEventListener('resize', reorderMobileHeroVisual);

    // Click — desktop + mobile browsers
    item.addEventListener('click', activatePalette);
  });

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
    const activateTab = (e) => {
      if (e && e.type === 'touchend') e.preventDefault();
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
    };
    btn.addEventListener('click', activateTab);
    btn.addEventListener('touchend', activateTab, { passive: false });
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

  // ── Color Collection Switcher & Wall Rebuilder ──
  const colorCollectionsData = {
    'modern-neutrals': [
      { name: 'Sand Silk', code: '#E3DEC3' },
      { name: 'Stone Grey', code: '#A09C94' },
      { name: 'Warm Taupe', code: '#82776A' },
      { name: 'Soft Linen', code: '#F2EFE9' }
    ],
    'earthy-greens': [
      { name: 'Forest Pine', code: '#1E3F20' },
      { name: 'Soft Sage', code: '#9CA086' },
      { name: 'Mossy Canopy', code: '#5A6B4F' },
      { name: 'Olive Grove', code: '#7E805B' }
    ],
    'elegant-whites': [
      { name: 'Pure Alabaster', code: '#F7F6F0' },
      { name: 'Ivory Lace', code: '#FFFDF3' },
      { name: 'Pearl Frost', code: '#ECECE6' },
      { name: 'Chalk White', code: '#FBFBF9' }
    ],
    'royal-blues': [
      { name: 'Majestic Navy', code: '#0B1E3F' },
      { name: 'Classic Indigo', code: '#1E3B70' },
      { name: 'Deep Cerulean', code: '#215580' },
      { name: 'Sea Breeze', code: '#8AB8D0' }
    ],
    'luxury-golds': [
      { name: 'Antique Ochre', code: '#C5A059' },
      { name: 'Royal Marigold', code: '#E3A81E' },
      { name: 'Amber Sunset', code: '#D18E36' },
      { name: 'Gilded Bronze', code: '#8C6E3D' }
    ],
    'contemporary-greys': [
      { name: 'Mineral Ash', code: '#D2D3D5' },
      { name: 'Steel Shadow', code: '#767B80' },
      { name: 'Charcoal Haze', code: '#3A3F42' },
      { name: 'Industrial Iron', code: '#545759' }
    ],
    'warm-terracotta': [
      { name: 'Baked Clay', code: '#B2533E' },
      { name: 'Burnt Sienna', code: '#A03B26' },
      { name: 'Copper Dust', code: '#D27E5B' },
      { name: 'Rust Desert', code: '#8E3424' }
    ],
    'classic-pastels': [
      { name: 'Blush Pink', code: '#F6DFDC' },
      { name: 'Mint Cream', code: '#E1EFE6' },
      { name: 'Soft Lavender', code: '#E6E1FA' },
      { name: 'Lemon Souffle', code: '#FBF3D5' }
    ]
  };

  const filterChips = document.querySelectorAll('.filter-chip');
  const chipsContainer = document.getElementById('color-chips-container');

  filterChips.forEach((chip) => {
    const activateChip = (e) => {
      if (e && e.type === 'touchend') e.preventDefault();
      if (chip.classList.contains('active')) return;

      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const category = chip.getAttribute('data-category');
      const colors = colorCollectionsData[category] || [];

      // Fade out wall
      if (chipsContainer) {
        chipsContainer.style.opacity = '0';
        chipsContainer.style.transform = 'translateY(10px) scale(0.98)';

        setTimeout(() => {
          // Rebuild chips HTML content
          chipsContainer.innerHTML = colors.map((col, idx) => `
            <div class="color-chip-card" data-category="${category}" style="--chip-color: ${col.code}; opacity: 0; transform: translateY(15px); transition: all 0.4s ease ${idx * 0.08}s;">
              <div class="chip-preview"></div>
              <div class="chip-info">
                <span class="chip-name">${col.name}</span>
                <span class="chip-code">${col.code}</span>
              </div>
            </div>
          `).join('');

          // Force reflow
          chipsContainer.offsetHeight;

          // Fade in wall container
          chipsContainer.style.opacity = '1';
          chipsContainer.style.transform = 'translateY(0) scale(1)';

          // Trigger internal chip reveals
          const newChips = chipsContainer.querySelectorAll('.color-chip-card');
          newChips.forEach(ch => {
            ch.style.opacity = '1';
            ch.style.transform = 'translateY(0)';
          });

        }, 300);
      }
    };
    chip.addEventListener('click', activateChip);
    chip.addEventListener('touchend', activateChip, { passive: false });
  });

  // ── 1L Eco Final Series Studio Controller ──
  const ecoVariantBtns = document.querySelectorAll('.eco-variant-btn');
  const ecoAngleBtns = document.querySelectorAll('.angle-btn');
  const ecoStudioImg = document.getElementById('eco-studio-img');
  const ecoStageGlow = document.getElementById('eco-stage-glow');
  const studioProductName = document.getElementById('studio-product-name');
  const studioProductDesc = document.getElementById('studio-product-desc');
  const studioSpecFinish = document.getElementById('studio-spec-finish');
  const studioSpecVoc = document.getElementById('studio-spec-voc');
  const studioSpecDrying = document.getElementById('studio-spec-drying');

  let activeVariant = 'green';
  let activeAngle = 'front';

  const ecoImageMap = {
    green: {
      front: 'images/products/Green Emulsion Front View1.png',
      side: 'images/products/Green Emulsion Front View1.png',
      back: 'images/products/Green Emulsion Front View1.png',
      '360': 'images/products/Green Emulsion Front View1.png'
    },
    darkblue: {
      front: 'images/products/Dark Blue front View1.png',
      side: 'images/products/Dark Blue front View1.png',
      back: 'images/products/Dark Blue front View1.png',
      '360': 'images/products/Dark Blue front View1.png'
    },
    violetprimer: {
      front: 'images/products/Voilate Emulsion Front view.png',
      side: 'images/products/Voilate Emulsion Front view.png',
      back: 'images/products/Voilate Emulsion Front view.png',
      '360': 'images/products/Voilate Emulsion Front view.png'
    },
    skyblue: {
      front: 'images/products/Sky Blue Front View1.png',
      side: 'images/products/Sky Blue Front View1.png',
      back: 'images/products/Sky Blue Front View1.png',
      '360': 'images/products/Sky Blue Front View1.png'
    },
    grape: {
      front: 'images/products/Premire Front View1.png',
      side: 'images/products/Premire Front View1.png',
      back: 'images/products/Premire Front View1.png',
      '360': 'images/products/Premire Front View1.png'
    }
  };

  function updateStudioDisplay() {
    if (!ecoStudioImg) return;
    const newPath = ecoImageMap[activeVariant]?.[activeAngle] || ecoImageMap.green.front;
    
    ecoStudioImg.style.transform = 'scale(0.88) rotate(-4deg)';
    ecoStudioImg.style.opacity = '0.3';
    ecoStudioImg.style.filter = 'blur(8px)';

    setTimeout(() => {
      ecoStudioImg.src = newPath;
      ecoStudioImg.style.transform = 'scale(1) rotate(0deg)';
      ecoStudioImg.style.opacity = '1';
      ecoStudioImg.style.filter = 'drop-shadow(0 20px 35px rgba(0,0,0,0.4))';
    }, 250);
  }

  ecoVariantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ecoVariantBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeVariant = btn.getAttribute('data-variant');
      const name = btn.getAttribute('data-name');
      const desc = btn.getAttribute('data-desc');
      const finish = btn.getAttribute('data-finish');
      const voc = btn.getAttribute('data-voc');
      const drying = btn.getAttribute('data-drying');
      const color = btn.getAttribute('data-color');

      if (studioProductName) studioProductName.textContent = name;
      if (studioProductDesc) studioProductDesc.textContent = desc;
      if (studioSpecFinish) studioSpecFinish.textContent = finish;
      if (studioSpecVoc) studioSpecVoc.innerHTML = voc;
      if (studioSpecDrying) studioSpecDrying.textContent = drying;
      if (ecoStageGlow) {
        ecoStageGlow.style.background = `radial-gradient(circle, ${color}55 0%, rgba(0,0,0,0) 70%)`;
      }

      updateStudioDisplay();
    });
  });

  ecoAngleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ecoAngleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAngle = btn.getAttribute('data-angle');
      updateStudioDisplay();
    });
  });

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
