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
});
