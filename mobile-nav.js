/* ============================================================
   HAMBURGER NAV — Shared mobile nav logic
   Include on every page (inline <script> or external file)
   ============================================================ */

(function () {
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('mobile-nav-drawer');
  const overlay   = document.getElementById('mobile-nav-overlay');

  if (!hamburger || !drawer || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on overlay click
  overlay.addEventListener('click', closeMenu);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
  });

  // Close when a drawer link is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();
