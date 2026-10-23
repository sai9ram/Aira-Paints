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
  const bucketImgMobile = document.getElementById('hero-bucket-img-mobile');

  // Gradient generator for background mood
  const getHeroGradient = (hex) => {
    switch (hex) {
      case '#0F4D3A': // Premium Interior Emulsion
        return 'radial-gradient(circle at 75% 45%, #155e47 0%, #0c3d2e 60%, #07261c 100%)';
      case '#0B2E59': // Premium Exterior Emulsion
        return 'radial-gradient(circle at 75% 45%, #144985 0%, #0a294f 60%, #05162b 100%)';
      case '#4A3F6B': // Aira Eco Primer
        return 'radial-gradient(circle at 75% 45%, #62538c 0%, #3e3359 60%, #1e192c 100%)';
      case '#1D709A': // Essential Exterior Emulsion
        return 'radial-gradient(circle at 75% 45%, #258ec2 0%, #14597b 60%, #092a3b 100%)';
      case '#5C2B4E': // Essential Interior Emulsion
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

      // Sync mobile-only duplicate image
      if (bucketImgMobile) {
        bucketImgMobile.style.opacity = '0';
        bucketImgMobile.style.transform = 'scale(0.92)';
        setTimeout(() => {
          bucketImgMobile.src = imgPath;
          bucketImgMobile.style.opacity = '1';
          bucketImgMobile.style.transform = 'scale(1)';
        }, 250);
      }

      if (canGlow) {
        canGlow.style.setProperty('--glow-color', glowColor);
      }
    };

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

  /* ============================================================
     CREATIVE SHADES — Colour Palette Explorer
     ============================================================ */
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

  if (tagsEl && gridEl) {
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
