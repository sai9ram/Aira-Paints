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



    // Header scrolled class addition
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // ── Section 02: Timeline Scroll Handler ──
    handleTimelineScroll();
  });

  const journeySection = document.getElementById('story-journey');
  const progressBar = document.getElementById('timeline-progress-bar');
  const timelineCards = document.querySelectorAll('.timeline-card');

  function handleTimelineScroll() {
    if (!journeySection || !progressBar) return;

    const rect = journeySection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Start filling when section top enters 80% viewport, finish when section bottom reaches 20% viewport
    const startScroll = rect.top - viewportHeight * 0.8;
    const scrollHeight = rect.height + viewportHeight * 0.6;
    
    let scrollPercent = -startScroll / scrollHeight;
    scrollPercent = Math.max(0, Math.min(scrollPercent, 1));

    // Update progress bar layout dynamically based on viewport layout width
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) {
      progressBar.style.height = `${scrollPercent * 100}%`;
      progressBar.style.width = '100%';
    } else {
      progressBar.style.width = `${scrollPercent * 100}%`;
      progressBar.style.height = '100%';
    }

    // Progressively reveal individual milestone cards on scroll entry
    timelineCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.top < viewportHeight * 0.85) {
        card.classList.add('revealed');
      } else {
        card.classList.remove('revealed');
      }
    });
  }

  // Initial trigger to position components correctly on load
  handleTimelineScroll();
  window.addEventListener('resize', handleTimelineScroll);
});
