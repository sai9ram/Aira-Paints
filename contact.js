/* ============================================================
   CONTACT PAGE — contact.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1) Scroll-reveal for [data-reveal] elements
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index within parent
        const siblings = Array.from(entry.target.parentElement.children).filter(c => c.hasAttribute('data-reveal'));
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 120);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     2) Sticky Contact Bar — show after scrolling past hero
     ---------------------------------------------------------- */
  const stickyBar = document.getElementById('sticky-contact-bar');
  const floatingWA = document.getElementById('floating-whatsapp');
  const heroSection = document.getElementById('contact-hero');

  if (stickyBar && heroSection) {
    const handleScroll = () => {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const scrolled = window.scrollY > heroBottom - 100;

      if (scrolled) {
        stickyBar.classList.add('active');
        if (floatingWA) floatingWA.classList.add('active');
      } else {
        stickyBar.classList.remove('active');
        if (floatingWA) floatingWA.classList.remove('active');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
  }


  /* ----------------------------------------------------------
     3) Contact Form Submission
     ---------------------------------------------------------- */
  const form = document.getElementById('contact-enquiry-form');
  const formSuccess = document.getElementById('form-success');

  if (form && formSuccess) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation passed (HTML5 required handles it)
      // Hide form, show success
      form.style.display = 'none';
      formSuccess.style.display = 'flex';

      // Smooth scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }


  /* ----------------------------------------------------------
     4) Smooth scroll for anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
