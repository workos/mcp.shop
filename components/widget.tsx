import { baseURL } from "@/baseUrl";

export const getAppsSdkCompatibleHtml = (userData?: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) => {
  // Safely encode user data for JavaScript
  const encodedUserData = userData
    ? JSON.stringify(userData).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    : 'null';
  
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
        .product-info {
          padding: var(--spacing-lg);
        }
        
        .form-view-content {
          padding: var(--spacing-lg);
        }
      }
      
      @media (max-width: 360px) {
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
        animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .view.active {
        display: block;
      }
      
      .view.slide-out-left {
        animation: slideOutLeft 0.4s cubic-bezier(0.4, 0, 0.6, 1) forwards;
      }
      
      .view.slide-in-right {
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      @keyframes fadeIn {
        from { 
          opacity: 0;
          transform: translateY(8px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideOutLeft {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(-20px);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
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
        display: flex;
        flex-direction: column;
      }
      
      .product-header {
        margin-bottom: var(--spacing-lg);
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
        margin-top: 0;
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
      
      .form-step {
        display: none;
      }
      
      .form-step.active {
        display: block;
      }
      
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-sm);
      }
      
      @media (max-width: 360px) {
        .form-row {
          grid-template-columns: 1fr;
        }
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
      
      /* Pulse animation on submit button when on step 2 */
      .submit-btn:not(:disabled):not(.loading) {
        animation: subtlePulse 2s ease-in-out infinite;
      }
      
      @keyframes subtlePulse {
        0%, 100% {
          box-shadow: 0 2px 8px rgba(255, 95, 79, 0.25);
        }
        50% {
          box-shadow: 0 2px 12px rgba(255, 95, 79, 0.4);
        }
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
      
      /* Success View Styles */
      .success-view-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--spacing-2xl);
        height: 100%;
        max-width: 480px;
        margin: 0 auto;
      }
      
      .success-icon {
        width: 80px;
        height: 80px;
        margin-bottom: var(--spacing-xl);
        animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .success-icon svg {
        width: 100%;
        height: 100%;
      }
      
      .success-checkmark {
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        animation: drawCheck 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
      }
      
      .success-circle {
        stroke-dasharray: 260;
        stroke-dashoffset: 260;
        animation: drawCircle 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      @keyframes successPop {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes drawCircle {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes drawCheck {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      .success-title {
        font-size: var(--font-size-2xl);
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        letter-spacing: -0.02em;
        animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s backwards;
      }
      
      .success-message {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-xl);
        line-height: 1.6;
        animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.5s backwards;
      }
      
      .success-details {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-sm);
        padding: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
        width: 100%;
        animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.6s backwards;
      }
      
      .success-detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) 0;
        font-size: var(--font-size-sm);
      }
      
      .success-detail-row:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .success-detail-label {
        color: var(--color-text-muted);
      }
      
      .success-detail-value {
        color: var(--color-text);
        font-weight: 500;
      }
      
      .success-actions {
        display: flex;
        gap: var(--spacing-sm);
        width: 100%;
        animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.7s backwards;
      }
      
      .success-button {
        flex: 1;
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
      }
      
      .success-button:hover {
        background: var(--color-primary-hover);
        box-shadow: 0 4px 16px rgba(255, 95, 79, 0.35);
        transform: translateY(-1px);
      }
      
      .success-button:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(255, 95, 79, 0.3);
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
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
            <h2 class="form-title" id="formTitle">Your Information</h2>
            <p class="form-subtitle" id="formSubtitle">Step 1 of 2</p>
          </div>
          
          <form id="orderForm" novalidate>
            <!-- Step 1: Basic Info -->
            <div id="step1" class="form-step active">
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
              
              <div class="form-row">
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
                <label class="form-label" for="phone">Phone *</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone" 
                  class="form-input" 
                  required 
                  aria-required="true"
                  autocomplete="tel"
                  placeholder="+1 (555) 123-4567"
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
            </div>
            
            <!-- Step 2: Address -->
            <div id="step2" class="form-step">
              <div class="form-group">
                <label class="form-label" for="streetAddress1">Street Address *</label>
                <input 
                  type="text" 
                  id="streetAddress1"
                  name="streetAddress1" 
                  class="form-input" 
                  required 
                  aria-required="true"
                  autocomplete="address-line1"
                  placeholder="123 Main Street"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="streetAddress2">Apt, Suite, etc. (Optional)</label>
                <input 
                  type="text" 
                  id="streetAddress2"
                  name="streetAddress2" 
                  class="form-input" 
                  autocomplete="address-line2"
                  placeholder="Apartment 4B"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="city">City *</label>
                <input 
                  type="text" 
                  id="city"
                  name="city" 
                  class="form-input" 
                  required 
                  aria-required="true"
                  autocomplete="address-level2"
                  placeholder="San Francisco"
                >
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="state">State *</label>
                  <input 
                    type="text" 
                    id="state"
                    name="state" 
                    class="form-input" 
                    required 
                    aria-required="true"
                    autocomplete="address-level1"
                    placeholder="CA"
                    maxlength="2"
                    pattern="[A-Z]{2}"
                    style="text-transform: uppercase;"
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="zip">ZIP Code *</label>
                  <input 
                    type="text" 
                    id="zip"
                    name="zip" 
                    class="form-input" 
                    required 
                    aria-required="true"
                    autocomplete="postal-code"
                    placeholder="94102"
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="country">Country Code *</label>
                <input 
                  type="text" 
                  id="country"
                  name="country" 
                  class="form-input" 
                  required 
                  aria-required="true"
                  autocomplete="country"
                  placeholder="US"
                  maxlength="2"
                  pattern="[A-Z]{2}"
                  style="text-transform: uppercase;"
                >
              </div>
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
                aria-label="Go back"
              >
                Back
              </button>
              <button 
                type="button" 
                class="submit-btn" 
                id="nextBtn"
                aria-label="Continue to next step"
              >
                Continue
              </button>
              <button 
                type="submit" 
                class="submit-btn" 
                id="submitBtn"
                aria-label="Submit your order"
                style="display: none;"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Success View -->
      <div id="successView" class="view">
        <div class="success-view-content">
          <div class="success-icon">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle 
                class="success-circle"
                cx="40" 
                cy="40" 
                r="36" 
                stroke="var(--color-success-text)" 
                stroke-width="4"
                fill="none"
              />
              <path 
                class="success-checkmark"
                d="M20 40 L32 52 L60 24" 
                stroke="var(--color-success-text)" 
                stroke-width="4" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
          </div>
          
          <h2 class="success-title">Order Placed Successfully!</h2>
          <p class="success-message">
            Your RUN MCP shirt is on its way. We'll send you an email confirmation shortly.
          </p>
          
          <div class="success-details" id="successDetails">
            <!-- Details will be populated by JavaScript -->
          </div>
          
          <div class="success-actions">
            <button 
              type="button" 
              class="success-button" 
              id="doneBtn"
              aria-label="Return to products"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <script>
      // Enhanced logging with namespace
      const LOG_PREFIX = '[RUN MCP Widget]';
      const DEBUG = false; // Set to true for verbose logging
      
      function log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logData = { timestamp, ...data };
        
        try {
          if (level === 'error') {
            console.error(LOG_PREFIX, message, logData);
          } else if (level === 'warn') {
            console.warn(LOG_PREFIX, message, logData);
          } else if (DEBUG || level === 'info') {
            console.log(LOG_PREFIX, message, logData);
          }
        } catch (e) {
          // Failsafe if logging itself fails
          console.error(LOG_PREFIX, 'Logging failed', e);
        }
      }
      
      // State management and initialization
      const STATE_KEY = 'run_mcp_order_form';
      
      // Safe element getters with error handling
      function getElement(id, required = true) {
        try {
          const element = document.getElementById(id);
          if (!element && required) {
            log('error', \`Required element not found: \${id}\`);
          }
          return element;
        } catch (e) {
          log('error', \`Error getting element: \${id}\`, { error: e.message });
          return null;
        }
      }
      
      const productView = getElement('productView');
      const formView = getElement('formView');
      const successView = getElement('successView');
      const orderNowBtn = getElement('orderNowBtn');
      const backBtn = getElement('backBtn');
      const nextBtn = getElement('nextBtn');
      const doneBtn = getElement('doneBtn');
      const form = getElement('orderForm');
      const submitBtn = getElement('submitBtn');
      const statusMessage = getElement('statusMessage');
      const productImage = getElement('productImage');
      const formTitle = getElement('formTitle');
      const formSubtitle = getElement('formSubtitle');
      const step1 = getElement('step1');
      const step2 = getElement('step2');
      const successDetails = getElement('successDetails');
      
      // Prefilled user data from auth with fallback
      let prefilledUserData = null;
      try {
        prefilledUserData = ${encodedUserData};
        if (prefilledUserData) {
          log('info', 'User data prefilled', { 
            hasFirstName: !!prefilledUserData.firstName,
            hasLastName: !!prefilledUserData.lastName,
            hasEmail: !!prefilledUserData.email
          });
        }
      } catch (e) {
        log('error', 'Failed to parse prefilled user data', { error: e.message });
        prefilledUserData = null;
      }
      
      let currentStep = 1;
      let currentView = productView;
      
      // View management with animations and error handling
      function showView(viewToShow, useAnimation = true) {
        if (!viewToShow) {
          log('error', 'showView called with null/undefined view');
          return;
        }
        
        if (currentView === viewToShow) {
          log('debug', 'View already active, skipping transition');
          return;
        }
        
        try {
          if (useAnimation && currentView) {
            // Animate out current view
            currentView.classList.add('slide-out-left');
            
            setTimeout(() => {
              try {
                // Hide all views
                document.querySelectorAll('.view').forEach(view => {
                  view.classList.remove('active', 'slide-out-left', 'slide-in-right');
                });
                
                // Show and animate in new view
                if (viewToShow) {
                  viewToShow.classList.add('active', 'slide-in-right');
                  currentView = viewToShow;
                  
                  // Clean up animation classes after animation completes
                  setTimeout(() => {
                    if (viewToShow) {
                      viewToShow.classList.remove('slide-in-right');
                    }
                  }, 400);
                }
              } catch (e) {
                log('error', 'Animation cleanup failed', { error: e.message });
              }
            }, 400);
          } else {
            // No animation - instant switch
            document.querySelectorAll('.view').forEach(view => {
              view.classList.remove('active');
            });
            viewToShow.classList.add('active');
            currentView = viewToShow;
          }
          
          log('debug', 'View transition completed', { viewId: viewToShow.id });
        } catch (e) {
          log('error', 'showView failed', { error: e.message });
          // Fallback: try direct view switch without animation
          try {
            document.querySelectorAll('.view').forEach(view => {
              view.classList.remove('active');
            });
            viewToShow.classList.add('active');
            currentView = viewToShow;
          } catch (fallbackError) {
            log('error', 'Fallback view switch failed', { error: fallbackError.message });
          }
        }
      }
      
      // Step management with error handling
      function showStep(stepNumber) {
        if (!step1 || !step2 || !formTitle || !formSubtitle || !nextBtn || !submitBtn) {
          log('error', 'Missing form elements in showStep');
          return;
        }
        
        try {
          currentStep = stepNumber;
          
          // Update step visibility
          step1.classList.remove('active');
          step2.classList.remove('active');
          
          if (stepNumber === 1) {
            step1.classList.add('active');
            formTitle.textContent = 'Your Information';
            formSubtitle.textContent = 'Step 1 of 2';
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
          } else if (stepNumber === 2) {
            step2.classList.add('active');
            formTitle.textContent = 'Shipping Address';
            formSubtitle.textContent = 'Step 2 of 2';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
          }
          
          log('debug', 'Step changed', { step: stepNumber });
        } catch (e) {
          log('error', 'showStep failed', { step: stepNumber, error: e.message });
        }
      }
      
      // Validate current step fields with error handling
      function validateCurrentStep() {
        try {
          const currentStepElement = currentStep === 1 ? step1 : step2;
          if (!currentStepElement) {
            log('error', 'Current step element not found');
            return false;
          }
          
          const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
          
          let isValid = true;
          inputs.forEach(input => {
            try {
              if (!input.checkValidity()) {
                isValid = false;
                input.reportValidity();
              }
            } catch (e) {
              log('error', 'Validation failed for input', { id: input.id, error: e.message });
              isValid = false;
            }
          });
          
          return isValid;
        } catch (e) {
          log('error', 'validateCurrentStep failed', { error: e.message });
          return false;
        }
      }
      
      // Navigate to form view with error handling
      if (orderNowBtn) {
        orderNowBtn.addEventListener('click', () => {
          try {
            log('info', 'Order Now clicked');
            if (formView) {
              showView(formView);
              showStep(1);
            } else {
              log('error', 'Form view not found');
            }
          } catch (e) {
            log('error', 'Order Now handler failed', { error: e.message });
          }
        });
      } else {
        log('error', 'Order Now button not found');
      }
      
      // Navigate back button with error handling
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          try {
            log('info', 'Back clicked');
            
            if (currentStep === 1) {
              // Go back to product view
              if (productView) {
                showView(productView);
                if (statusMessage) {
                  statusMessage.className = 'status-message';
                  statusMessage.style.display = 'none';
                }
              }
            } else {
              // Go back to previous step
              showStep(currentStep - 1);
            }
          } catch (e) {
            log('error', 'Back button handler failed', { error: e.message });
          }
        });
      } else {
        log('error', 'Back button not found');
      }
      
      // Next button - go to next step with error handling
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          try {
            if (validateCurrentStep()) {
              showStep(currentStep + 1);
              saveFormState();
            }
          } catch (e) {
            log('error', 'Next button handler failed', { error: e.message });
          }
        });
      } else {
        log('error', 'Next button not found');
      }
      
      // Done button - return to product view with error handling
      if (doneBtn) {
        doneBtn.addEventListener('click', () => {
          try {
            log('info', 'Done clicked');
            if (productView) {
              showView(productView);
              // Reset to step 1 for next order
              showStep(1);
            }
          } catch (e) {
            log('error', 'Done button handler failed', { error: e.message });
          }
        });
      } else {
        log('error', 'Done button not found');
      }
      
      // Initialize component with comprehensive error handling
      async function initialize() {
        log('info', 'Widget initializing');
        
        try {
          // Prefill form with user data from auth if available
          if (prefilledUserData) {
            try {
              const firstNameInput = getElement('firstName', false);
              const lastNameInput = getElement('lastName', false);
              const emailInput = getElement('email', false);
              
              if (prefilledUserData.firstName && firstNameInput) {
                firstNameInput.value = prefilledUserData.firstName;
              }
              if (prefilledUserData.lastName && lastNameInput) {
                lastNameInput.value = prefilledUserData.lastName;
              }
              if (prefilledUserData.email && emailInput) {
                emailInput.value = prefilledUserData.email;
              }
              
              log('info', 'User data prefilled successfully');
            } catch (e) {
              log('error', 'Failed to prefill user data', { error: e.message });
            }
          }
          
          // Load initial state from window.openai.toolOutput if available
          try {
            if (typeof window !== 'undefined' && window.openai) {
              const toolOutput = await window.openai.toolOutput;
              if (toolOutput?.structuredContent) {
                log('debug', 'Tool output loaded', { hasStructuredContent: true });
              }
            }
          } catch (error) {
            log('warn', 'Could not load tool output', { error: error?.message || 'Unknown error' });
          }
          
          // Restore form state from widget state (but don't override prefilled data)
          try {
            if (typeof window !== 'undefined' && window.openai?.getWidgetState) {
              const savedState = await window.openai.getWidgetState(STATE_KEY);
              if (savedState) {
                // Only restore fields that aren't already prefilled
                const stateToRestore = { ...savedState };
                if (prefilledUserData?.firstName) delete stateToRestore.firstName;
                if (prefilledUserData?.lastName) delete stateToRestore.lastName;
                if (prefilledUserData?.email) delete stateToRestore.email;
                
                restoreFormState(stateToRestore);
                log('info', 'Form state restored');
              }
            }
          } catch (error) {
            log('warn', 'Could not restore form state', { error: error?.message || 'Unknown error' });
          }
          
          log('info', 'Widget initialization complete');
        } catch (e) {
          log('error', 'Widget initialization failed', { error: e.message });
        }
      }
      
      // Save form state with error handling
      async function saveFormState() {
        try {
          if (typeof window === 'undefined' || !window.openai?.setWidgetState) {
            log('debug', 'Widget state API not available');
            return;
          }
          
          const state = {};
          const fieldIds = ['size', 'firstName', 'lastName', 'company', 'phone', 'email', 
                           'streetAddress1', 'streetAddress2', 'city', 'state', 'zip', 'country'];
          
          fieldIds.forEach(id => {
            try {
              const element = document.getElementById(id);
              if (element && element.value) {
                state[id] = element.value;
              }
            } catch (e) {
              log('warn', \`Could not save field: \${id}\`, { error: e.message });
            }
          });
          
          state.timestamp = Date.now();
          
          await window.openai.setWidgetState(STATE_KEY, state);
          log('debug', 'Form state saved');
        } catch (error) {
          log('warn', 'Could not save form state', { error: error?.message || 'Unknown error' });
        }
      }
      
      // Restore form state with error handling
      function restoreFormState(state) {
        if (!state) return;
        
        try {
          Object.keys(state).forEach(key => {
            try {
              const input = document.getElementById(key);
              if (input && state[key]) {
                input.value = state[key];
              }
            } catch (e) {
              log('warn', \`Could not restore field: \${key}\`, { error: e.message });
            }
          });
        } catch (e) {
          log('error', 'Form state restoration failed', { error: e.message });
        }
      }
      
      // Auto-save form state on input with error handling
      if (form) {
        form.addEventListener('input', debounce(saveFormState, 500));
      }
      
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
      
      // Image error handling with fallback
      if (productImage) {
        productImage.addEventListener('error', () => {
          log('warn', 'Product image failed to load');
          try {
            productImage.alt = 'RUN MCP Shirt (image unavailable)';
            productImage.style.display = 'none';
          } catch (e) {
            log('error', 'Image error handler failed', { error: e.message });
          }
        });
        
        productImage.addEventListener('load', () => {
          log('debug', 'Product image loaded successfully');
        });
      } else {
        log('warn', 'Product image element not found');
      }
      
      // Show success view with order details
      function showSuccessView(orderData) {
        // Populate success details
        const detailsHTML = \`
          <div class="success-detail-row">
            <span class="success-detail-label">Order ID</span>
            <span class="success-detail-value">\${orderData.orderId || 'Pending'}</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">Product</span>
            <span class="success-detail-value">RUN MCP Shirt</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">Size</span>
            <span class="success-detail-value">\${orderData.size}</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">Email</span>
            <span class="success-detail-value">\${orderData.email}</span>
          </div>
        \`;
        
        successDetails.innerHTML = detailsHTML;
        
        // Show success view with animation
        showView(successView);
      }
      
      // Form submission with comprehensive error handling
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          log('info', 'Form submission started');
          
          try {
            // Validate form
            if (!form.checkValidity()) {
              log('warn', 'Form validation failed');
              form.reportValidity();
              return;
            }
            
            // Check if required elements exist
            if (!submitBtn || !backBtn || !statusMessage) {
              log('error', 'Required form elements missing');
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
              // Collect form data with safe element access
              const formData = {
                size: getElement('size', false)?.value || 'M',
                firstName: getElement('firstName', false)?.value || '',
                lastName: getElement('lastName', false)?.value || '',
                email: getElement('email', false)?.value || '',
                company: getElement('company', false)?.value || '',
                phone: getElement('phone', false)?.value || '',
                streetAddress1: getElement('streetAddress1', false)?.value || '',
                streetAddress2: getElement('streetAddress2', false)?.value || undefined,
                city: getElement('city', false)?.value || '',
                state: (getElement('state', false)?.value || '').toUpperCase(),
                zip: getElement('zip', false)?.value || '',
                country: (getElement('country', false)?.value || '').toUpperCase(),
                specialCode: 'RUN_MCP_2025', // Automatically include for widget orders
              };
              
              log('info', 'Form data collected', { size: formData.size, email: formData.email });
              
              // Check if OpenAI API is available
              if (typeof window === 'undefined' || !window.openai?.callTool) {
                throw new Error('Widget API not available. Please try again.');
              }
              
              // Call the order_shirt tool
              const result = await window.openai.callTool('order_shirt', formData);
              
              log('info', 'Order placed successfully');
              
              // Extract order ID from result if available
              let orderId = 'Pending';
              if (result?.content?.[0]?.text) {
                const orderIdMatch = result.content[0].text.match(/Order ID: ([\\w-]+)/);
                if (orderIdMatch) {
                  orderId = orderIdMatch[1];
                }
              }
              
              // Clear form and saved state
              try {
                form.reset();
                if (window.openai?.setWidgetState) {
                  await window.openai.setWidgetState(STATE_KEY, null);
                }
              } catch (e) {
                log('warn', 'Could not clear form state', { error: e.message });
              }
              
              // Show success view with order details
              showSuccessView({
                orderId: orderId,
                size: formData.size,
                email: formData.email,
              });
              
            } catch (error) {
              log('error', 'Order submission failed', { 
                error: error?.message || 'Unknown error',
                stack: error?.stack 
              });
              
              // Error state
              statusMessage.className = 'status-message error';
              statusMessage.textContent = \`✗ \${error?.message || 'Failed to place order. Please try again.'}\`;
              statusMessage.style.display = 'block';
            } finally {
              // Reset UI state
              try {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.setAttribute('aria-busy', 'false');
                backBtn.disabled = false;
              } catch (e) {
                log('error', 'Could not reset UI state', { error: e.message });
              }
            }
          } catch (e) {
            log('error', 'Form submit handler failed', { error: e.message });
          }
        });
      } else {
        log('error', 'Form element not found');
      }
      
      // Initialize on load with error handling
      try {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            try {
              initialize();
            } catch (e) {
              log('error', 'DOMContentLoaded initialization failed', { error: e.message });
            }
          });
        } else {
          initialize();
        }
      } catch (e) {
        log('error', 'Widget startup failed', { error: e.message });
      }
      
      // Global error handler for uncaught errors in widget
      if (typeof window !== 'undefined') {
        const originalErrorHandler = window.onerror;
        window.onerror = function(msg, url, lineNo, columnNo, error) {
          if (msg && typeof msg === 'string' && msg.includes('RUN MCP')) {
            log('error', 'Uncaught widget error', { 
              message: msg, 
              line: lineNo, 
              column: columnNo,
              error: error?.message 
            });
          }
          // Call original handler if it exists
          if (originalErrorHandler) {
            return originalErrorHandler(msg, url, lineNo, columnNo, error);
          }
          return false;
        };
      }
    </script>
  </body>
  </html>
    `;
};
