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

    // ── Section 03: Values Reveal Scroll Handler ──
    handleValuesReveal();

    // ── Section 04: Choose Reveal Scroll Handler ──
    handleChooseReveal();

    // ── Section 05: Vision Reveal Scroll Handler ──
    handleVisionReveal();
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

  const valueCards = document.querySelectorAll('.value-glass-card');

  function handleValuesReveal() {
    valueCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (cardRect.top < viewportHeight * 0.88) {
        card.classList.add('revealed');
      } else {
        card.classList.remove('revealed');
      }
    });
  }

  const statCards = document.querySelectorAll('.choose-stat-card');
  const featuresWrap = document.querySelector('.choose-features-wrap');

  function handleChooseReveal() {
    const viewportHeight = window.innerHeight;

    statCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.top < viewportHeight * 0.88) {
        card.classList.add('revealed');
        // If it contains a counter element, trigger count-up
        const numEl = card.querySelector('.stat-number');
        if (numEl) {
          animateCountUp(numEl);
        }
      } else {
        card.classList.remove('revealed');
      }
    });

    if (featuresWrap) {
      const rect = featuresWrap.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.9) {
        featuresWrap.classList.add('revealed');
      } else {
        featuresWrap.classList.remove('revealed');
      }
    }
  }

  function animateCountUp(element) {
    if (element.classList.contains('counted')) return;
    element.classList.add('counted');
    
    const target = parseInt(element.getAttribute('data-target'), 10) || 100;
    let count = 0;
    const duration = 1200; // 1.2 seconds count up duration
    const stepTime = Math.max(Math.floor(duration / target), 10);
    
    const timer = setInterval(() => {
      count += 1;
      element.textContent = `${count}%`;
      if (count >= target) {
        element.textContent = `${target}%`;
        clearInterval(timer);
      }
    }, stepTime);
  }

  const visionContent = document.querySelector('.vision-content');
  const visionActions = document.querySelector('.vision-actions');
  const visionQuoteWrap = document.querySelector('.vision-quote-wrap');

  function handleVisionReveal() {
    const viewportHeight = window.innerHeight;

    if (visionContent) {
      const rect = visionContent.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.85) {
        visionContent.classList.add('revealed');
      } else {
        visionContent.classList.remove('revealed');
      }
    }

    if (visionActions) {
      const rect = visionActions.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.85) {
        visionActions.classList.add('revealed');
      } else {
        visionActions.classList.remove('revealed');
      }
    }

    if (visionQuoteWrap) {
      const rect = visionQuoteWrap.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.85) {
        visionQuoteWrap.classList.add('revealed');
      } else {
        visionQuoteWrap.classList.remove('revealed');
      }
    }
  }

  // Initial triggers to position components correctly on load
  handleTimelineScroll();
  handleValuesReveal();
  handleChooseReveal();
  handleVisionReveal();
  window.addEventListener('resize', () => {
    handleTimelineScroll();
    handleValuesReveal();
    handleChooseReveal();
    handleVisionReveal();
  });
});
