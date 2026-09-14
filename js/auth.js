/**
 * FarmFlow - Authentication & Role-Based Access Control (RBAC) Engine
 * Enforces strict portal isolation so each stakeholder (Farmer, Consumer, Logistics, FPO, Buyer, Admin)
 * only accesses services relevant to their verified role.
 * Includes a Pre-Login Gateway, 1-Click Demo Persona login for evaluators, and Logout.
 */

(function () {
  'use strict';

  window.FF_AUTH = {
    isLoggedIn: false,
    currentUserId: 'ACC-FARMER-01',
    currentUser: null,
    currentRole: 'FARMER',
    authMode: 'LOGIN', // 'LOGIN' or 'SIGNUP'
    activeSubTab: 'PRIMARY',

    init() {
      // Check saved session
      const saved = localStorage.getItem('FF_AUTH_SESSION');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.isLoggedIn && parsed.userId) {
            this.isLoggedIn = true;
            this.currentUserId = parsed.userId;
          }
        } catch (e) {
          this.isLoggedIn = false;
        }
      }

      this.syncUser();
    },

    syncUser() {
      if (window.FF_KYC && typeof window.FF_KYC.getAccountById === 'function') {
        this.currentUser = window.FF_KYC.getAccountById(this.currentUserId) || window.FF_KYC.accounts[0];
        if (this.currentUser) {
          let role = 'FARMER';
          if (this.currentUser.actorType === 'FARMER') role = 'FARMER';
          else if (this.currentUser.actorType === 'CONSUMER') role = 'CONSUMER';
          else if (this.currentUser.actorType === 'LOGISTICS_DRIVER' || this.currentUser.actorType === 'LOGISTICS_FLEET') role = 'LOGISTICS';
          else if (this.currentUser.actorType === 'FPO') role = 'FPO';
          else if (this.currentUser.actorType === 'BUYER') role = 'BUYER';
          else if (this.currentUser.actorType === 'ADMIN') role = 'ADMIN';

          this.currentRole = role;
          if (window.FF_KYC.activeAccountId !== this.currentUser.id) {
            window.FF_KYC.activeAccountId = this.currentUser.id;
          }
        }
      }
    },

    saveSession() {
      if (this.isLoggedIn) {
        localStorage.setItem('FF_AUTH_SESSION', JSON.stringify({
          isLoggedIn: true,
          userId: this.currentUserId
        }));
      } else {
        localStorage.removeItem('FF_AUTH_SESSION');
      }
    },

    login(userId) {
      this.isLoggedIn = true;
      this.currentUserId = userId;
      this.activeSubTab = 'PRIMARY';
      this.syncUser();
      this.saveSession();

      if (window.FF_APP) {
        window.FF_APP.activeRole = this.currentRole;
        window.FF_APP.renderCurrentView();
        window.FF_APP.showToast(`👋 Welcome back, ${this.currentUser.name}! Logged in as ${this.currentRole}.`, 'success');
      }
      this.updateHeaderAuthUI();
      this.renderRoleSubnav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    logout() {
      this.isLoggedIn = false;
      this.saveSession();

      if (window.FF_APP) {
        window.FF_APP.renderCurrentView();
        window.FF_APP.showToast('🚪 Logged out. Returned to FarmFlow Gateway.', 'info');
      }
      this.updateHeaderAuthUI();
      this.renderRoleSubnav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    setAuthMode(mode) {
      this.authMode = mode;
      const container = document.getElementById('main-workspace');
      if (container) this.renderAuthGateway(container);
    },

    loginWithPhoneOtp() {
      const phoneInput = document.getElementById('gateway-phone-input');
      const otpInput = document.getElementById('gateway-otp-input');
      const phone = (phoneInput?.value || '').trim();
      const otp = (otpInput?.value || '').trim();

      if (!phone) {
        alert('Please enter your registered mobile number.');
        return;
      }

      if (otp !== '7492' && otp !== '1234') {
        alert('Invalid OTP code. Please enter the demo verification code 7492.');
        return;
      }

      // Find accounts by phone
      const cleanPhone = phone.replace(/[\s-]/g, '');
      const matched = window.FF_KYC ? window.FF_KYC.accounts.filter(a => String(a.phone).replace(/[\s-]/g, '') === cleanPhone) : [];

      if (matched.length === 0) {
        alert(`No account on file with phone ${phone}. Please switch to "Sign Up" to register as a new actor.`);
        return;
      }

      // If multiple accounts share phone (Multi-Role Phone Identity), log in as first or prompt
      this.login(matched[0].id);
    },

    fillDemoLogin(userId) {
      const acc = window.FF_KYC ? window.FF_KYC.getAccountById(userId) : null;
      if (!acc) return;
      const phoneInput = document.getElementById('gateway-phone-input');
      const otpInput = document.getElementById('gateway-otp-input');
      if (phoneInput) phoneInput.value = acc.phone;
      if (otpInput) otpInput.value = '7492';
      this.login(userId);
    },

    // ==========================================================================
    // Pre-Login Gateway View
    // ==========================================================================
    renderAuthGateway(container) {
      if (!container) return;
      const mode = this.authMode || 'LOGIN';

      if (mode === 'SIGNUP') {
        // Render the 4-step asymmetric onboarding wizard directly in place
        if (window.FF_KYC && typeof window.FF_KYC.renderFullPageFlow === 'function') {
          container.innerHTML = `
            <div style="max-width: 960px; margin: 0 auto 20px auto; padding: 0 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--border-light);">
                <button class="btn btn-secondary" onclick="window.FF_AUTH.setAuthMode('LOGIN')">
                  <span>⬅ Back to Log In</span>
                </button>
                <div style="font-size: 0.88rem; font-weight: 700; color: #047857;">
                  New Stakeholder Registration
                </div>
              </div>
            </div>
            <div id="onboarding-embedded-flow"></div>
          `;
          const target = document.getElementById('onboarding-embedded-flow');
          window.FF_KYC.renderFullPageFlow(target);
          return;
        }
      }

      const sampleActors = [
        { id: 'ACC-FARMER-01', name: 'Ramesh Patel', icon: '🌾', role: 'Farmer', badge: 'Verified Producer', desc: 'Direct sales, DBT bank settlements, cold-chain bookings', phone: '+91 98451 22390' },
        { id: 'ACC-CONSUMER-01', name: 'Pooja Sharma', icon: '🛒', role: 'Retail Consumer', badge: 'Fresh Farm Produce', desc: 'Pre-paid farm basket, direct farmgate freshness, quality reports', phone: '+91 98451 22390' },
        { id: 'ACC-DRIVER-01', name: 'Kiran Gowda', icon: '🚚', role: 'Reefer Driver', badge: 'Cold-Chain Logistics', desc: 'Dynamic VRP route pickups, IoT telematics, daily DBT earnings', phone: '+91 98450 44321' },
        { id: 'ACC-FPO-01', name: 'GreenRoots Kisan Producer Co.', icon: '🏢', role: 'FPO Cooperative', badge: '242 Member Farmers', desc: 'Member lot pooling, statutory MCA registry, forward contracts', phone: '+91 98451 88440' },
        { id: 'ACC-BUYER-01', name: 'Harvest Bowl / BigBasket', icon: '🏬', role: 'B2B Institutional Buyer', badge: 'Bulk Sourcing', desc: '100% upfront bank escrow, metric-ton orders, dock deliveries', phone: '+91 98800 12345' },
        { id: 'ACC-ADMIN-01', name: 'Operations Command Tower', icon: '📊', role: 'Operations Admin', badge: 'Network Control', desc: 'Real-time spoke telematics, dispute arbitration, KYC desk', phone: '+91 99000 00000' }
      ];

      container.innerHTML = `
        <div class="auth-gateway-wrapper">
          <!-- Hero Header -->
          <div class="auth-hero-banner">
            <div class="auth-hero-badge">
              <span>🌾</span>
              <span>FarmFlow Kisan • Demand-Driven Agri-Supply Chain Network</span>
            </div>
            <h1 class="auth-hero-title">
              Direct Farmgate-to-Buyer Operating System
            </h1>
            <p class="auth-hero-sub">
              Access your role-specific portal. Zero intermediaries, 100% bank escrow, IoT assaying at village spokes, and same-day direct DBT settlement.
            </p>

            <!-- Mode Switcher -->
            <div class="auth-mode-switch-bar">
              <div class="auth-mode-switch-wrap">
                <button class="auth-mode-btn ${mode === 'LOGIN' ? 'active' : ''}" onclick="window.FF_AUTH.setAuthMode('LOGIN')">
                  <span>🔑</span>
                  <span>Stakeholder Log In</span>
                </button>
                <button class="auth-mode-btn ${mode === 'SIGNUP' ? 'active' : ''}" onclick="window.FF_AUTH.setAuthMode('SIGNUP')">
                  <span>📝</span>
                  <span>New Stakeholder Registration</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Two-Column Grid: Demo Quick Login + Standard Phone Auth -->
          <div class="auth-grid-layout">
            <!-- Left Panel: 1-Click Persona Login (Specially for SIH Judges & Evaluators) -->
            <div class="auth-card-panel">
              <div class="auth-card-header">
                <div class="auth-card-title">
                  <span>⚡</span>
                  <span>1-Click Stakeholder Demo Login</span>
                </div>
                <div class="auth-card-desc">
                  Select a persona to immediately experience that actor's isolated workspace without cross-role clutter.
                </div>
              </div>

              <div class="persona-quick-grid">
                ${sampleActors.map(a => `
                  <div class="persona-quick-card" onclick="window.FF_AUTH.fillDemoLogin('${a.id}')" title="Log in as ${a.name}">
                    <div class="persona-card-left">
                      <div class="persona-avatar-box">${a.icon}</div>
                      <div>
                        <div class="persona-title-text">${a.name}</div>
                        <div class="persona-sub-text"><strong>${a.role}</strong> • ${a.badge}</div>
                      </div>
                    </div>
                    <div class="persona-login-hint">
                      <span>Log In</span>
                      <span>➔</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right Panel: Standard Phone OTP Authentication -->
            <div class="auth-card-panel">
              <div class="auth-card-header">
                <div class="auth-card-title">
                  <span>📲</span>
                  <span>Registered Mobile Login</span>
                </div>
                <div class="auth-card-desc">
                  Indian mobile number authentication with Two-Factor OTP verification.
                </div>
              </div>

              <div class="phone-auth-form">
                <div class="auth-input-group">
                  <label class="auth-input-label">Mobile Number</label>
                  <input type="tel" id="gateway-phone-input" class="auth-input-control" placeholder="+91 98451 22390" value="+91 98451 22390">
                </div>

                <div class="auth-input-group">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label class="auth-input-label">4-Digit Verification Code</label>
                    <span style="font-size: 0.76rem; color: #047857; font-weight: 700;">Demo Passcode: 7492</span>
                  </div>
                  <input type="text" id="gateway-otp-input" class="auth-input-control" placeholder="7492" value="7492" maxlength="4">
                </div>

                <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: #065f46; display: flex; align-items: center; gap: 8px;">
                  <span>💡</span>
                  <span><strong>Multi-Role Identity:</strong> Using <code>+91 98451 22390</code> connects both Farmer Ramesh and Consumer Pooja under one family mobile number.</span>
                </div>

                <button class="btn btn-primary" style="padding: 12px; font-weight: 800; font-size: 0.95rem; margin-top: 6px;" onclick="window.FF_AUTH.loginWithPhoneOtp()">
                  <span>Log In to Stakeholder Portal</span>
                  <span>➔</span>
                </button>

                <div style="text-align: center; font-size: 0.82rem; color: #64748b; margin-top: 8px;">
                  New to FarmFlow? <a href="javascript:void(0)" onclick="window.FF_AUTH.setAuthMode('SIGNUP')" style="color: #047857; font-weight: 700; text-decoration: underline;">Onboard your role with Asymmetric KYC</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // ==========================================================================
    // Role-Isolated Sub-Navigation Renderer (Post-Login)
    // ==========================================================================
    renderRoleSubnav() {
      const subnavBar = document.getElementById('role-subnav-bar');
      if (!subnavBar) return;

      if (!this.isLoggedIn) {
        subnavBar.style.display = 'none';
        return;
      }

      subnavBar.style.display = 'block';
      const role = this.currentRole || 'FARMER';
      const user = this.currentUser || { name: 'User' };

      let chipClass = 'chip-farmer';
      let chipText = '🌾 FARMER WORKBENCH';

      let items = [];

      if (role === 'FARMER') {
        chipClass = 'chip-farmer';
        chipText = '🌾 FARMER PORTAL';
        items = [
          { id: 'PRIMARY', icon: '🌾', label: 'Farmer Workbench (मुख्य पृष्ठ)' },
          { id: 'SELL', icon: '🟢', label: 'Sell Produce (फसल बेचें)' },
          { id: 'TRANSPORT', icon: '🚚', label: 'Book Transport (खेत से गाड़ी)' },
          { id: 'DBT', icon: '💰', label: 'Bank DBT (पासबुक)' },
          { id: 'VOICE', icon: '🎙️', label: 'Kisan Vani (किसान वाणी)' }
        ];
      } else if (role === 'CONSUMER') {
        chipClass = 'chip-consumer';
        chipText = '🛒 CONSUMER STORE';
        items = [
          { id: 'PRIMARY', icon: '🛒', label: 'Farm Fresh Store' },
          { id: 'CART', icon: '🧺', label: 'My Farm Basket' },
          { id: 'ORDERS', icon: '📦', label: 'Track Orders & Quality' }
        ];
      } else if (role === 'LOGISTICS') {
        chipClass = 'chip-logistics';
        chipText = '🚚 REEFER FLEET & DRIVER';
        items = [
          { id: 'PRIMARY', icon: '🚚', label: 'Reefer Dispatch & VRP Route' },
          { id: 'TELEMATICS', icon: '🌡️', label: 'Cold-Chain Telematics' },
          { id: 'EARNINGS', icon: '💰', label: 'Driver Earnings DBT' }
        ];
      } else if (role === 'FPO') {
        chipClass = 'chip-fpo';
        chipText = '🏢 FPO OPERATIONS DESK';
        items = [
          { id: 'PRIMARY', icon: '🏢', label: 'Cooperative Operations' },
          { id: 'MEMBERS', icon: '👥', label: '242 Member Smallholders' },
          { id: 'MANDI_DEMANDS', icon: '📊', label: 'District Mandi Demands' }
        ];
      } else if (role === 'BUYER') {
        chipClass = 'chip-buyer';
        chipText = '🏬 B2B WHOLESALE SOURCING';
        items = [
          { id: 'PRIMARY', icon: '🏬', label: 'Wholesale Produce Catalog' },
          { id: 'ESCROW', icon: '🔒', label: '100% Upfront Bank Escrow' },
          { id: 'DOCK', icon: '🚚', label: 'Dock Deliveries' }
        ];
      } else if (role === 'ADMIN') {
        chipClass = 'chip-admin';
        chipText = '📊 OPERATIONS CONTROL TOWER';
        items = [
          { id: 'PRIMARY', icon: '📊', label: 'Live Operations Tower' },
          { id: 'KYC_DESK', icon: '🛡️', label: 'KYC Compliance Desk' },
          { id: 'SPOKES', icon: '🗺️', label: 'Village Spokes Network' }
        ];
      }

      const activeItem = this.activeSubTab || 'PRIMARY';

      subnavBar.innerHTML = `
        <div class="role-subnav-container">
          <div class="role-subnav-items">
            ${items.map(item => `
              <button class="subnav-item ${activeItem === item.id ? 'active' : ''}" onclick="window.FF_AUTH.handleSubnavClick('${item.id}')">
                <span>${item.icon}</span>
                <span>${item.label}</span>
              </button>
            `).join('')}
          </div>

          <div class="role-current-badge-wrap">
            <span class="role-indicator-chip ${chipClass}">${chipText}</span>
            <span>•</span>
            <span style="font-weight: 700; color: #1e293b;">${user.name}</span>
          </div>
        </div>
      `;
    },

    handleSubnavClick(subId) {
      this.activeSubTab = subId;
      this.renderRoleSubnav();

      // Special actions that don't need a full re-render
      const role = this.currentRole;
      if (role === 'CONSUMER' && subId === 'CART') {
        window.FF_STORE.openCartDrawer();
        return;
      }

      // Re-render the main workspace so the role's render function can filter by activeSubTab
      if (window.FF_APP) {
        window.FF_APP.renderCurrentView();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Update Header Controls for Auth State
    updateHeaderAuthUI() {
      const authControls = document.getElementById('auth-header-controls');
      const kisanVaniBtn = document.getElementById('btn-kisan-vani');

      if (!authControls) return;

      if (!this.isLoggedIn) {
        if (kisanVaniBtn) kisanVaniBtn.style.display = 'none';

        authControls.style.display = 'flex';
        authControls.innerHTML = `
          <button class="btn-header-login-trigger" id="btn-header-login" onclick="window.FF_AUTH.setAuthMode('LOGIN'); window.FF_APP && window.FF_APP.renderCurrentView();">
            <span>🔑</span>
            <span>Log In / Sign Up</span>
          </button>
        `;
      } else {
        // Logged In — show user name + prominent logout
        this.syncUser();
        const user = this.currentUser || { name: 'User', actorType: 'FARMER' };

        let icon = '🌾';
        if (user.actorType === 'FPO') icon = '🏢';
        else if (user.actorType === 'CONSUMER') icon = '🛒';
        else if (user.actorType === 'BUYER') icon = '🏬';
        else if (user.actorType === 'LOGISTICS_DRIVER' || user.actorType === 'LOGISTICS_FLEET') icon = '🚚';
        else if (user.actorType === 'ADMIN') icon = '📊';

        // Show Kisan Vani ONLY for Farmer role
        if (kisanVaniBtn) {
          kisanVaniBtn.style.display = this.currentRole === 'FARMER' ? 'inline-flex' : 'none';
        }

        authControls.style.display = 'flex';
        authControls.innerHTML = `
          <div class="auth-user-chip">
            <span class="auth-user-icon">${icon}</span>
            <span class="auth-user-name">${user.name}</span>
          </div>
          <button class="btn-header-logout-new" id="btn-header-logout" onclick="window.FF_AUTH.logout();" title="Log out and return to gateway">
            <span>⏻</span>
            <span>Log Out</span>
          </button>
        `;
      }
    }
  };

  // Initialize Auth on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    window.FF_AUTH.init();
  });
})();

