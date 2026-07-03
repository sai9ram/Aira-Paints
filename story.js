/* ============================================================
   AIRA PAINTS — OUR STORY PAGE SCROLLYTELLING CONTROLLER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const bodyElement = document.body;
  const heroHeading = document.getElementById('hero-heading');
  const backdropImg = document.getElementById('hero-backdrop-img');
  const header      = document.getElementById('site-header');

  // Simple scroll listener to drive Section 1 parallax & theme interpolations
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight || 800;
    
    // Calculate progress ratio (0 to 1) for the first screen viewport scroll
    const progress = Math.min(scrollY / (winHeight * 0.85), 1);

    // 1. Hero Image Zoom (scale from 1.0 to 1.12)
    if (backdropImg) {
      backdropImg.style.transform = `scale(${1 + (progress * 0.12)})`;
    }

    // 2. Headline fade up (translates up to -50px, fades to 0.1 opacity)
    if (heroHeading) {
      heroHeading.style.transform = `translateY(${progress * -50}px)`;
      heroHeading.style.opacity = 1 - (progress * 0.9);
    }

    // 3. Background and Theme transition
    // Add dark-theme class when scrolled past 20% of first screen
    if (progress > 0.2) {
      bodyElement.classList.add('dark-theme');
    } else {
      bodyElement.classList.remove('dark-theme');
    }

    // Header scrolled class addition
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
});
