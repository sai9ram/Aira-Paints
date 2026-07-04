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

  // ── Color Swatches & Background Transitions ──
  const heroSection = document.getElementById('product-hero');
  const bucketImg = document.getElementById('hero-bucket-img');
  const glowBg = document.getElementById('hero-glow-bg');
  const canGlow = document.getElementById('hero-can-glow');
  const swatchButtons = document.querySelectorAll('.color-swatch-btn');

  swatchButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active states
      swatchButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Extract details
      const color = btn.getAttribute('data-color');
      const imgPath = btn.getAttribute('data-image');
      const glowColor = btn.getAttribute('data-glow');

      // Apply transition animations
      if (heroSection) {
        heroSection.style.backgroundColor = color;
      }
      if (bucketImg) {
        bucketImg.style.transform = 'scale(0.85) rotate(-15deg)';
        bucketImg.style.opacity = '0.3';
        bucketImg.style.filter = 'blur(10px)';
        
        setTimeout(() => {
          bucketImg.src = imgPath;
          bucketImg.style.transform = 'scale(1) rotate(0deg)';
          bucketImg.style.opacity = '1';
          bucketImg.style.filter = 'drop-shadow(0 25px 45px rgba(0, 0, 0, 0.35))';
        }, 300);
      }
      if (canGlow) {
        canGlow.style.setProperty('--glow-color', glowColor);
      }
    });
  });

  // ── Slow Rotate Paint Bucket on Scroll ──
  window.addEventListener('scroll', () => {
    if (!bucketImg) return;
    const rotation = window.scrollY * 0.08; // 0.08 degrees per pixel scrolled
    // Base transform rotation
    bucketImg.style.transform = `rotate(${rotation}deg)`;
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
      const activeSwatch = document.querySelector('.color-swatch-btn.active');
      const tint = activeSwatch ? activeSwatch.getAttribute('data-glow') : 'rgba(255, 255, 255, 0.22)';
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

  // ── Splashes Parallax Effect on Mouse Move ──
  const splashes = document.querySelectorAll('.floating-splash');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
      const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

      splashes.forEach((splash, idx) => {
        const factor = (idx + 1) * 20; // Different depth weights
        const moveX = xPercent * factor;
        const moveY = yPercent * factor;
        splash.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }
});
