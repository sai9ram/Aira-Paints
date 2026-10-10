/* ============================================================
   HAMBURGER NAV — Shared mobile nav logic
   Include on every page (inline <script> or external file)
   ============================================================ */

(function () {
  // ── Hamburger Nav Logic ──
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('mobile-nav-drawer');
  const overlay   = document.getElementById('mobile-nav-overlay');

  if (hamburger && drawer && overlay) {
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

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    const closeBtn = document.getElementById('drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
  }

  // ── Quick Enquiry Modal Injection ──
  const modalHTML = `
    <div id="enquiry-popup-modal" class="modal-overlay" aria-hidden="true" role="dialog" aria-labelledby="enquiry-modal-title">
      <div class="modal-card">
        <button class="modal-close-btn" id="close-enquiry-modal" aria-label="Close modal">&times;</button>
        <div class="modal-header">
          <h3 id="enquiry-modal-title">Quick Enquiry</h3>
          <p>Fill out the form below and our paint specialists will get back to you shortly.</p>
        </div>
        <form id="enquiry-modal-form">
          <div class="enquiry-form-group">
            <label for="enquiry-name">Your Name</label>
            <input type="text" id="enquiry-name" class="enquiry-form-control" required placeholder="e.g. Ramesh Kumar">
          </div>
          <div class="enquiry-form-group">
            <label for="enquiry-phone">Phone Number</label>
            <input type="tel" id="enquiry-phone" class="enquiry-form-control" required placeholder="e.g. +91 98765 43210">
          </div>
          <div class="enquiry-form-group">
            <label for="enquiry-type">Paint Requirement</label>
            <select id="enquiry-type" class="enquiry-form-control">
              <option value="Premium Interior Emulsion">Premium Interior Emulsion</option>
              <option value="Premium Exterior Emulsion">Premium Exterior Emulsion</option>
              <option value="Aira Eco Primer">Aira Eco Primer</option>
              <option value="Essential Exterior Emulsion">Essential Exterior Emulsion</option>
              <option value="Essential Interior Emulsion">Essential Interior Emulsion</option>
              <option value="General Query">Not Sure / Other</option>
            </select>
          </div>
          <div class="enquiry-form-group">
            <label for="enquiry-message">Message (Optional)</label>
            <textarea id="enquiry-message" class="enquiry-form-control" rows="3" placeholder="Tell us more about your project..."></textarea>
          </div>
          <button type="submit" class="enquiry-submit-btn">Send Enquiry</button>
        </form>
      </div>
    </div>
  `;
  
  // Inject modal markup into body
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = modalHTML.trim();
  const modalElement = tempDiv.firstChild;
  document.body.appendChild(modalElement);

  // ── Enquiry Trigger and Form Action Events ──
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    const text = target.textContent.trim().toLowerCase();
    const href = target.getAttribute('href');
    
    // Do NOT hijack navigation links to actual HTML pages, phone calls, mailto, or external links
    if (href && (
      href.includes('.html') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('http://') ||
      href.startsWith('https://')
    )) {
      if (!target.classList.contains('trigger-enquiry') && !target.classList.contains('trigger-dealer')) {
        return;
      }
    }
    
    // Exclude general header menus and bottom navigation links
    const isNavigation = target.closest('.mobile-bottom-nav') || target.closest('#site-header nav') || target.closest('#mobile-nav-drawer');
    if (isNavigation && !target.classList.contains('trigger-enquiry')) {
      return;
    }
    
    const isEnquiryCTA = 
      target.classList.contains('trigger-enquiry') ||
      target.getAttribute('data-modal') === 'enquiry' ||
      href === '#enquiry-popup-modal' ||
      href === '#consultation-modal' ||
      (!isNavigation && (
        text === 'get consultation' ||
        text === 'get free consultation' ||
        text === 'get a quote' ||
        text === 'get quote' ||
        text === 'send enquiry' ||
        text === 'quick enquiry'
      ));
      
    if (isEnquiryCTA) {
      e.preventDefault();
      
      // Auto pre-select category in dropdown if specified
      const category = target.getAttribute('data-category');
      if (category) {
        const typeSelect = document.getElementById('enquiry-type');
        if (typeSelect) {
          const catMap = {
            'interior': 'Premium Interior Emulsion',
            'exterior': 'Premium Exterior Emulsion',
            'primer': 'Aira Eco Primer',
            'waterproofing': 'Essential Exterior Emulsion',
            'luxury': 'Essential Interior Emulsion',
            'essential-interior': 'Essential Interior Emulsion'
          };
          if (catMap[category]) {
            typeSelect.value = catMap[category];
          } else if (Array.from(typeSelect.options).some(o => o.value === category)) {
            typeSelect.value = category;
          }
        }
      }
      
      const modal = document.getElementById('enquiry-popup-modal');
      if (modal) {
        modal.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  // ── Quick Dealer Modal Injection ──
  const dealerModalHTML = `
    <div id="dealer-popup-modal" class="modal-overlay" aria-hidden="true" role="dialog" aria-labelledby="modal-title">
      <div class="modal-card">
        <button class="modal-close-btn" id="close-dealer-modal" aria-label="Close modal">&times;</button>
        
        <div class="modal-header">
          <h3 id="modal-title">Dealer Registration & Partnership Agreement</h3>
          <p>Review the agreement terms and complete your merchant registration</p>
        </div>

        <div class="modal-agreement-box">
          <h4>Aira Paints Authorized Dealer Agreement</h4>
          <p><strong>1. Scope of Exclusivity:</strong> The dealer is authorized to promote and sell Aira Paints products (Economy, Premium, and Luxury series) within their designated city territory.</p>
          <p><strong>2. Suggested Merchant Margins:</strong> Margin models are set dynamically to support growth: Economy Series (18% - 22%), Premium Series (22% - 25%), and Luxury Series (25% - 30%).</p>
          <p><strong>3. Marketing & Support:</strong> Aira Paints agrees to supply retail branding, display racks, and product catalogs. The dealer agrees to allocate display space in-store.</p>
          <p><strong>4. Environmental Quality Policy:</strong> The dealer agrees to represent and advertise Aira Paints as a premium, ultra-low-VOC, eco-friendly product line.</p>
        </div>

        <form class="modal-request-form" id="dealer-modal-form">
          <div class="modal-form-grid">
            <div class="form-group">
              <label for="modal-dealer-name">Full Name</label>
              <input type="text" id="modal-dealer-name" required placeholder="e.g. Ramesh Kumar">
            </div>
            <div class="form-group">
              <label for="modal-dealer-business">Business Name</label>
              <input type="text" id="modal-dealer-business" required placeholder="e.g. Kumar Paints & Hardware">
            </div>
            <div class="form-group">
              <label for="modal-dealer-phone">Phone Number</label>
              <input type="tel" id="modal-dealer-phone" required placeholder="e.g. +91 98765 43210">
            </div>
            <div class="form-group">
              <label for="modal-dealer-city">Location (City & District)</label>
              <input type="text" id="modal-dealer-city" required placeholder="e.g. Mumbai, Maharashtra">
            </div>
          </div>

          <div class="form-agreement-checkbox">
            <input type="checkbox" id="modal-agree-checkbox" required>
            <label for="modal-agree-checkbox">I read, understand, and agree to the partnership agreement terms.</label>
          </div>

          <button type="submit" class="btn btn-primary submit-partner-btn">
            <span>Sign & Submit Application</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  `;
  
  // Inject dealer modal markup into body
  const dealerTempDiv = document.createElement('div');
  dealerTempDiv.innerHTML = dealerModalHTML.trim();
  const dealerModalElement = dealerTempDiv.firstChild;
  document.body.appendChild(dealerModalElement);

  // ── Dealer Trigger Click Events ──
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    const text = target.textContent.trim().toLowerCase();
    
    const isDealerCTA = 
      target.id === 'open-dealer-modal-btn' ||
      text.includes('become a dealer') ||
      text.includes('apply for dealership') ||
      text.includes('become dealer');
      
    if (isDealerCTA) {
      e.preventDefault();
      const modal = document.getElementById('dealer-popup-modal');
      if (modal) {
        modal.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  // ── Global Close and Escape Keyboard Listeners for both modals ──
  document.addEventListener('click', (e) => {
    const enquiryModal = document.getElementById('enquiry-popup-modal');
    const dealerModal = document.getElementById('dealer-popup-modal');
    
    if (enquiryModal) {
      const closeEnquiry = e.target.closest('#close-enquiry-modal');
      if (closeEnquiry || e.target === enquiryModal) {
        enquiryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
    
    if (dealerModal) {
      const closeDealer = e.target.closest('#close-dealer-modal');
      if (closeDealer || e.target === dealerModal) {
        dealerModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const enquiryModal = document.getElementById('enquiry-popup-modal');
      const dealerModal = document.getElementById('dealer-popup-modal');
      
      if (enquiryModal && !enquiryModal.hasAttribute('aria-hidden')) {
        enquiryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (dealerModal && !dealerModal.hasAttribute('aria-hidden')) {
        dealerModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

  // ── Submit Listeners for both forms ──
  document.addEventListener('submit', (e) => {
    const enquiryForm = e.target.closest('#enquiry-modal-form');
    const dealerForm = e.target.closest('#dealer-modal-form');
    
    if (enquiryForm) {
      e.preventDefault();
      alert('Thank you for your enquiry! Our paint specialists will contact you shortly.');
      const modal = document.getElementById('enquiry-popup-modal');
      if (modal) modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      enquiryForm.reset();
    }
    
    if (dealerForm) {
      e.preventDefault();
      alert('Thank you! Your Dealer Registration Request has been submitted successfully.');
      const modal = document.getElementById('dealer-popup-modal');
      if (modal) modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      dealerForm.reset();
    }
  });

  // ── Floating Whatsapp & Call Buttons Injection ──
  const floatingButtonsHTML = `
    <div class="floating-contact-buttons" aria-label="Quick contact links">
      <a href="https://wa.me/918122366191?text=Hello!%20I%20am%20interested%20in%20Aira%20Paints" target="_blank" rel="noopener noreferrer" class="floating-btn float-whatsapp" aria-label="Chat on WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <a href="tel:+918122366191" class="floating-btn float-call" aria-label="Call Us">
        <i class="fa-solid fa-phone"></i>
      </a>
    </div>
  `;
  const floatingTempDiv = document.createElement('div');
  floatingTempDiv.innerHTML = floatingButtonsHTML.trim();
  const floatingElement = floatingTempDiv.firstChild;
  document.body.appendChild(floatingElement);

})();
