import { baseURL } from "@/baseUrl";

export const getAppsSdkCompatibleHtml = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <title>Order RUN MCP Shirt</title>
    <style>
      /* CSS Variables for consistent design tokens - matching mcp.shop design system */
      :root {
        /* Dark theme colors matching globals.css */
        --color-bg: #05080d;
        --color-text: #ededed;
        --color-text-secondary: rgba(255, 255, 255, 0.7);
        --color-text-muted: rgba(255, 255, 255, 0.5);
        --color-border: #404040;
        --color-input-bg: rgba(255, 255, 255, 0.05);
        --color-input-border: rgba(255, 255, 255, 0.1);
        
        /* Red accent color for highlights */
        --color-primary: #ff5f4f;
        --color-primary-hover: #ff7e6f;
        --color-primary-text: #ffffff;
        --color-primary-glow: rgba(255, 95, 79, 0.2);
        
        /* Neutral backgrounds matching the app */
        --color-neutral-950: #0a0a0a;
        --color-neutral-900: #171717;
        --color-neutral-800: #262626;
        --color-neutral-700: #404040;
        
        /* Status colors */
        --color-success-bg: rgba(126, 255, 126, 0.1);
        --color-success-text: #7eff7e;
        --color-success-border: rgba(126, 255, 126, 0.3);
        --color-error-bg: rgba(255, 126, 126, 0.1);
        --color-error-text: #ff7e7e;
        --color-error-border: rgba(255, 126, 126, 0.3);
        
        /* Spacing */
        --spacing-xs: 4px;
        --spacing-sm: 8px;
        --spacing-md: 12px;
        --spacing-lg: 16px;
        --spacing-xl: 24px;
        --spacing-2xl: 32px;
        
        /* Border radius */
        --border-radius: 12px;
        --border-radius-sm: 8px;
        --border-radius-xs: 6px;
        --border-radius-full: 9999px;
        
        /* Typography */
        --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        --font-size-xs: 12px;
        --font-size-sm: 13.8px;
        --font-size-base: 14px;
        --font-size-lg: 16px;
        --font-size-xl: 20px;
        --font-size-2xl: 24px;
        --font-size-3xl: 32px;
        
        /* Transitions */
        --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
        --transition-smooth: 0.55s ease-in-out;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        background: transparent;
        color: var(--color-text);
        font-family: var(--font-family);
        font-size: var(--font-size-base);
        line-height: 1.5;
        padding: 0;
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }
      
      .widget-container {
        width: 100%;
        max-width: 480px;
        height: 100%;
        background: transparent;
        overflow: hidden;
      }
      
      /* Responsive breakpoints */
      @media (max-width: 520px) {
        .product-view-content {
          padding: var(--spacing-md) var(--spacing-md) 0;
        }
        
        .product-info {
          padding: var(--spacing-lg);
        }
        
        .form-view-content {
          padding: var(--spacing-lg);
        }
      }
      
      @media (max-width: 360px) {
        .product-view-content {
          padding: var(--spacing-sm) var(--spacing-sm) 0;
        }
        
        .product-info {
          padding: var(--spacing-md);
        }
        
        .form-view-content {
          padding: var(--spacing-md);
        }
        
        .product-title {
          font-size: var(--font-size-lg);
        }
        
        .form-title {
          font-size: var(--font-size-base);
        }
      }
      
      /* View transitions */
      .view {
        display: none;
        animation: fadeIn 0.3s ease-out;
      }
      
      .view.active {
        display: block;
      }
      
      @keyframes fadeIn {
        from { 
          opacity: 0;
        }
        to { 
          opacity: 1;
        }
      }
      
      /* Product View Styles */
      .product-view-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-width: 480px;
        margin: 0 auto;
        padding: var(--spacing-lg) var(--spacing-lg) 0;
      }
      
      .product-image {
        width: 100%;
        height: auto;
        display: block;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        flex-shrink: 0;
        border-radius: var(--border-radius);
      }
      
      .product-info {
        padding: var(--spacing-xl);
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      
      .product-header {
        margin-bottom: auto;
        flex-grow: 1;
      }
      
      .product-title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        line-height: 1.3;
        letter-spacing: -0.01em;
      }
      
      .product-subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 3px var(--spacing-sm);
        background: linear-gradient(90deg, rgba(255, 95, 79, 0.15) 0%, rgba(254, 180, 123, 0.15) 100%);
        color: var(--color-text);
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-xs);
        font-weight: 500;
      }
      
      .free-label {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
      }
      
      .cta-button {
        width: 100%;
        padding: var(--spacing-md) var(--spacing-lg);
        background: var(--color-primary);
        color: var(--color-primary-text);
        border: none;
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-base);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 2px 8px rgba(255, 95, 79, 0.25);
        letter-spacing: -0.01em;
        margin-top: var(--spacing-md);
      }
      
      .cta-button:hover {
        background: var(--color-primary-hover);
        box-shadow: 0 4px 16px rgba(255, 95, 79, 0.35);
        transform: translateY(-1px);
      }
      
      .cta-button:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(255, 95, 79, 0.3);
      }
      
      /* Form View Styles */
      .form-view-content {
        padding: var(--spacing-xl);
        height: 100%;
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      
      .form-header {
        margin-bottom: var(--spacing-lg);
        text-align: center;
        flex-shrink: 0;
      }
      
      .form-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-bottom: var(--spacing-xs);
        letter-spacing: -0.01em;
      }
      
      .form-subtitle {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }
      
      .form-group {
        margin-bottom: var(--spacing-md);
      }
      
      .form-group:last-of-type {
        margin-bottom: 0;
      }
      
      .form-label {
        display: block;
        font-size: var(--font-size-sm);
        font-weight: 500;
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
        letter-spacing: -0.01em;
      }
      
      .form-input,
      .form-select,
      .form-textarea {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-xs);
        color: var(--color-text);
        font-size: var(--font-size-sm);
        font-family: inherit;
        transition: all var(--transition-fast);
      }
      
      .form-textarea {
        resize: vertical;
        min-height: 72px;
        line-height: 1.5;
      }
      
      /* Accessibility: Focus states */
      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        background: rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 0 2px var(--color-primary-glow);
      }
      
      .form-input:focus-visible,
      .form-select:focus-visible,
      .form-textarea:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      
      /* Hover states */
      .form-input:hover:not(:focus),
      .form-select:hover:not(:focus),
      .form-textarea:hover:not(:focus) {
        border-color: var(--color-neutral-700);
        background: rgba(0, 0, 0, 0.35);
      }
      
      /* Placeholder styling */
      .form-input::placeholder,
      .form-textarea::placeholder {
        color: var(--color-text-muted);
        opacity: 1;
      }
      
      /* Select dropdown styling */
      .form-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23ededed' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right var(--spacing-md) center;
        padding-right: var(--spacing-2xl);
      }
      
      /* Input validation states */
      .form-input:invalid:not(:placeholder-shown),
      .form-textarea:invalid:not(:placeholder-shown) {
        border-color: var(--color-error-text);
      }
      
      /* Button Styles */
      .form-actions {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-lg);
        flex-shrink: 0;
      }
      
      .back-btn {
        padding: var(--spacing-sm) var(--spacing-lg);
        background: rgba(0, 0, 0, 0.3);
        color: var(--color-text-secondary);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-xs);
        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        letter-spacing: -0.01em;
      }
      
      .back-btn:hover {
        color: var(--color-text);
        border-color: var(--color-text-secondary);
        background: rgba(255, 255, 255, 0.05);
      }
      
      .submit-btn {
        flex: 1;
        padding: var(--spacing-sm) var(--spacing-lg);
        background: var(--color-primary);
        color: var(--color-primary-text);
        border: none;
        border-radius: var(--border-radius-xs);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 2px 8px rgba(255, 95, 79, 0.25);
        letter-spacing: -0.01em;
      }
      
      .submit-btn:hover:not(:disabled) {
        background: var(--color-primary-hover);
        box-shadow: 0 4px 12px rgba(255, 95, 79, 0.35);
        transform: translateY(-1px);
      }
      
      .submit-btn:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(255, 95, 79, 0.3);
      }
      
      .submit-btn:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      
      .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }
      
      .submit-btn.loading {
        position: relative;
        color: transparent;
      }
      
      .submit-btn.loading::after {
        content: "";
        position: absolute;
        width: 14px;
        height: 14px;
        top: 50%;
        left: 50%;
        margin-left: -7px;
        margin-top: -7px;
        border: 2px solid var(--color-primary-text);
        border-radius: 50%;
        border-top-color: transparent;
        animation: spinner 0.6s linear infinite;
      }
      
      @keyframes spinner {
        to { transform: rotate(360deg); }
      }
      
      .status-message {
        margin-top: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius-xs);
        font-size: var(--font-size-xs);
        display: none;
        font-weight: 500;
        text-align: center;
      }
      
      .status-message.success {
        background: var(--color-success-bg);
        color: var(--color-success-text);
        border: 1px solid var(--color-success-border);
        display: block;
      }
      
      .status-message.error {
        background: var(--color-error-bg);
        color: var(--color-error-text);
        border: 1px solid var(--color-error-border);
        display: block;
      }
      
      /* Loading skeleton for image */
      .product-image.loading {
        background: linear-gradient(90deg, 
          var(--color-neutral-900) 25%, 
          var(--color-neutral-800) 50%, 
          var(--color-neutral-900) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        min-height: 300px;
      }
      
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Accessibility: Reduced motion preference */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="widget-container">
      <!-- Product View -->
      <div id="productView" class="view active">
        <div class="product-view-content">
          <img 
            src="${baseURL}/RUN_MCP.png" 
            alt="RUN MCP Shirt - Front view showing exclusive Apps SDK design" 
            class="product-image"
            id="productImage"
            loading="eager"
          >
          
          <div class="product-info">
            <div class="product-header">
              <h1 class="product-title">RUN MCP Shirt</h1>
              <div class="product-subtitle">
                <span class="badge">Apps SDK Exclusive</span>
                <span class="free-label">Free with setup</span>
              </div>
            </div>
            
            <button 
              type="button"
              class="cta-button" 
              id="orderNowBtn"
              aria-label="Order the RUN MCP shirt"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
      
      <!-- Form View -->
      <div id="formView" class="view">
        <div class="form-view-content">
          <div class="form-header">
            <h2 class="form-title">Complete Your Order</h2>
            <p class="form-subtitle">Fill in your details below</p>
          </div>
          
          <form id="orderForm" novalidate>
            <div class="form-group">
              <label class="form-label" for="size">Size *</label>
              <select id="size" name="size" class="form-select" required aria-required="true">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M" selected>M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
                <option value="3XL">3XL</option>
              </select>
            </div>
          
            <div class="form-group">
              <label class="form-label" for="firstName">First Name *</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName"
                class="form-input" 
                required 
                aria-required="true"
                autocomplete="given-name"
                placeholder="John"
              >
            </div>
          
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name *</label>
              <input 
                type="text" 
                id="lastName"
                name="lastName" 
                class="form-input" 
                required 
                aria-required="true"
                autocomplete="family-name"
                placeholder="Doe"
              >
            </div>
          
            <div class="form-group">
              <label class="form-label" for="email">Email *</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                class="form-input" 
                required 
                aria-required="true"
                autocomplete="email"
                placeholder="john@example.com"
              >
            </div>
          
            <div class="form-group">
              <label class="form-label" for="company">Company *</label>
              <input 
                type="text" 
                id="company"
                name="company" 
                class="form-input" 
                required 
                aria-required="true"
                autocomplete="organization"
                placeholder="Acme Inc."
              >
            </div>
          
            <div class="form-group">
              <label class="form-label" for="mailingAddress">Mailing Address *</label>
              <textarea 
                id="mailingAddress"
                name="mailingAddress" 
                class="form-textarea" 
                required 
                aria-required="true"
                autocomplete="street-address"
                placeholder="123 Main St, City, State ZIP, Country"
              ></textarea>
            </div>
            
            <div 
              id="statusMessage" 
              class="status-message" 
              role="alert" 
              aria-live="polite"
            ></div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="back-btn" 
                id="backBtn"
                aria-label="Go back to product view"
              >
                Back
              </button>
              <button 
                type="submit" 
                class="submit-btn" 
                id="submitBtn"
                aria-label="Submit your order"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <script>
      // State management and initialization
      const STATE_KEY = 'run_mcp_order_form';
      const productView = document.getElementById('productView');
      const formView = document.getElementById('formView');
      const orderNowBtn = document.getElementById('orderNowBtn');
      const backBtn = document.getElementById('backBtn');
      const form = document.getElementById('orderForm');
      const submitBtn = document.getElementById('submitBtn');
      const statusMessage = document.getElementById('statusMessage');
      const productImage = document.getElementById('productImage');
      
      // View management
      function showView(viewToShow) {
        document.querySelectorAll('.view').forEach(view => {
          view.classList.remove('active');
        });
        viewToShow.classList.add('active');
      }
      
      // Telemetry helper
      function logEvent(eventName, data = {}) {
        console.log('[RUN MCP Widget]', eventName, {
          timestamp: new Date().toISOString(),
          ...data
        });
      }
      
      // Navigate to form view
      orderNowBtn.addEventListener('click', () => {
        logEvent('order_now_clicked');
        showView(formView);
      });
      
      // Navigate back to product view
      backBtn.addEventListener('click', () => {
        logEvent('back_clicked');
        showView(productView);
        // Clear status message when going back
        statusMessage.className = 'status-message';
        statusMessage.style.display = 'none';
      });
      
      // Initialize component
      async function initialize() {
        logEvent('component_loaded');
        
        // Load initial state from window.openai.toolOutput if available
        try {
          const toolOutput = await window.openai?.toolOutput;
          if (toolOutput?.structuredContent) {
            logEvent('initial_state_loaded', { hasStructuredContent: true });
          }
        } catch (error) {
          logEvent('initial_state_error', { error: error.message });
        }
        
        // Restore form state from widget state
        try {
          const savedState = await window.openai?.getWidgetState?.(STATE_KEY);
          if (savedState) {
            restoreFormState(savedState);
            logEvent('form_state_restored');
          }
        } catch (error) {
          logEvent('state_restore_error', { error: error.message });
        }
      }
      
      // Save form state
      async function saveFormState() {
        const state = {
          size: document.getElementById('size').value,
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          company: document.getElementById('company').value,
          mailingAddress: document.getElementById('mailingAddress').value,
          timestamp: Date.now()
        };
        
        try {
          await window.openai?.setWidgetState?.(STATE_KEY, state);
          logEvent('form_state_saved');
        } catch (error) {
          logEvent('state_save_error', { error: error.message });
        }
      }
      
      // Restore form state
      function restoreFormState(state) {
        if (!state) return;
        
        Object.keys(state).forEach(key => {
          const input = document.getElementById(key);
          if (input && state[key]) {
            input.value = state[key];
          }
        });
      }
      
      // Auto-save form state on input
      form.addEventListener('input', debounce(saveFormState, 500));
      
      // Debounce helper
      function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }
      
      // Image error handling
      productImage.addEventListener('error', () => {
        logEvent('image_load_error');
        productImage.alt = 'RUN MCP Shirt (image unavailable)';
        productImage.style.display = 'none';
      });
      
      productImage.addEventListener('load', () => {
        logEvent('image_loaded');
      });
      
      // Form submission
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        logEvent('form_submit_started');
        
        // Validate form
        if (!form.checkValidity()) {
          logEvent('form_validation_failed');
          form.reportValidity();
          return;
        }
        
        // UI state: loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.setAttribute('aria-busy', 'true');
        backBtn.disabled = true;
        statusMessage.className = 'status-message';
        statusMessage.style.display = 'none';
        
        try {
          const formData = {
            size: document.getElementById('size').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            mailingAddress: document.getElementById('mailingAddress').value,
            specialCode: 'RUN_MCP_2025', // Automatically include for widget orders
          };
          
          logEvent('tool_call_started', { size: formData.size });
          
          // Call the order_shirt tool
          const result = await window.openai?.callTool('order_shirt', formData);
          
          logEvent('tool_call_success', { result });
          
          // Success state
          statusMessage.className = 'status-message success';
          statusMessage.textContent = '✓ Order placed! Check chat for details.';
          
          // Clear form and saved state
          form.reset();
          await window.openai?.setWidgetState?.(STATE_KEY, null);
          
          logEvent('order_completed');
          
          // Return to product view after short delay
          setTimeout(() => {
            showView(productView);
            statusMessage.className = 'status-message';
          }, 2000);
          
        } catch (error) {
          logEvent('tool_call_error', { 
            error: error.message,
            stack: error.stack 
          });
          
          // Error state
          statusMessage.className = 'status-message error';
          statusMessage.textContent = \`✗ \${error.message || 'Failed to place order. Please try again.'}\`;
        } finally {
          // Reset UI state
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.setAttribute('aria-busy', 'false');
          backBtn.disabled = false;
        }
      });
      
      // Initialize on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
      } else {
        initialize();
      }
    </script>
  </body>
  </html>
    `;
};
