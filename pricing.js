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

  // ── Interactive Price Estimator Engine ──
  const paintCategorySelect = document.getElementById('paint-category');
  const gradeBtns = document.querySelectorAll('.grade-btn');
  const wallAreaInput = document.getElementById('wall-area');
  const sliderAreaVal = document.getElementById('slider-area-val');

  // Hero showcase image elements
  const heroImg = document.getElementById('pricing-hero-img') || document.querySelector('.pricing-hero-showcase-img');
  const spotlightGlow = document.getElementById('pricing-spotlight-glow') || document.querySelector('.pricing-spotlight-glow');

  // Product visuals mapping
  const categoryVisuals = {
    'interior': {
      image: 'images/products/Green Emulsion Front View1.png',
      alt: 'Aira Premium Interior Emulsion Paint Can',
      glow: 'radial-gradient(circle, rgba(110, 198, 176, 0.35) 0%, rgba(255,255,255,0) 70%)',
      shadow: '0 20px 35px rgba(15, 77, 58, 0.22)'
    },
    'exterior': {
      image: 'images/products/Dark Blue front View1.png',
      alt: 'Aira Premium Exterior Emulsion Paint Can',
      glow: 'radial-gradient(circle, rgba(58, 134, 255, 0.35) 0%, rgba(255,255,255,0) 70%)',
      shadow: '0 20px 35px rgba(11, 46, 89, 0.25)'
    },
    'primer': {
      image: 'images/products/Voilate Emulsion Front view.png',
      alt: 'Aira Eco Primer Paint Can',
      glow: 'radial-gradient(circle, rgba(141, 123, 209, 0.35) 0%, rgba(255,255,255,0) 70%)',
      shadow: '0 20px 35px rgba(74, 63, 107, 0.25)'
    },
    'waterproofing': {
      image: 'images/products/Sky Blue Front View1.png',
      alt: 'Aira Essential Exterior Emulsion Paint Can',
      glow: 'radial-gradient(circle, rgba(110, 198, 220, 0.35) 0%, rgba(255,255,255,0) 70%)',
      shadow: '0 20px 35px rgba(29, 112, 154, 0.25)'
    },
    'essential-interior': {
      image: 'images/products/Premire Front View1.png',
      alt: 'Aira Essential Interior Emulsion Paint Can',
      glow: 'radial-gradient(circle, rgba(186, 85, 211, 0.35) 0%, rgba(255,255,255,0) 70%)',
      shadow: '0 20px 35px rgba(92, 43, 78, 0.25)'
    }
  };

  // Preload product images for instant zero-lag switching
  Object.values(categoryVisuals).forEach(item => {
    const preload = new Image();
    preload.src = item.image;
  });

  function updateHeroImage(categoryKey) {
    if (!heroImg) return;
    const visual = categoryVisuals[categoryKey];
    if (!visual) return;

    // Smooth transition: scale down slightly & fade
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'translateY(8px) scale(0.95)';

    setTimeout(() => {
      heroImg.src = visual.image;
      heroImg.alt = visual.alt;
      heroImg.style.filter = `drop-shadow(${visual.shadow})`;
      if (spotlightGlow) {
        spotlightGlow.style.background = visual.glow;
      }
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'translateY(0) scale(1)';
    }, 200);
  }

  // Outputs elements
  const outLiters = document.getElementById('out-liters');
  const outCost = document.getElementById('out-cost');
  const detailCoverage = document.getElementById('detail-coverage');
  const detailCans = document.getElementById('detail-cans');

  let activePrice = 420; // Default Premium price per Can (3.6L)
  let activeCoverage = 350; // Default coverage in sq.ft per Can

  // Category Selector Dropdown listener
  if (paintCategorySelect) {
    paintCategorySelect.addEventListener('change', () => {
      const selectedOption = paintCategorySelect.options[paintCategorySelect.selectedIndex];
      activeCoverage = parseFloat(selectedOption.getAttribute('data-coverage'));
      if (selectedOption.hasAttribute('data-price')) {
        activePrice = parseFloat(selectedOption.getAttribute('data-price'));
      }
      if (detailCoverage) {
        detailCoverage.textContent = `${activeCoverage} sq.ft/can`;
      }
      updateHeroImage(paintCategorySelect.value);
      calculateRequirements();
    });
  }

  // Range Slider Drag listener
  if (wallAreaInput && sliderAreaVal) {
    wallAreaInput.addEventListener('input', () => {
      sliderAreaVal.textContent = wallAreaInput.value;
      calculateRequirements();
    });
  }

  function calculateRequirements() {
    if (!wallAreaInput) return;
    const area = parseFloat(wallAreaInput.value);
    
    // Coverage formula:
    // Standard 3.6L can covers activeCoverage sq.ft (for 1 coat)
    // For 2 coats, we need double the paint.
    const cansNeeded = (area / activeCoverage) * 2;
    const litersNeeded = cansNeeded * 3.6;

    // Estimate total cans (rounded up)
    const totalCans = Math.ceil(cansNeeded);
    const costLow = totalCans * activePrice;
    // Add small buffer for tools/wastage for high-end estimate
    const costHigh = Math.round(costLow * 1.15);

    // Update UI elements
    if (outLiters) {
      outLiters.textContent = `${litersNeeded.toFixed(1)} L`;
    }
    if (outCost) {
      outCost.textContent = `₹${costLow.toLocaleString('en-IN')} - ₹${costHigh.toLocaleString('en-IN')}`;
    }
    if (detailCans) {
      detailCans.textContent = `~${totalCans} Can${totalCans > 1 ? 's' : ''} (3.6L each)`;
    }
  }

  // Run initial calculation
  calculateRequirements();

  // ── Animate Chart Bars on Scroll ──
  const barFills = document.querySelectorAll('.bar-fill');
  const chartSection = document.getElementById('cost-distribution');

  function handleChartAnimation() {
    if (!chartSection) return;
    const rect = chartSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Trigger animation when chart enters the viewport
    if (rect.top < viewportHeight * 0.8) {
      barFills.forEach(bar => {
        // Read original style width from markup or set custom width
        const widthVal = bar.style.width;
        // Temporary set width to 0 first (or keep it in stylesheet)
        // Set it back to trigger transition
        bar.style.width = widthVal;
      });
      // Remove scroll listener once animated
      window.removeEventListener('scroll', handleChartAnimation);
    }
  }

  // Pre-set widths to 0 to trigger growth transition on scroll entry
  barFills.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.setAttribute('data-target-width', targetWidth);
    bar.style.width = '0%';
  });

  function restoreChartBars() {
    if (!chartSection) return;
    const rect = chartSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (rect.top < viewportHeight * 0.8) {
      barFills.forEach(bar => {
        const target = bar.getAttribute('data-target-width');
        bar.style.width = target;
      });
    }
  }

  window.addEventListener('scroll', restoreChartBars);
  restoreChartBars(); // Run once in case already visible
});
