import { baseURL } from "@/baseUrl";

export const getAppsSdkCompatibleHtml = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <title>Order RUN MCP Shirt</title>
    <style>
      /* CSS Variables for consistent design tokens */
      :root {
        --color-bg: light-dark(#ffffff, #1a1a1a);
        --color-text: light-dark(#1a1a1a, #ededed);
        --color-text-secondary: light-dark(#666666, #999999);
        --color-border: light-dark(#e0e0e0, rgba(255, 255, 255, 0.1));
        --color-input-bg: light-dark(#f5f5f5, rgba(255, 255, 255, 0.05));
        --color-primary: #afa9ff;
        --color-primary-hover: #c0bbff;
        --color-primary-text: #05080d;
        --color-success-bg: light-dark(rgba(76, 175, 80, 0.1), rgba(126, 255, 126, 0.1));
        --color-success-text: light-dark(#2e7d32, #7eff7e);
        --color-error-bg: light-dark(rgba(244, 67, 54, 0.1), rgba(255, 126, 126, 0.1));
        --color-error-text: light-dark(#c62828, #ff7e7e);
        --color-focus: var(--color-primary);
        
        --spacing-xs: 4px;
        --spacing-sm: 8px;
        --spacing-md: 12px;
        --spacing-lg: 16px;
        --spacing-xl: 24px;
        
        --border-radius: 8px;
        --border-radius-sm: 6px;
        
        --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        --font-size-xs: 12px;
        --font-size-sm: 13px;
        --font-size-base: 14px;
        --font-size-lg: 16px;
        --font-size-xl: 20px;
        
        --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
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
        padding: var(--spacing-lg);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .widget-container {
        max-width: 480px;
        margin: 0 auto;
      }
      
      /* Responsive breakpoints */
      @media (max-width: 480px) {
        body {
          padding: var(--spacing-md);
        }
        
        .widget-container {
          max-width: 100%;
        }
      }
      
      .product-image {
        width: 100%;
        height: auto;
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-lg);
        display: block;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .product-header {
        margin-bottom: var(--spacing-lg);
      }
      
      .product-title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        line-height: 1.3;
      }
      
      .product-subtitle {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 2px var(--spacing-sm);
        background: var(--color-primary);
        color: var(--color-primary-text);
        border-radius: 4px;
        font-size: var(--font-size-xs);
        font-weight: 600;
      }
      
      .form-group {
        margin-bottom: var(--spacing-md);
      }
      
      .form-label {
        display: block;
        font-size: var(--font-size-sm);
        font-weight: 500;
        margin-bottom: var(--spacing-sm);
        color: var(--color-text);
      }
      
      .form-input,
      .form-select,
      .form-textarea {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-input-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm);
        color: var(--color-text);
        font-size: var(--font-size-base);
        font-family: inherit;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      }
      
      .form-textarea {
        resize: vertical;
        min-height: 72px;
      }
      
      /* Accessibility: Focus states */
      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: var(--color-focus);
        box-shadow: 0 0 0 3px rgba(175, 169, 255, 0.1);
      }
      
      .form-input:focus-visible,
      .form-select:focus-visible,
      .form-textarea:focus-visible {
        outline: 2px solid var(--color-focus);
        outline-offset: 2px;
      }
      
      /* Input validation states */
      .form-input:invalid:not(:placeholder-shown),
      .form-textarea:invalid:not(:placeholder-shown) {
        border-color: var(--color-error-text);
      }
      
      .order-btn {
        width: 100%;
        padding: var(--spacing-md) var(--spacing-xl);
        background: var(--color-primary);
        color: var(--color-primary-text);
        border: none;
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-base);
        font-weight: 600;
        cursor: pointer;
        transition: background var(--transition-fast), transform var(--transition-fast);
        margin-top: var(--spacing-lg);
      }
      
      .order-btn:hover:not(:disabled) {
        background: var(--color-primary-hover);
      }
      
      .order-btn:active:not(:disabled) {
        transform: scale(0.98);
      }
      
      .order-btn:focus-visible {
        outline: 2px solid var(--color-focus);
        outline-offset: 2px;
      }
      
      .order-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .order-btn.loading {
        position: relative;
        color: transparent;
      }
      
      .order-btn.loading::after {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
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
        padding: var(--spacing-md);
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-sm);
        display: none;
        animation: fadeIn 0.2s ease-in;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .status-message.success {
        background: var(--color-success-bg);
        color: var(--color-success-text);
        border: 1px solid var(--color-success-text);
        display: block;
      }
      
      .status-message.error {
        background: var(--color-error-bg);
        color: var(--color-error-text);
        border: 1px solid var(--color-error-text);
        display: block;
      }
      
      /* Loading skeleton for image */
      .product-image.loading {
        background: linear-gradient(90deg, 
          var(--color-input-bg) 25%, 
          var(--color-border) 50%, 
          var(--color-input-bg) 75%
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
      <img 
        src="${baseURL}/RUN_MCP.png" 
        alt="RUN MCP Shirt - Front view showing exclusive Apps SDK design" 
        class="product-image"
        id="productImage"
        loading="eager"
      >
      
      <div class="product-header">
        <h1 class="product-title">RUN MCP Shirt</h1>
        <p class="product-subtitle">
          <span class="badge">Apps SDK Exclusive</span>
          <span>Free with setup</span>
        </p>
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
            placeholder="Enter your first name"
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
            placeholder="Enter your last name"
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
            placeholder="your.email@example.com"
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
            placeholder="Your company name"
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
            placeholder="Street address, city, state/province, postal code, country"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          class="order-btn" 
          id="orderBtn"
          aria-label="Place your order for the RUN MCP shirt"
        >
          Place Order
        </button>
      </form>
      
      <div 
        id="statusMessage" 
        class="status-message" 
        role="alert" 
        aria-live="polite"
      ></div>
    </div>
    
    <script>
      // State management and initialization
      const STATE_KEY = 'run_mcp_order_form';
      const form = document.getElementById('orderForm');
      const orderBtn = document.getElementById('orderBtn');
      const statusMessage = document.getElementById('statusMessage');
      const productImage = document.getElementById('productImage');
      
      // Telemetry helper
      function logEvent(eventName, data = {}) {
        console.log('[RUN MCP Widget]', eventName, {
          timestamp: new Date().toISOString(),
          ...data
        });
      }
      
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
        orderBtn.disabled = true;
        orderBtn.classList.add('loading');
        orderBtn.setAttribute('aria-busy', 'true');
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
          statusMessage.textContent = '✓ Order placed successfully! Check the chat for your order details.';
          
          // Clear form and saved state
          form.reset();
          await window.openai?.setWidgetState?.(STATE_KEY, null);
          
          logEvent('order_completed');
          
        } catch (error) {
          logEvent('tool_call_error', { 
            error: error.message,
            stack: error.stack 
          });
          
          // Error state
          statusMessage.className = 'status-message error';
          statusMessage.textContent = \`✗ \${error.message || 'Failed to place order. Please try again or check the chat for details.'}\`;
        } finally {
          // Reset UI state
          orderBtn.disabled = false;
          orderBtn.classList.remove('loading');
          orderBtn.setAttribute('aria-busy', 'false');
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
