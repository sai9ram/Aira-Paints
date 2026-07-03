document.addEventListener('DOMContentLoaded', () => {
  const body = document.getElementById('story-body');
  const heroImg = document.getElementById('hero-zoom-img');
  const floatingCan = document.getElementById('floating-can');
  const sec1 = document.getElementById('story-sec-1');

  // Scroll listener for smooth translations & zoom
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const heroHeight = sec1 ? sec1.offsetHeight : window.innerHeight;

    // 1. Zoom hero image slightly on scroll (up to 1.18x)
    if (heroImg && scrollPos < heroHeight) {
      const zoom = 1 + (scrollPos / heroHeight) * 0.18;
      heroImg.style.transform = `scale(${zoom})`;
    }

    // 2. Rotate floating paint bucket
    if (floatingCan && scrollPos < heroHeight) {
      const rotation = (scrollPos / heroHeight) * 55; // rotate up to 55 deg
      floatingCan.style.transform = `rotate(${rotation}deg)`;
    }

    // 3. Shift background from light cream to deep green
    // Toggles the class when user scrolls past 30% of the first section
    if (scrollPos > heroHeight * 0.3) {
      body.classList.add('bg-deep-green');
    } else {
      body.classList.remove('bg-deep-green');
    }
  });

  // Fade-in scrollytelling elements using IntersectionObserver
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Track scroll sections and reveal text/visual blocks
  const revealElements = document.querySelectorAll('.story-grid-text, .story-grid-visual');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)';
    observer.observe(el);
  });
});
