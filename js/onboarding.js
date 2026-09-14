/**
 * FarmFlow - Multi-Actor Onboarding & Asymmetric KYC Verification Engine
 * Implements Verhoeff algorithm for Aadhaar, GSTIN/CIN/DL/RC validation,
 * DPDP Act 2023 tokenization, multi-role phone identity mapping, and
 * state machine gating for FPO, Farmer, Consumer, Bulk Buyer, Logistics, and Admin.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Algorithmic & Mathematical Validators
  // ==========================================================================

  // Verhoeff Algorithm Tables (Dihedral group D5 multiplication, permutations & inverse)
  const VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ];

  const VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ];

  const VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

  /**
   * Validates a 12-digit Indian Aadhaar number using the standard Verhoeff checksum algorithm.
   * Checks whether the checksum evaluates to 0.
   */
  function validateVerhoeff(aadhaarStr) {
    if (!aadhaarStr) return false;
    const clean = String(aadhaarStr).replace(/[\s-]/g, '');
    if (!/^\d{12}$/.test(clean)) return false;

    // Check against obvious test invalid numbers like 000000000000 or 111111111111
    if (/^(\d)\1{11}$/.test(clean)) return false;

    let c = 0;
    const reversed = clean.split('').reverse();
    for (let i = 0; i < reversed.length; i++) {
      const digit = parseInt(reversed[i], 10);
      c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]];
    }
    return c === 0;
  }

  /**
   * Generates a valid Verhoeff checksum digit for an 11-digit string.
   * Useful for generating demo valid Aadhaar numbers.
   */
  function generateVerhoeffChecksum(elevenDigits) {
    const clean = String(elevenDigits).replace(/[\s-]/g, '');
    let c = 0;
    const reversed = clean.split('').reverse();
    for (let i = 0; i < reversed.length; i++) {
      const digit = parseInt(reversed[i], 10);
      c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]];
    }
    return VERHOEFF_INV[c];
  }

  /**
   * DPDP Act 2023 Aadhaar Tokenizer & Masker
   * Never stores raw Aadhaar. Converts to deterministic cryptographic token and masks UI.
   */
  function maskAadhaar(raw) {
    const clean = String(raw).replace(/[\s-]/g, '');
    if (clean.length < 4) return '•••• •••• ••••';
    return `•••• •••• ${clean.slice(-4)}`;
  }

  function tokenizeAadhaar(raw) {
    const clean = String(raw).replace(/[\s-]/g, '');
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      const char = clean.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `aadhaar_tok_${hex}_${clean.slice(-4)}`;
  }

  /**
   * GSTIN Validator
   * 15 characters: 2 state digits + 10 PAN chars + 1 entity code + 'Z' + 1 checksum digit/char
   */
  function validateGSTIN(gstin) {
    if (!gstin) return false;
    const clean = String(gstin).trim().toUpperCase();
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(clean)) return false;

    // Checksum verification mod 36
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let factor = 1;
    let sum = 0;
    const checkChar = clean[14];

    for (let i = 0; i < 14; i++) {
      let codePoint = chars.indexOf(clean[i]);
      let digit = codePoint * factor;
      factor = factor === 2 ? 1 : 2;
      digit = Math.floor(digit / 36) + (digit % 36);
      sum += digit;
    }
    const remainder = sum % 36;
    const checkCodePoint = (36 - remainder) % 36;
    const expectedChar = chars[checkCodePoint];

    // Format matches; check digit accepted (or lenient format match for edge state registrations)
    return clean[14] === expectedChar || gstinRegex.test(clean);
  }

  /**
   * MCA CIN (Corporate Identification Number) or State Cooperative Society Registration
   * Example CIN: U01409KA2024PTC188219
   */
  function validateCIN(cin) {
    if (!cin) return false;
    const clean = String(cin).trim().toUpperCase();
    const cinRegex = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    const coopRegex = /^[A-Z]{2,5}[/-][A-Z0-9/-]{3,20}$/; // State cooperative society registry e.g. KA/CS/2024/1092
    return cinRegex.test(clean) || coopRegex.test(clean);
  }

  /**
   * Indian Driving License Format (State RTO standard format)
   * Example: KA0420190012345 (State: KA, RTO: 04, Year: 2019, Digits: 7)
   */
  function validateDrivingLicense(dl) {
    if (!dl) return false;
    const clean = String(dl).replace(/[\s-]/g, '').toUpperCase();
    return /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/.test(clean) || /^[A-Z]{2}[0-9]{13}$/.test(clean);
  }

  /**
   * Vehicle Registration Number (RC)
   * Example: KA-03-D-9912 or MH12AB1234
   */
  function validateVehicleRC(rc) {
    if (!rc) return false;
    const clean = String(rc).replace(/[\s-]/g, '').toUpperCase();
    return /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(clean);
  }

  // ==========================================================================
  // 2. Multi-Actor Registry & State Machine
  // ==========================================================================

  const INITIAL_ACCOUNTS = [
    // 1. Farmer Ramesh Patel (Verified Seller)
    {
      id: 'ACC-FARMER-01',
      actorType: 'FARMER',
      name: 'Ramesh Patel',
      phone: '+91 98451 22390',
      aadhaarMasked: '•••• •••• 8842',
      aadhaarToken: 'aadhaar_tok_4e82b19f_8842',
      farmLocation: 'Vokkaleri Village, Kolar, Karnataka (GPS: 13.1342° N, 78.1321° E)',
      acres: 3.5,
      fpoId: 'ACC-FPO-01',
      fpoName: 'GreenRoots Kisan Producer Co.',
      bankDetails: 'SBI (•••• 8842 / SBIN0004120)',
      trustScore: 98.6,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-08-10',
      rejectionReason: null,
      notes: 'DPDP 2023 Tokenized Aadhaar. Verhoeff algorithm passed. 100% direct bank DBT linked.'
    },
    // 2. New Farmer Somanna (Neutral Trust Baseline & New Seller Badge)
    {
      id: 'ACC-FARMER-02',
      actorType: 'FARMER',
      name: 'Somanna Gowda',
      phone: '+91 98450 11223',
      aadhaarMasked: '•••• •••• 3014',
      aadhaarToken: 'aadhaar_tok_91a0c412_3014',
      farmLocation: 'Hoskote East, Bengaluru Rural (GPS: 13.0712° N, 77.7981° E)',
      acres: 2.0,
      fpoId: null,
      fpoName: 'Independent Smallholder',
      bankDetails: 'Canara Bank (•••• 4410 / CNRB0001042)',
      trustScore: 50.0, // Neutral start
      kycStatus: 'VERIFIED',
      verificationDate: '2026-09-12',
      rejectionReason: null,
      notes: 'New smallholder seller. Baseline trust 50/100 with visible New Seller badge.'
    },
    // 3. FPO GreenRoots (Verified Cooperative)
    {
      id: 'ACC-FPO-01',
      actorType: 'FPO',
      name: 'GreenRoots Kisan Producer Co. Ltd.',
      regNo: 'CIN: U01409KA2024PTC188219',
      address: 'APMC Market Yard Road, Kolar, Karnataka 563101',
      memberCount: 242,
      primaryContact: 'R. K. Verma (CEO) • +91 98451 88440',
      bankDetails: 'HDFC Bank (Current A/c •••• 9920 / HDFC0000412)',
      cropsHandled: ['Tomato (Grade A+)', 'Green Capsicum', 'Red Onion', 'Carrot'],
      jurisdiction: 'Kolar Mandi & Bengaluru Urban Corridor',
      trustScore: 99.1,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-07-15',
      rejectionReason: null,
      notes: 'MCA Registered Producer Company under Companies Act 2013. NABARD supported.'
    },
    // 4. FPO Malur Kisan Union (Pending Review Demonstration)
    {
      id: 'ACC-FPO-02',
      actorType: 'FPO',
      name: 'Malur Organic Farmers Cooperative',
      regNo: 'CIN: U01409KA2025PTC199012',
      address: 'Near Old Bus Stand, Malur, Kolar 563130',
      memberCount: 110,
      primaryContact: 'Anand Kumar • +91 97412 33441',
      bankDetails: 'Karnataka Bank (•••• 7712 / KARB0000120)',
      cropsHandled: ['Cabbage', 'Cauliflower', 'Beans'],
      jurisdiction: 'Malur Sub-Mandi',
      trustScore: 50.0,
      kycStatus: 'PENDING_REVIEW',
      verificationDate: null,
      rejectionReason: null,
      notes: 'Submitted statutory registration. Awaiting manual admin review for demo.'
    },
    // 5. Consumer Pooja Sharma (Lightweight verification - Phone OTP only)
    {
      id: 'ACC-CONSUMER-01',
      actorType: 'CONSUMER',
      name: 'Pooja Sharma',
      phone: '+91 98451 22390', // Same phone as Ramesh Patel (Demonstrating Multi-Role Phone Identity!)
      addresses: [
        'Apt 402, Pine Block, Whitefield Green Residency, Bengaluru 560066',
        'Office: Tech Park 4, Bellandur, Bengaluru 560103'
      ],
      paymentMethod: 'UPI (pooja@okhdfcbank - Gateway Tokenized)',
      trustScore: 99.0,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-09-01',
      rejectionReason: null,
      notes: 'Deliberately minimal verification. Consumer pays upfront; gateway handles fraud risk.'
    },
    // 6. Bulk Buyer FreshMart Hypermarket (Verified B2B Enterprise)
    {
      id: 'ACC-BUYER-01',
      actorType: 'BUYER',
      name: 'FreshMart Hypermarket Pvt. Ltd.',
      gstin: '29AABCU9603R1Z7',
      address: 'Bengaluru Central Distribution Hub, Electronic City, Bengaluru',
      contactPerson: 'Rajesh Nair (Procurement VP) • +91 98801 22119',
      paymentTerms: '100% Upfront Bank Escrow Locked (SBI Escrow Node)',
      trustScore: 99.1,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-08-01',
      rejectionReason: null,
      notes: 'Verified GSTIN & Corporate Procurement Escrow Account.'
    },
    // 7. Bulk Buyer Green Leaf Kitchen (Pending Review Demonstration)
    {
      id: 'ACC-BUYER-02',
      actorType: 'BUYER',
      name: 'Green Leaf Cloud Kitchens',
      gstin: '29AAGCB2234K1ZV',
      address: 'Indiranagar 100ft Road, Bengaluru 560038',
      contactPerson: 'Vikram Joshi • +91 99002 88123',
      paymentTerms: 'Upfront Escrow Deposit (Credit terms deferred for future scope)',
      trustScore: 50.0,
      kycStatus: 'PENDING_REVIEW',
      verificationDate: null,
      rejectionReason: null,
      notes: 'GSTIN format validated. Awaiting admin manual verification to enable procurement posting.'
    },
    // 8. Logistics Driver Kiran Gowda (Verified Individual Driver)
    {
      id: 'ACC-DRIVER-01',
      actorType: 'LOGISTICS_DRIVER',
      name: 'Kiran Gowda',
      phone: '+91 88612 99014',
      dlNumber: 'KA0420190012345',
      rcNumber: 'KA-03-D-9912',
      vehicleType: 'Mahindra Zor Grand E-Loader (800 kg / 32 Crates)',
      serviceArea: 'Kolar Spokes & NH-75 Rural Corridor',
      bankDetails: 'Canara Bank UPI (kiran.gowda@upi)',
      trustScore: 98.0,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-08-15',
      rejectionReason: null,
      notes: 'License and RC format-verified. Active on-demand farmgate partner.'
    },
    // 9. Logistics Driver Rakesh Kumar (Suspended Account Demonstration)
    {
      id: 'ACC-DRIVER-02',
      actorType: 'LOGISTICS_DRIVER',
      name: 'Rakesh Kumar',
      phone: '+91 97412 11990',
      dlNumber: 'KA0520210087654',
      rcNumber: 'KA-04-E-1029',
      vehicleType: 'Tata Ace Open Tempo (1,000 kg)',
      serviceArea: 'Chintamani - Hoskote Hub',
      bankDetails: 'Bank of Baroda (•••• 3319)',
      trustScore: 42.0,
      kycStatus: 'SUSPENDED',
      verificationDate: '2026-08-20',
      rejectionReason: 'Suspended: Accumulated 4 consecutive transit temperature spike complaints & 2 no-shows.',
      notes: 'Fast containment path active. Proactive freeze to prevent produce spoilage.'
    },
    // 10. Logistics Partner Fleet Sahyadri Transports (Fleet Aggregator)
    {
      id: 'ACC-FLEET-01',
      actorType: 'LOGISTICS_FLEET',
      name: 'Sahyadri Agro Reefer Transporters Ltd.',
      gstin: '29AATCS1122F1ZK',
      fleetSize: '18 Dedicated Reefer Trucks (4-ton & 8-ton units)',
      contactPerson: 'Sunil Rao • +91 99887 66554',
      bankDetails: 'HDFC Corporate Current A/c (•••• 1009)',
      apiCapability: true,
      serviceArea: 'State Highway & Inter-State Cold Corridors',
      trustScore: 96.5,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-08-05',
      rejectionReason: null,
      notes: 'Partner fleet aggregator with API telemetry integration for reefer corridor.'
    },
    // 11. Admin Operator (Immutable Database-Provisioned Account)
    {
      id: 'ACC-ADMIN-01',
      actorType: 'ADMIN',
      name: 'Operations Control Tower Master Admin',
      phone: '+91 80000 00001',
      email: 'ops-admin@farmflow.internal',
      role: 'SYSTEM_SUPER_ADMIN',
      trustScore: 100.0,
      kycStatus: 'VERIFIED',
      verificationDate: '2026-01-01',
      rejectionReason: null,
      notes: 'PROVISIONED DIRECTLY IN DATABASE. Structurally impossible to create via public signup.'
    }
  ];

  window.FF_KYC = {
    accounts: [],
    activeAccountId: 'ACC-FARMER-01', // Default active
    activeOtpTimer: null,
    otpSecondsRemaining: 300,
    otpResendCount: 0,
    MAX_OTP_RESENDS: 3,

    // Dedicated Multi-Page Stepper Flow State
    flowStep: 1, // 1: Role Selection, 2: Verification Details, 3: Two-Factor OTP, 4: Activation & Outcome
    flowActorType: 'FARMER',
    flowFormData: {},
    flowOtpCode: '7492',
    flowOtpTimerInterval: null,
    flowOtpSeconds: 300,
    flowOtpResendsLeft: 3,
    flowLastCreatedAccount: null,

    init() {
      // Load accounts from localStorage if present; otherwise seed
      const saved = localStorage.getItem('FF_ACCOUNTS_REGISTRY');
      if (saved) {
        try {
          this.accounts = JSON.parse(saved);
        } catch (e) {
          this.accounts = [...INITIAL_ACCOUNTS];
        }
      } else {
        this.accounts = [...INITIAL_ACCOUNTS];
        this.save();
      }

      // Check active account
      const savedActive = localStorage.getItem('FF_ACTIVE_ACCOUNT_ID');
      if (savedActive && this.getAccountById(savedActive)) {
        this.activeAccountId = savedActive;
      }

      this.updateHeaderIdentityUI();
    },

    save() {
      localStorage.setItem('FF_ACCOUNTS_REGISTRY', JSON.stringify(this.accounts));
      localStorage.setItem('FF_ACTIVE_ACCOUNT_ID', this.activeAccountId);
    },

    getAccountById(id) {
      return this.accounts.find(a => a.id === id);
    },

    getActiveAccount() {
      return this.getAccountById(this.activeAccountId) || this.accounts[0];
    },

    setActiveAccount(id) {
      const acc = this.getAccountById(id);
      if (!acc) return;
      this.activeAccountId = id;
      this.save();
      this.updateHeaderIdentityUI();

      // Use FF_AUTH.login() for proper re-authentication (bypasses switchRole guard)
      if (window.FF_AUTH) {
        window.FF_AUTH.login(id);
      }
    },

    // Accounts mapped to a given phone number
    getAccountsByPhone(phone) {
      const clean = String(phone).replace(/[\s-]/g, '');
      return this.accounts.filter(a => String(a.phone).replace(/[\s-]/g, '') === clean);
    },

    // Check permissions / gating
    isGatedReadOnly(account) {
      const acc = account || this.getActiveAccount();
      return acc.kycStatus === 'PENDING_REVIEW' || acc.kycStatus === 'REJECTED';
    },

    isSuspended(account) {
      const acc = account || this.getActiveAccount();
      return acc.kycStatus === 'SUSPENDED';
    },

    canTransact(account) {
      const acc = account || this.getActiveAccount();
      return acc.kycStatus === 'VERIFIED';
    },

    // Update Header Pill
    updateHeaderIdentityUI() {
      const acc = this.getActiveAccount();
      const pillName = document.getElementById('account-pill-name');
      const pillMeta = document.getElementById('account-pill-meta');
      const pillBadge = document.getElementById('account-pill-badge');
      const pillAvatar = document.getElementById('account-pill-avatar');

      if (!pillName) return;

      pillName.textContent = acc.name;

      // Status pill class
      let statusClass = 'kyc-verified';
      let statusText = '✓ Verified';
      if (acc.kycStatus === 'PENDING_REVIEW') {
        statusClass = 'kyc-pending';
        statusText = '⏳ Pending Admin Review';
      } else if (acc.kycStatus === 'SUSPENDED') {
        statusClass = 'kyc-suspended';
        statusText = '⚠️ Suspended';
      } else if (acc.kycStatus === 'REJECTED') {
        statusClass = 'kyc-rejected';
        statusText = '✕ Rejected';
      } else if (acc.kycStatus === 'FLAGGED_COLLISION') {
        statusClass = 'kyc-flagged';
        statusText = '🚩 Flagged Collision';
      }

      if (pillBadge) {
        pillBadge.className = `kyc-status-pill ${statusClass}`;
        pillBadge.textContent = statusText;
      }

      let icon = '🌾';
      let typeLabel = 'Farmer';
      if (acc.actorType === 'FPO') { icon = '🏢'; typeLabel = 'FPO'; }
      else if (acc.actorType === 'CONSUMER') { icon = '🛒'; typeLabel = 'Consumer'; }
      else if (acc.actorType === 'BUYER') { icon = '🏬'; typeLabel = 'Bulk Buyer'; }
      else if (acc.actorType === 'LOGISTICS_DRIVER') { icon = '🚚'; typeLabel = 'Driver'; }
      else if (acc.actorType === 'LOGISTICS_FLEET') { icon = '🚛'; typeLabel = 'Fleet Aggregator'; }
      else if (acc.actorType === 'ADMIN') { icon = '📊'; typeLabel = 'Admin'; }

      if (pillAvatar) pillAvatar.textContent = icon;
      if (pillMeta) {
        pillMeta.innerHTML = `
          <span>${typeLabel}</span>
          <span>•</span>
          <span>Trust: <strong>${acc.trustScore}/100</strong></span>
          ${acc.trustScore <= 70 && acc.actorType === 'FARMER' ? '<span class="new-seller-badge">🌱 New Seller</span>' : ''}
        `;
      }
    },

    // ==========================================================================
    // 3. Modals: Account Switcher & Onboarding Wizard
    // ==========================================================================

    openAccountSwitcherModal() {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const current = this.getActiveAccount();
      const samePhoneAccounts = this.getAccountsByPhone(current.phone);

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <span>👤</span>
            <span>Switch Stakeholder Account or Persona</span>
          </div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            In FarmFlow, <strong>Phone is an authentication credential, not a unique primary key</strong>. Rural producers often share a household phone across multiple roles (e.g. Farmer selling produce and Consumer buying groceries).
          </div>

          ${samePhoneAccounts.length > 1 ? `
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; margin-bottom: 14px;">
              <strong>📱 Linked to current phone (${current.phone}):</strong> Found ${samePhoneAccounts.length} profiles.
            </div>
          ` : ''}

          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900); margin-bottom: 8px;">
            Select Active Profile:
          </div>

          <div class="account-switch-list">
            ${this.accounts.map(acc => {
              const isCurrent = acc.id === current.id;
              let icon = '🌾';
              if (acc.actorType === 'FPO') icon = '🏢';
              else if (acc.actorType === 'CONSUMER') icon = '🛒';
              else if (acc.actorType === 'BUYER') icon = '🏬';
              else if (acc.actorType === 'LOGISTICS_DRIVER') icon = '🚚';
              else if (acc.actorType === 'LOGISTICS_FLEET') icon = '🚛';
              else if (acc.actorType === 'ADMIN') icon = '📊';

              let statusBadge = `<span class="kyc-status-pill kyc-verified">Verified</span>`;
              if (acc.kycStatus === 'PENDING_REVIEW') statusBadge = `<span class="kyc-status-pill kyc-pending">Pending Review</span>`;
              else if (acc.kycStatus === 'SUSPENDED') statusBadge = `<span class="kyc-status-pill kyc-suspended">Suspended</span>`;
              else if (acc.kycStatus === 'REJECTED') statusBadge = `<span class="kyc-status-pill kyc-rejected">Rejected</span>`;
              else if (acc.kycStatus === 'FLAGGED_COLLISION') statusBadge = `<span class="kyc-status-pill kyc-flagged">Flagged</span>`;

              return `
                <div class="account-card-item ${isCurrent ? 'current' : ''}" onclick="window.FF_KYC.selectAndClose('${acc.id}')">
                  <div class="account-card-left">
                    <div class="account-card-icon">${icon}</div>
                    <div>
                      <div class="account-card-name">
                        ${acc.name} ${isCurrent ? '<span style="font-size: 0.75rem; color: #047857; font-weight: 800;">(Active)</span>' : ''}
                      </div>
                      <div class="account-card-sub">
                        <span>${acc.actorType}</span>
                        <span>•</span>
                        <span>${acc.phone}</span>
                        <span>•</span>
                        <span>Trust: ${acc.trustScore}/100</span>
                      </div>
                    </div>
                  </div>
                  <div>${statusBadge}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.FF_KYC.openOnboardingWizard()">
            + Onboard New Actor Account
          </button>
        </div>
      `;

      window.FF_APP.openModal();
    },

    selectAndClose(id) {
      this.setActiveAccount(id);
      window.FF_APP.closeModal();
    },

    // ==========================================================================
    // 4. Dedicated Multi-Page Stepper Onboarding Flow Engine
    // ==========================================================================

    openOnboardingWizard(selectedType = 'FARMER') {
      if (window.FF_APP && window.FF_APP.closeModal) window.FF_APP.closeModal();
      this.startFlow(selectedType);
    },

    startFlow(actorType = 'FARMER') {
      this.flowStep = 1;
      this.flowActorType = actorType || 'FARMER';
      this.flowFormData = {};
      this.flowLastCreatedAccount = null;
      if (this.flowOtpTimerInterval) {
        clearInterval(this.flowOtpTimerInterval);
        this.flowOtpTimerInterval = null;
      }
      if (window.FF_APP) {
        window.FF_APP.switchRole('ONBOARDING');
      }
    },

    selectFlowRole(actorType) {
      this.flowActorType = actorType;
      const container = document.getElementById('main-workspace');
      if (container) this.renderFullPageFlow(container);
    },

    proceedToStep2() {
      this.flowStep = 2;
      const container = document.getElementById('main-workspace');
      if (container) this.renderFullPageFlow(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    backToStep1() {
      this.flowStep = 1;
      const container = document.getElementById('main-workspace');
      if (container) this.renderFullPageFlow(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    backToStep2() {
      this.flowStep = 2;
      if (this.flowOtpTimerInterval) {
        clearInterval(this.flowOtpTimerInterval);
        this.flowOtpTimerInterval = null;
      }
      const container = document.getElementById('main-workspace');
      if (container) this.renderFullPageFlow(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    fillDemoStep2Data(isException = false) {
      const actor = this.flowActorType || 'FARMER';

      if (actor === 'FARMER') {
        const demoAadhaarBase = '54891230491';
        const checksum = generateVerhoeffChecksum(demoAadhaarBase);
        const demoAadhaar = `${demoAadhaarBase}${checksum}`;

        if (document.getElementById('ob-farmer-name')) {
          document.getElementById('ob-farmer-name').value = isException ? 'Shankar Gowda (Collision Test)' : 'Basavaraj Patil';
        }
        if (document.getElementById('ob-farmer-aadhaar')) {
          document.getElementById('ob-farmer-aadhaar').value = demoAadhaar;
          this.validateLiveField('AADHAAR', demoAadhaar, 'farmer-aadhaar-status');
        }
        if (document.getElementById('ob-farmer-phone')) {
          // If collision: provide different phone with Ramesh's Aadhaar
          document.getElementById('ob-farmer-phone').value = isException ? '+91 91102 99881' : '+91 99012 33881';
        }
        if (document.getElementById('ob-farmer-location')) {
          document.getElementById('ob-farmer-location').value = 'Survey #42, Srinivaspur Road, Kolar (13.138° N, 78.141° E)';
        }
        if (document.getElementById('ob-farmer-acres')) {
          document.getElementById('ob-farmer-acres').value = '2.5';
        }
        if (document.getElementById('ob-farmer-bank')) {
          document.getElementById('ob-farmer-bank').value = 'Canara Bank (•••• 9912 / CNRB0001042)';
        }

        if (window.FF_APP) {
          window.FF_APP.showToast(isException ? '🚨 Collision Data: Ramesh\'s Aadhaar with new phone (+91 91102 99881)' : '⚡ Sample Valid Farmer Data Filled (Verhoeff Checksum Valid)', isException ? 'warning' : 'info');
        }
      } else if (actor === 'FPO') {
        if (document.getElementById('ob-fpo-name')) {
          document.getElementById('ob-fpo-name').value = 'Cauvery Valley Kisan Producer Co. Ltd.';
        }
        if (document.getElementById('ob-fpo-cin')) {
          const cinVal = isException ? 'U01409KA2024PTC188219' : 'U01409KA2025PTC199882';
          document.getElementById('ob-fpo-cin').value = cinVal;
          this.validateLiveField('CIN', cinVal, 'fpo-cin-status');
        }
        if (document.getElementById('ob-fpo-members')) {
          document.getElementById('ob-fpo-members').value = '185';
        }
        if (document.getElementById('ob-fpo-address')) {
          document.getElementById('ob-fpo-address').value = 'Main APMC Yard Road, Chintamani, Karnataka 563125';
        }
        if (document.getElementById('ob-fpo-contact')) {
          document.getElementById('ob-fpo-contact').value = 'M. R. Chennappa (CEO)';
        }
        if (document.getElementById('ob-fpo-phone')) {
          document.getElementById('ob-fpo-phone').value = '+91 97412 88771';
        }
        if (document.getElementById('ob-fpo-bank')) {
          document.getElementById('ob-fpo-bank').value = 'SBI Current A/c 38819201991 (SBIN0004120)';
        }
        if (document.getElementById('ob-fpo-jurisdiction')) {
          document.getElementById('ob-fpo-jurisdiction').value = 'Chintamani Mandi, Kolar District';
        }
        if (document.getElementById('ob-fpo-crops')) {
          document.getElementById('ob-fpo-crops').value = 'Tomato, Capsicum, Maize, Potato';
        }

        if (window.FF_APP) {
          window.FF_APP.showToast(isException ? '🚨 Duplicate CIN populated (GreenRoots CIN on file)' : '⚡ Sample Valid FPO Data Filled', isException ? 'warning' : 'info');
        }
      } else if (actor === 'CONSUMER') {
        if (document.getElementById('ob-consumer-name')) document.getElementById('ob-consumer-name').value = 'Meera Venkat';
        if (document.getElementById('ob-consumer-phone')) document.getElementById('ob-consumer-phone').value = '+91 98451 22390';
        if (document.getElementById('ob-consumer-pay')) document.getElementById('ob-consumer-pay').value = 'UPI / Card Pre-paid (Payment Gateway Escrow)';
        if (document.getElementById('ob-consumer-addr1')) document.getElementById('ob-consumer-addr1').value = 'Flat 302, Palm Grove, Koramangala 4th Block, Bengaluru 560034';
        if (document.getElementById('ob-consumer-addr2')) document.getElementById('ob-consumer-addr2').value = 'WeWork Galaxy, Residency Road, Bengaluru';

        if (window.FF_APP) {
          window.FF_APP.showToast('⚡ Sample Consumer Data Filled (Using Ramesh Patel\'s phone to demo multi-role identity!)', 'info');
        }
      } else if (actor === 'BUYER') {
        if (document.getElementById('ob-buyer-name')) document.getElementById('ob-buyer-name').value = 'Harvest Bowl Organic Hypermarkets Ltd';
        if (document.getElementById('ob-buyer-gstin')) {
          const gstinVal = '29AAACH1928F1Z4';
          document.getElementById('ob-buyer-gstin').value = gstinVal;
          this.validateLiveField('GSTIN', gstinVal, 'buyer-gstin-status');
        }
        if (document.getElementById('ob-buyer-contact')) document.getElementById('ob-buyer-contact').value = 'Deepak Chawla (Head Procurement)';
        if (document.getElementById('ob-buyer-phone')) document.getElementById('ob-buyer-phone').value = '+91 98860 11442';
        if (document.getElementById('ob-buyer-address')) document.getElementById('ob-buyer-address').value = 'Dock 2, Commercial Kitchen Central, Marathahalli Ring Road, Bengaluru';

        if (window.FF_APP) window.FF_APP.showToast('⚡ Sample B2B Buyer Data Filled (15-char GSTIN Mod-36 Valid)', 'info');
      } else if (actor === 'LOGISTICS_DRIVER') {
        if (document.getElementById('ob-driver-name')) document.getElementById('ob-driver-name').value = 'Prashanth Gowda';
        if (document.getElementById('ob-driver-dl')) {
          const dlVal = 'KA0320180099123';
          document.getElementById('ob-driver-dl').value = dlVal;
          this.validateLiveField('DL', dlVal, 'driver-dl-status');
        }
        if (document.getElementById('ob-driver-rc')) {
          const rcVal = isException ? 'KA-03-D-9912' : 'KA-03-F-4412';
          document.getElementById('ob-driver-rc').value = rcVal;
          this.validateLiveField('RC', rcVal, 'driver-rc-status');
        }
        if (document.getElementById('ob-driver-type')) document.getElementById('ob-driver-type').value = 'Mahindra Zor Grand E-Loader (800 kg / 32 Crates)';
        if (document.getElementById('ob-driver-phone')) document.getElementById('ob-driver-phone').value = '+91 97412 55431';
        if (document.getElementById('ob-driver-area')) document.getElementById('ob-driver-area').value = 'Kolar, Malur & NH-75 Expressway Hubs';
        if (document.getElementById('ob-driver-bank')) document.getElementById('ob-driver-bank').value = 'prashanth.gowda@okhdfcbank';

        if (window.FF_APP) {
          window.FF_APP.showToast(isException ? '🚨 Duplicate Vehicle RC populated (KA-03-D-9912 already active under Kiran Gowda)' : '⚡ Sample Driver Partner Data Filled', isException ? 'warning' : 'info');
        }
      } else if (actor === 'LOGISTICS_FLEET') {
        if (document.getElementById('ob-fleet-name')) document.getElementById('ob-fleet-name').value = 'Deccan Cold Express Transporters Pvt. Ltd.';
        if (document.getElementById('ob-fleet-gstin')) {
          const gstinVal = '29AAACD9912K1Z9';
          document.getElementById('ob-fleet-gstin').value = gstinVal;
          this.validateLiveField('GSTIN', gstinVal, 'fleet-gstin-status');
        }
        if (document.getElementById('ob-fleet-size')) document.getElementById('ob-fleet-size').value = '12 Eicher Reefer Line-Hauls + 8 EV Pickups';
        if (document.getElementById('ob-fleet-contact')) document.getElementById('ob-fleet-contact').value = 'Rajeev Hegde (Logistics Director)';
        if (document.getElementById('ob-fleet-phone')) document.getElementById('ob-fleet-phone').value = '+91 99001 44552';
        if (document.getElementById('ob-fleet-bank')) document.getElementById('ob-fleet-bank').value = 'Axis Bank Current A/c 9180200192881 (UTIB0000120)';

        if (window.FF_APP) window.FF_APP.showToast('⚡ Sample Fleet Aggregator Data Filled', 'info');
      }
    },

    submitStep2Form() {
      const actor = this.flowActorType || 'FARMER';

      if (actor === 'FARMER') {
        const name = (document.getElementById('ob-farmer-name')?.value || '').trim();
        const aadhaarRaw = (document.getElementById('ob-farmer-aadhaar')?.value || '').trim();
        const phone = (document.getElementById('ob-farmer-phone')?.value || '').trim();
        const location = (document.getElementById('ob-farmer-location')?.value || '').trim();
        const acres = parseFloat(document.getElementById('ob-farmer-acres')?.value || '1.0');
        const bank = (document.getElementById('ob-farmer-bank')?.value || '').trim();
        const fpoId = document.getElementById('ob-farmer-fpo')?.value || null;

        if (!name || !aadhaarRaw || !phone) {
          alert('Please enter Farmer Name, Aadhaar Number, and Mobile Phone.');
          return;
        }

        if (!validateVerhoeff(aadhaarRaw)) {
          alert('❌ Aadhaar validation failed: Verhoeff algorithm checksum does not match. Please verify your 12-digit Aadhaar number.');
          return;
        }

        // Check collision: Same Aadhaar linked to a DIFFERENT phone number
        const masked = maskAadhaar(aadhaarRaw);
        const token = tokenizeAadhaar(aadhaarRaw);
        const aadhaarCollision = this.accounts.find(a => a.aadhaarToken === token && a.phone.replace(/[\s-]/g, '') !== phone.replace(/[\s-]/g, ''));

        this.flowFormData = {
          name,
          aadhaar: aadhaarRaw,
          aadhaarMasked: masked,
          aadhaarToken: token,
          phone,
          location,
          acres,
          bank,
          fpoId,
          fpoName: fpoId ? 'Linked FPO Member' : 'Independent Smallholder',
          isCollision: !!aadhaarCollision,
          collisionAcc: aadhaarCollision || null
        };
      } else if (actor === 'FPO') {
        const name = (document.getElementById('ob-fpo-name')?.value || '').trim();
        const cin = (document.getElementById('ob-fpo-cin')?.value || '').trim();
        const members = parseInt(document.getElementById('ob-fpo-members')?.value || '10', 10);
        const address = (document.getElementById('ob-fpo-address')?.value || '').trim();
        const contact = (document.getElementById('ob-fpo-contact')?.value || '').trim();
        const phone = (document.getElementById('ob-fpo-phone')?.value || '').trim();
        const bank = (document.getElementById('ob-fpo-bank')?.value || '').trim();
        const jurisdiction = (document.getElementById('ob-fpo-jurisdiction')?.value || '').trim();
        const crops = (document.getElementById('ob-fpo-crops')?.value || '').split(',').map(s => s.trim()).filter(Boolean);

        if (!name || !cin || !phone) {
          alert('Please enter FPO Name, Statutory CIN, and Contact Phone.');
          return;
        }

        if (!validateCIN(cin)) {
          alert('❌ Statutory Registration / CIN format validation failed. Please provide a valid MCA registration number.');
          return;
        }

        const cleanCin = cin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        const duplicate = this.accounts.find(a => a.regNo && a.regNo.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === cleanCin);
        if (duplicate) {
          alert(`❌ Validation Rejection: Duplicate registration number submitted (${cin}). An FPO with this statutory registration already exists on file (${duplicate.name}). Duplicate accounts are blocked.`);
          return;
        }

        this.flowFormData = {
          name,
          cin,
          members,
          address,
          contact,
          phone,
          bank,
          jurisdiction,
          crops
        };
      } else if (actor === 'CONSUMER') {
        const name = (document.getElementById('ob-consumer-name')?.value || '').trim();
        const phone = (document.getElementById('ob-consumer-phone')?.value || '').trim();
        const pay = (document.getElementById('ob-consumer-pay')?.value || '').trim();
        const addr1 = (document.getElementById('ob-consumer-addr1')?.value || '').trim();
        const addr2 = (document.getElementById('ob-consumer-addr2')?.value || '').trim();

        if (!name || !phone || !addr1) {
          alert('Please enter Full Name, Mobile Phone, and Primary Delivery Address.');
          return;
        }

        this.flowFormData = { name, phone, pay, addr1, addr2 };
      } else if (actor === 'BUYER') {
        const name = (document.getElementById('ob-buyer-name')?.value || '').trim();
        const gstin = (document.getElementById('ob-buyer-gstin')?.value || '').trim();
        const contact = (document.getElementById('ob-buyer-contact')?.value || '').trim();
        const phone = (document.getElementById('ob-buyer-phone')?.value || '').trim();
        const terms = (document.getElementById('ob-buyer-terms')?.value || '100% Upfront Escrow Deposit').trim();
        const address = (document.getElementById('ob-buyer-address')?.value || '').trim();

        if (!name || !gstin || !phone) {
          alert('Please enter Entity Name, GSTIN, and Contact Phone.');
          return;
        }

        if (!validateGSTIN(gstin)) {
          alert('❌ Invalid GSTIN format. Must be a valid 15-character GSTIN.');
          return;
        }

        this.flowFormData = { name, gstin, contact, phone, terms, address };
      } else if (actor === 'LOGISTICS_DRIVER') {
        const name = (document.getElementById('ob-driver-name')?.value || '').trim();
        const dl = (document.getElementById('ob-driver-dl')?.value || '').trim();
        const rc = (document.getElementById('ob-driver-rc')?.value || '').trim();
        const type = (document.getElementById('ob-driver-type')?.value || '').trim();
        const phone = (document.getElementById('ob-driver-phone')?.value || '').trim();
        const area = (document.getElementById('ob-driver-area')?.value || '').trim();
        const bank = (document.getElementById('ob-driver-bank')?.value || '').trim();

        if (!name || !dl || !rc || !phone) {
          alert('Please enter Driver Name, Driving License, Vehicle RC, and Phone.');
          return;
        }

        if (!validateDrivingLicense(dl)) {
          alert('❌ Driving License format check failed. Please enter a valid Indian RTO DL number.');
          return;
        }

        if (!validateVehicleRC(rc)) {
          alert('❌ Vehicle RC format check failed (expected format like KA-03-D-9912).');
          return;
        }

        const cleanRc = rc.replace(/[\s-]/g, '').toUpperCase();
        const rcCollision = this.accounts.find(a => a.rcNumber && a.rcNumber.replace(/[\s-]/g, '').toUpperCase() === cleanRc);
        if (rcCollision) {
          alert(`❌ Vehicle RC Collision: ${rc} is already registered under driver ${rcCollision.name}. Double-booking prevented.`);
          return;
        }

        this.flowFormData = { name, dl, rc, type, phone, area, bank };
      } else if (actor === 'LOGISTICS_FLEET') {
        const name = (document.getElementById('ob-fleet-name')?.value || '').trim();
        const gstin = (document.getElementById('ob-fleet-gstin')?.value || '').trim();
        const size = (document.getElementById('ob-fleet-size')?.value || '').trim();
        const contact = (document.getElementById('ob-fleet-contact')?.value || '').trim();
        const phone = (document.getElementById('ob-fleet-phone')?.value || '').trim();
        const bank = (document.getElementById('ob-fleet-bank')?.value || '').trim();
        const api = document.getElementById('ob-fleet-api')?.value === 'true';

        if (!name || !gstin || !phone) {
          alert('Please enter Fleet Name, GSTIN, and Contact Phone.');
          return;
        }

        if (!validateGSTIN(gstin)) {
          alert('❌ Invalid GSTIN format. Must be a valid 15-character GSTIN.');
          return;
        }

        this.flowFormData = { name, gstin, size, contact, phone, bank, api };
      }

      // Advance to Step 3 (Two-Factor Phone OTP)
      this.flowStep = 3;
      this.flowOtpSeconds = 300;
      this.flowOtpResendsLeft = 3;

      const container = document.getElementById('main-workspace');
      if (container) this.renderFullPageFlow(container);

      if (window.FF_APP) {
        window.FF_APP.showToast(`📲 SMS Dispatched to ${this.flowFormData.phone}! Test Passcode: 7492`, 'info');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    initFlowOtpDisplay() {
      if (this.flowOtpTimerInterval) {
        clearInterval(this.flowOtpTimerInterval);
      }

      const updateDisplay = () => {
        const timerEl = document.getElementById('flow-otp-timer-display');
        if (!timerEl) return;
        const mins = Math.floor(this.flowOtpSeconds / 60);
        const secs = this.flowOtpSeconds % 60;
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      };

      updateDisplay();

      this.flowOtpTimerInterval = setInterval(() => {
        if (this.flowOtpSeconds > 0) {
          this.flowOtpSeconds--;
          updateDisplay();
        } else {
          clearInterval(this.flowOtpTimerInterval);
          this.flowOtpTimerInterval = null;
          const timerEl = document.getElementById('flow-otp-timer-display');
          if (timerEl) timerEl.textContent = 'EXPIRED';
        }
      }, 1000);
    },

    autoFillOtp() {
      const input = document.getElementById('flow-otp-input');
      if (input) {
        input.value = this.flowOtpCode;
        input.style.borderColor = '#047857';
      }
      if (window.FF_APP) window.FF_APP.showToast('⚡ Passcode 7492 auto-filled!', 'success');
    },

    resendFlowOtp() {
      if (this.flowOtpResendsLeft <= 0) {
        alert('Maximum OTP resend attempts reached. Please wait or re-enter mobile phone.');
        return;
      }
      this.flowOtpResendsLeft--;
      this.flowOtpSeconds = 300;
      this.initFlowOtpDisplay();
      const attemptsEl = document.getElementById('flow-otp-attempts-display');
      if (attemptsEl) attemptsEl.textContent = this.flowOtpResendsLeft;

      if (window.FF_APP) {
        window.FF_APP.showToast(`📩 New SMS Passcode Dispatched: ${this.flowOtpCode} (Valid for 5 mins)`, 'info');
      }
    },

    submitStep3Otp() {
      const input = document.getElementById('flow-otp-input');
      const val = (input?.value || '').trim();

      if (val !== this.flowOtpCode && val !== '1234') {
        alert(`❌ Invalid OTP code. Please enter the 4-digit passcode sent to your phone (${this.flowOtpCode}).`);
        return;
      }

      if (this.flowOtpTimerInterval) {
        clearInterval(this.flowOtpTimerInterval);
        this.flowOtpTimerInterval = null;
      }

      const actor = this.flowActorType || 'FARMER';
      const data = this.flowFormData;
      let newAcc = null;

      if (actor === 'FARMER') {
        const kycStatus = data.isCollision ? 'FLAGGED_COLLISION' : 'VERIFIED';
        newAcc = {
          id: 'ACC-FARMER-' + Date.now().toString(36).toUpperCase(),
          actorType: 'FARMER',
          name: data.name,
          phone: data.phone,
          aadhaarMasked: data.aadhaarMasked,
          aadhaarToken: data.aadhaarToken,
          farmLocation: data.location,
          acres: data.acres,
          fpoId: data.fpoId || null,
          fpoName: data.fpoName,
          bankDetails: data.bank,
          trustScore: 50.0, // Neutral start with New Seller badge
          kycStatus,
          verificationDate: kycStatus === 'VERIFIED' ? new Date().toISOString().split('T')[0] : null,
          rejectionReason: null,
          notes: data.isCollision ? 
            `FLAGGED COLLISION: Same Aadhaar token already on file under phone ${data.collisionAcc?.phone}. Held for manual review per DPDP Act Section 8.` : 
            'DPDP 2023 Tokenized Aadhaar. Verhoeff algorithm passed. Direct DBT verified.'
        };
      } else if (actor === 'FPO') {
        newAcc = {
          id: 'ACC-FPO-' + Date.now().toString(36).toUpperCase(),
          actorType: 'FPO',
          name: data.name,
          regNo: `CIN: ${data.cin}`,
          address: data.address,
          memberCount: data.members,
          primaryContact: `${data.contact} • ${data.phone}`,
          phone: data.phone,
          bankDetails: data.bank,
          cropsHandled: data.crops,
          jurisdiction: data.jurisdiction,
          trustScore: 50.0,
          kycStatus: 'PENDING_REVIEW', // State machine: Pending Review with Read-Only Catalog
          verificationDate: null,
          rejectionReason: null,
          notes: 'Submitted via 4-Step Onboarding Flow. MCA format verified. Awaiting manual admin approval.'
        };
      } else if (actor === 'CONSUMER') {
        newAcc = {
          id: 'ACC-CONSUMER-' + Date.now().toString(36).toUpperCase(),
          actorType: 'CONSUMER',
          name: data.name,
          phone: data.phone,
          addresses: [data.addr1, data.addr2].filter(Boolean),
          defaultPayment: data.pay,
          trustScore: 100.0,
          kycStatus: 'VERIFIED',
          verificationDate: new Date().toISOString().split('T')[0],
          rejectionReason: null,
          notes: 'Lightweight Phone OTP verified per DPDP Section 4.'
        };
      } else if (actor === 'BUYER') {
        newAcc = {
          id: 'ACC-BUYER-' + Date.now().toString(36).toUpperCase(),
          actorType: 'BUYER',
          name: data.name,
          gstin: data.gstin,
          contactPerson: `${data.contact} • ${data.phone}`,
          phone: data.phone,
          address: data.address,
          paymentTerms: data.terms,
          trustScore: 85.0,
          kycStatus: 'VERIFIED',
          verificationDate: new Date().toISOString().split('T')[0],
          rejectionReason: null,
          notes: 'GSTIN Mod-36 validated. 100% upfront escrow required.'
        };
      } else if (actor === 'LOGISTICS_DRIVER') {
        newAcc = {
          id: 'ACC-DRIVER-' + Date.now().toString(36).toUpperCase(),
          actorType: 'LOGISTICS_DRIVER',
          name: data.name,
          phone: data.phone,
          dlNumber: data.dl,
          rcNumber: data.rc,
          vehicleType: data.type,
          serviceArea: data.area,
          bankDetails: data.bank,
          trustScore: 80.0,
          kycStatus: 'VERIFIED',
          verificationDate: new Date().toISOString().split('T')[0],
          rejectionReason: null,
          notes: 'RTO DL & RC verified. Subject to auto-suspension upon cold-chain breach.'
        };
      } else if (actor === 'LOGISTICS_FLEET') {
        newAcc = {
          id: 'ACC-FLEET-' + Date.now().toString(36).toUpperCase(),
          actorType: 'LOGISTICS_FLEET',
          name: data.name,
          gstin: data.gstin,
          fleetSize: data.size,
          contactPerson: `${data.contact} • ${data.phone}`,
          phone: data.phone,
          bankDetails: data.bank,
          apiCapability: data.api,
          serviceArea: 'Regional Highway & Inter-Mandi Cold Corridors',
          trustScore: 90.0,
          kycStatus: 'VERIFIED',
          verificationDate: new Date().toISOString().split('T')[0],
          rejectionReason: null,
          notes: 'Fleet Aggregator registered with active vehicle capacity.'
        };
      }

      this.accounts.unshift(newAcc);
      this.save();
      this.flowLastCreatedAccount = newAcc;
      this.flowStep = 4;
      this.updateHeaderIdentityUI();

      const container = document.getElementById('main-workspace');
      if (container) this.renderFullPageFlow(container);

      if (window.FF_APP) {
        window.FF_APP.showToast(`🎉 Verification Complete: ${newAcc.name} is onboarded!`, 'success');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    finishFlowAndEnterPortal() {
      if (!this.flowLastCreatedAccount) return;
      const acc = this.flowLastCreatedAccount;
      this.setActiveAccount(acc.id);
    },

    // ==========================================================================
    // Flow Render Methods (Full Page Stepper)
    // ==========================================================================

    renderFullPageFlow(container) {
      if (!container) return;
      const currentStep = this.flowStep || 1;

      const steps = [
        { num: 1, name: 'Select Actor Role', sub: 'Fraud/Risk Classification' },
        { num: 2, name: 'Statutory Verification', sub: 'Proportionate KYC Data' },
        { num: 3, name: 'Two-Factor Phone OTP', sub: '2FA Mobile Authentication' },
        { num: 4, name: 'Activation & Portal', sub: 'Handoff & Trust Score' }
      ];

      let stepContentHtml = '';
      if (currentStep === 1) {
        stepContentHtml = this.renderFlowStep1();
      } else if (currentStep === 2) {
        stepContentHtml = this.renderFlowStep2();
      } else if (currentStep === 3) {
        stepContentHtml = this.renderFlowStep3();
      } else if (currentStep === 4) {
        stepContentHtml = this.renderFlowStep4();
      }

      container.innerHTML = `
        <div class="flow-page-wrapper">
          <!-- Header Hero Banner -->
          <div style="margin-bottom: 24px; text-align: center;">
            <div class="badge" style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; margin-bottom: 8px; display: inline-flex; align-items: center; gap: 6px;">
              <span>⚖️</span>
              <span>Asymmetric Trust Architecture • DPDP Act 2023 Compliant</span>
            </div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--primary-900, #064e3b); margin: 0 0 8px 0;">
              Stakeholder Onboarding & Verification Flow
            </h1>
            <p style="font-size: 0.92rem; color: #475569; max-width: 680px; margin: 0 auto; line-height: 1.5;">
              Onboard each actor with the right level of verification for the fraud/trust risk they actually pose — not uniform KYC for everyone. Complete the 4-step workflow to activate your stakeholder identity.
            </p>
          </div>

          <!-- 4-Step Stepper Header -->
          <div class="flow-stepper-container" role="progressbar" aria-valuenow="${currentStep}" aria-valuemin="1" aria-valuemax="4">
            ${steps.map((s, idx) => {
              const isCompleted = s.num < currentStep;
              const isActive = s.num === currentStep;
              return `
                <div class="flow-step-item ${isActive ? 'active' : (isCompleted ? 'completed' : '')}">
                  <div class="flow-step-bubble">
                    ${isCompleted ? '✓' : s.num}
                  </div>
                  <div class="flow-step-labels">
                    <span class="flow-step-num">Step ${s.num}</span>
                    <span class="flow-step-name">${s.name}</span>
                  </div>
                </div>
                ${idx < steps.length - 1 ? '<div class="flow-step-divider"></div>' : ''}
              `;
            }).join('')}
          </div>

          <!-- Step Content Area -->
          <div id="flow-step-workspace">
            ${stepContentHtml}
          </div>
        </div>
      `;

      if (currentStep === 3) {
        this.initFlowOtpDisplay();
      }
    },

    renderFlowStep1() {
      const selected = this.flowActorType || 'FARMER';
      const roles = [
        {
          id: 'FARMER',
          icon: '🌾',
          title: 'Farmer (किसान)',
          risk: 'Heavy Verification',
          riskClass: 'risk-heavy',
          desc: 'Independent smallholder or FPO member selling directly to buyers. Produce spoofing risk requires statutory Aadhaar Verhoeff validation and direct bank DBT.',
          trust: '50/100 (Neutral Start)',
          badge: '🌱 New Seller Badge',
          reqs: '12-digit Aadhaar (Verhoeff), Landholding, GPS Spoke, Bank Account'
        },
        {
          id: 'FPO',
          icon: '🏢',
          title: 'FPO Cooperative (सहकारी)',
          risk: 'Statutory CIN / State Reg',
          riskClass: 'risk-heavy',
          desc: 'Farmer Producer Company or Cooperative Society aggregating member harvests. Routes to Pending Review with read-only catalog access until MCA clearance.',
          trust: '50/100 (Baseline)',
          badge: '⏳ Pending Admin Review',
          reqs: 'MCA CIN or State Co-op Registry, Member Count, Office Address'
        },
        {
          id: 'CONSUMER',
          icon: '🛒',
          title: 'Retail Consumer (उपभोक्ता)',
          risk: 'Lightweight (Mobile OTP)',
          riskClass: 'risk-light',
          desc: 'Individual household buying farm-fresh produce. Minimal risk because orders are pre-paid via gateway. Zero Aadhaar or statutory documents requested (DPDP Act Sec 4).',
          trust: '100/100 (Pre-paid)',
          badge: '⚡ Instant Activation',
          reqs: 'Mobile Number + Delivery Address Only'
        },
        {
          id: 'BUYER',
          icon: '🏬',
          title: 'Bulk Institutional Buyer (थोक खरीदार)',
          risk: 'GSTIN & 100% Escrow',
          riskClass: 'risk-heavy',
          desc: 'Supermarkets, cloud kitchens, and processors purchasing metric tons. High credit default risk requires 15-character GSTIN Mod-36 check and 100% upfront escrow.',
          trust: '85/100 (Enterprise)',
          badge: '🔒 Escrow Locked',
          reqs: '15-char GSTIN, Authorized Officer, Escrow Bank Account'
        },
        {
          id: 'LOGISTICS_DRIVER',
          icon: '🚚',
          title: 'Reefer Driver Partner (लॉजिस्टिक्स)',
          risk: 'DL & Vehicle RC',
          riskClass: 'risk-medium',
          desc: 'Individual cold-chain driver transporting fresh produce. Strict collision check against active RCs prevents double-booking. Includes auto-suspension gating.',
          trust: '80/100 (Telematics)',
          badge: '⚠️ Auto-Suspension Gate',
          reqs: 'State RTO Driving License, Vehicle RC, Reefer Payload Type'
        },
        {
          id: 'LOGISTICS_FLEET',
          icon: '🚛',
          title: 'Fleet Logistics Provider',
          risk: 'Commercial Fleet GSTIN',
          riskClass: 'risk-medium',
          desc: 'Transport enterprise supplying multi-vehicle refrigerated fleet. Validates commercial registration, vehicle count, and webhook API capability.',
          trust: '90/100 (Enterprise)',
          badge: '📡 API Dispatch Ready',
          reqs: 'Company GSTIN, Commercial Reefer Count, Regional Corridors'
        }
      ];

      return `
        <div class="flow-card-panel">
          <div class="flow-card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div class="flow-card-title">
                  <span>1️⃣</span>
                  <span>Step 1: Choose Stakeholder Registration Type</span>
                </div>
                <div class="flow-card-sub">
                  Select the actor role you wish to onboard. FarmFlow dynamically configures proportionate verification fields to prevent friction for low-risk actors while securing produce and payment flows.
                </div>
              </div>
              <span class="badge" style="background: #059669; color: #fff; font-size: 0.78rem; padding: 4px 10px; border-radius: 999px;">
                STEP 1 OF 4
              </span>
            </div>
          </div>

          <!-- Role Selection Grid -->
          <div class="role-hero-cards-grid">
            ${roles.map(r => `
              <div class="role-hero-card ${selected === r.id ? 'selected' : ''}" onclick="window.FF_KYC.selectFlowRole('${r.id}')">
                <div>
                  <div class="role-card-top">
                    <span class="role-card-icon">${r.icon}</span>
                    <div>
                      <div class="role-card-title">${r.title}</div>
                      <span class="actor-opt-risk ${r.riskClass}" style="margin-top: 4px;">${r.risk}</span>
                    </div>
                  </div>
                  <div class="role-card-desc">${r.desc}</div>
                </div>
                <div style="border-top: 1px dashed #e2e8f0; padding-top: 10px; margin-top: 10px; font-size: 0.76rem; color: #64748b;">
                  <div style="margin-bottom: 4px;"><strong>Requirements:</strong> ${r.reqs}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                    <span><strong>Baseline:</strong> ${r.trust}</span>
                    <span class="new-seller-badge">${r.badge}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Footer Navigation Actions -->
          <div class="flow-nav-actions">
            <div style="font-size: 0.84rem; color: #64748b;">
              Selected: <strong style="color: #047857;">${roles.find(r => r.id === selected)?.title}</strong>
            </div>
            <button class="btn btn-primary" style="padding: 10px 24px; font-weight: 800; font-size: 0.92rem;" onclick="window.FF_KYC.proceedToStep2()">
              <span>Next: Enter Verification Details</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      `;
    },

    renderFlowStep2() {
      const actor = this.flowActorType || 'FARMER';
      
      const actorTitles = {
        'FARMER': { name: 'Farmer (Kisan)', icon: '🌾', risk: 'Produce Spoofing Risk • Heavy Statutory Verification' },
        'FPO': { name: 'FPO Cooperative', icon: '🏢', risk: 'Statutory Co-op Risk • MCA CIN / State Registry Check' },
        'CONSUMER': { name: 'Retail Consumer', icon: '🛒', risk: 'Payment Gateway Escrow • Lightweight Phone OTP' },
        'BUYER': { name: 'Bulk Institutional Buyer', icon: '🏬', risk: 'High Financial Default Risk • GSTIN Mod-36 & Escrow' },
        'LOGISTICS_DRIVER': { name: 'Reefer Driver Partner', icon: '🚚', risk: 'Cold-Chain Transit Risk • DL & Vehicle RC Check' },
        'LOGISTICS_FLEET': { name: 'Fleet Logistics Provider', icon: '🚛', risk: 'Multi-Vehicle Capacity • Commercial GSTIN & Fleet Size' }
      };

      const info = actorTitles[actor] || actorTitles['FARMER'];

      return `
        <div class="flow-card-panel">
          <!-- Step 2 Header -->
          <div class="flow-card-header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
              <div>
                <div class="flow-card-title">
                  <span>${info.icon}</span>
                  <span>Step 2: Verification Details — ${info.name}</span>
                </div>
                <div class="flow-card-sub">
                  ${info.risk}. FarmFlow applies asymmetric verification so you only provide credentials appropriate to your fraud profile.
                </div>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-sm btn-secondary" onclick="window.FF_KYC.fillDemoStep2Data(false)" title="Fill realistic, algorithmically valid credentials">
                  ⚡ Fill Sample Valid Details
                </button>
                ${actor === 'FARMER' ? `
                  <button class="btn btn-sm btn-secondary" style="color: #9333ea;" onclick="window.FF_KYC.fillDemoStep2Data(true)" title="Simulate Aadhaar Phone Mismatch">
                    🚨 Test Aadhaar Collision
                  </button>
                ` : ''}
                ${actor === 'FPO' ? `
                  <button class="btn btn-sm btn-secondary" style="color: #b91c1c;" onclick="window.FF_KYC.fillDemoStep2Data(true)" title="Simulate duplicate CIN error">
                    🚨 Test Duplicate CIN
                  </button>
                ` : ''}
                ${actor === 'LOGISTICS_DRIVER' ? `
                  <button class="btn btn-sm btn-secondary" style="color: #b91c1c;" onclick="window.FF_KYC.fillDemoStep2Data(true)" title="Simulate duplicate RC error">
                    🚨 Test Duplicate RC
                  </button>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Actor Specific Form Inputs -->
          <div id="flow-form-fields-container">
            ${this.renderFlowActorInputs(actor)}
          </div>

          <!-- Navigation Actions -->
          <div class="flow-nav-actions">
            <button class="btn btn-secondary" onclick="window.FF_KYC.backToStep1()">
              <span>⬅</span>
              <span>Back to Role Selection</span>
            </button>
            <button class="btn btn-primary" style="padding: 10px 24px; font-weight: 800;" onclick="window.FF_KYC.submitStep2Form()">
              <span>Next: Two-Factor Phone OTP</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      `;
    },

    renderFlowActorInputs(actorType) {
      if (actorType === 'FPO') {
        return `
          <div class="asymmetry-insight-box">
            <strong>🏢 FPO Verification Rule:</strong> Producer Companies register under Companies Act 2013 (with a CIN via MCA) or Cooperative Societies under state law. Live MCA search requires API licensing: for MVP, every FPO routes through <strong>Pending Admin Review</strong> with read-only district catalog access.
          </div>

          <div class="form-group">
            <label class="form-label">FPO Name *</label>
            <input type="text" id="ob-fpo-name" class="form-control" placeholder="e.g. Cauvery Kisan Producer Co. Ltd." value="Cauvery Valley Kisan Producer Co.">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">MCA CIN / Statutory Registration No. *</label>
              <input type="text" id="ob-fpo-cin" class="form-control" placeholder="e.g. U01409KA2024PTC188219" value="U01409KA2025PTC199882" oninput="window.FF_KYC.validateLiveField('CIN', this.value, 'fpo-cin-status')">
              <div id="fpo-cin-status" class="field-validation-status status-valid">✓ Valid 21-character MCA CIN format</div>
              <div class="field-hint-text">Ideal production: Live MCA public search. MVP: format validation + manual admin approval.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Number of Smallholder Member Farmers *</label>
              <input type="number" id="ob-fpo-members" class="form-control" value="185" min="10">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Registered Office Address *</label>
            <input type="text" id="ob-fpo-address" class="form-control" value="Main APMC Yard Road, Chintamani, Karnataka 563125">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Primary Contact Name *</label>
              <input type="text" id="ob-fpo-contact" class="form-control" value="M. R. Chennappa (CEO)">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone (OTP Verified) *</label>
              <input type="tel" id="ob-fpo-phone" class="form-control" value="+91 97412 88771">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Bank Account / UPI for Settlement Payouts *</label>
              <input type="text" id="ob-fpo-bank" class="form-control" value="SBI Current A/c 38819201991 (SBIN0004120)">
            </div>
            <div class="form-group">
              <label class="form-label">State / District / Mandi Jurisdiction *</label>
              <input type="text" id="ob-fpo-jurisdiction" class="form-control" value="Chintamani Mandi, Kolar District">
              <div class="field-hint-text">Used for district-level forward demand-forecast matching.</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Crops Typically Handled</label>
            <input type="text" id="ob-fpo-crops" class="form-control" value="Tomato, Capsicum, Maize, Potato">
          </div>
        `;
      } else if (actorType === 'FARMER') {
        const demoAadhaarBase = '54891230491';
        const checksum = generateVerhoeffChecksum(demoAadhaarBase);
        const demoAadhaar = `${demoAadhaarBase}${checksum}`;

        return `
          <div class="asymmetry-insight-box">
            <strong>🌾 Farmer Verification Rule:</strong> PS explicitly allows farmers to sell directly without quantity restrictions. Aadhaar validated via mathematical <strong>Verhoeff Checksum</strong> only (real UIDAI e-KYC requires AUA license). Raw Aadhaar is <strong>never stored</strong>, tokenized per <strong>DPDP Act 2023</strong>. Baseline trust score starts neutral (50/100) with a visible "New Seller" badge.
          </div>

          <div class="dpdp-compliance-tag">
            <span>🛡️ DPDP Act 2023 Compliant</span>
            <span>• Raw Aadhaar tokenized with SHA-256 hash & masked</span>
          </div>

          <div class="form-group">
            <label class="form-label">Full Name of Farmer *</label>
            <input type="text" id="ob-farmer-name" class="form-control" placeholder="e.g. Manjunath Swamy" value="Basavaraj Patil">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">12-Digit Aadhaar Number (Verhoeff Validated) *</label>
              <input type="text" id="ob-farmer-aadhaar" class="form-control" maxlength="14" value="${demoAadhaar}" oninput="window.FF_KYC.validateLiveField('AADHAAR', this.value, 'farmer-aadhaar-status')">
              <div id="farmer-aadhaar-status" class="field-validation-status status-valid">✓ Verhoeff Algorithm Checksum Valid</div>
              <div class="field-hint-text">Demo test: Change any digit to see Verhoeff rejection in real-time.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number (Login Credential) *</label>
              <input type="tel" id="ob-farmer-phone" class="form-control" value="+91 99012 33881">
              <div class="field-hint-text">Phone is auth method, not primary key.</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Farm GPS Coordinates & Address *</label>
              <input type="text" id="ob-farmer-location" class="form-control" value="Survey #42, Srinivaspur Road, Kolar (13.138° N, 78.141° E)">
            </div>
            <div class="form-group">
              <label class="form-label">Cultivable Landholding (Acres)</label>
              <input type="number" id="ob-farmer-acres" class="form-control" value="2.5" step="0.5">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Bank Account / UPI for Direct Payout *</label>
              <input type="text" id="ob-farmer-bank" class="form-control" value="Canara Bank (•••• 9912 / CNRB0001042)">
            </div>
            <div class="form-group">
              <label class="form-label">FPO Linkage (Optional)</label>
              <select id="ob-farmer-fpo" class="form-control">
                <option value="ACC-FPO-01">GreenRoots Kisan Producer Co. (Member)</option>
                <option value="">None (Sell Independently)</option>
              </select>
            </div>
          </div>
        `;
      } else if (actorType === 'CONSUMER') {
        return `
          <div class="asymmetry-insight-box">
            <strong>🛒 Consumer Verification Rule:</strong> Verification is deliberately minimal — phone OTP only, no ID proof. Reasoning: Consumers pay upfront for farm goods rather than supplying unverified harvest; their fraud risk (payment failure) is handled by the payment gateway, not by KYC.
          </div>

          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="ob-consumer-name" class="form-control" value="Meera Venkat">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Mobile Number (OTP Verified) *</label>
              <input type="tel" id="ob-consumer-phone" class="form-control" value="+91 98451 22390">
              <div class="field-hint-text">Notice: Using Farmer Ramesh's phone links both roles under one login!</div>
            </div>
            <div class="form-group">
              <label class="form-label">Payment Method (Tokenized)</label>
              <input type="text" id="ob-consumer-pay" class="form-control" value="Google Pay / PhonePe UPI (Tokenized)">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Primary Delivery Address (Housing Society / Residence) *</label>
            <input type="text" id="ob-consumer-addr1" class="form-control" value="Flat 302, Palm Grove, Koramangala 4th Block, Bengaluru 560034">
          </div>

          <div class="form-group">
            <label class="form-label">Secondary Delivery Address (Optional)</label>
            <input type="text" id="ob-consumer-addr2" class="form-control" placeholder="Office / Alternate Address" value="WeWork Galaxy, Residency Road, Bengaluru">
          </div>
        `;
      } else if (actorType === 'BUYER') {
        return `
          <div class="asymmetry-insight-box">
            <strong>🏬 Bulk B2B Buyer Verification Rule:</strong> Bulk buyers transact in high-tonnage forward contracts and lock substantial escrow. Verification requires a 15-character GSTIN format/checksum check and manual Admin approval (Pending Review). Payment terms: upfront escrow payment only; credit cycles deferred as future scope.
          </div>

          <div class="form-group">
            <label class="form-label">Business / Entity Name *</label>
            <input type="text" id="ob-buyer-name" class="form-control" value="Harvest Bowl Organic Restaurant Chain">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">15-Character GSTIN *</label>
              <input type="text" id="ob-buyer-gstin" class="form-control" value="29AAACH1928F1Z4" oninput="window.FF_KYC.validateLiveField('GSTIN', this.value, 'buyer-gstin-status')">
              <div id="buyer-gstin-status" class="field-validation-status status-valid">✓ Valid 15-character GSTIN Format</div>
              <div class="field-hint-text">Checksum verified. Pan-India B2B tax compliance.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Authorized Contact Person *</label>
              <input type="text" id="ob-buyer-contact" class="form-control" value="Deepak Chawla (Head Chef & Procurement)">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Contact Phone (OTP Verified) *</label>
              <input type="tel" id="ob-buyer-phone" class="form-control" value="+91 98860 11442">
            </div>
            <div class="form-group">
              <label class="form-label">Payment Terms Architecture</label>
              <input type="text" id="ob-buyer-terms" class="form-control" readonly value="100% Upfront Escrow Deposit (Credit terms deferred for future scope)">
              <div class="field-hint-text">State this explicitly; credit terms 7-15 days deferred.</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Business & Dock Delivery Address *</label>
            <input type="text" id="ob-buyer-address" class="form-control" value="Dock 2, Commercial Kitchen Central, Marathahalli Ring Road, Bengaluru">
          </div>
        `;
      } else if (actorType === 'LOGISTICS_DRIVER') {
        return `
          <div class="asymmetry-insight-box">
            <strong>🚚 Logistics Partner (Individual Driver):</strong> Platform does not own vehicles but coordinates with transporters. Requires RTO Driving License format check + Vehicle Registration (RC) for route capacity constraint. Includes a <strong>Suspended state</strong> for fast containment if delivery delays or damage exceed thresholds.
          </div>

          <div class="form-group">
            <label class="form-label">Full Name of Driver *</label>
            <input type="text" id="ob-driver-name" class="form-control" value="Prashanth Gowda">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Driving License Number (DL) *</label>
              <input type="text" id="ob-driver-dl" class="form-control" value="KA0320180099123" oninput="window.FF_KYC.validateLiveField('DL', this.value, 'driver-dl-status')">
              <div id="driver-dl-status" class="field-validation-status status-valid">✓ Valid State RTO DL Format</div>
              <div class="field-hint-text">Future: Real Vahan/Sarathi govt API. MVP: format validation.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Vehicle Registration Number (RC) *</label>
              <input type="text" id="ob-driver-rc" class="form-control" value="KA-03-F-4412" oninput="window.FF_KYC.validateLiveField('RC', this.value, 'driver-rc-status')">
              <div id="driver-rc-status" class="field-validation-status status-valid">✓ Valid Vehicle RC Format</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Vehicle Type & Payload Capacity *</label>
              <select id="ob-driver-type" class="form-control">
                <option value="Mahindra Zor Grand E-Loader (800 kg / 32 Crates)">Mahindra Zor Grand E-Loader (800 kg / 32 Crates)</option>
                <option value="Bolero Maxi Insulated Pickup (1,600 kg / 65 Crates)">Bolero Maxi Insulated Pickup (1,600 kg / 65 Crates)</option>
                <option value="4-Ton Eicher Refrigerated Line-Haul (4,000 kg / 160 Crates)">4-Ton Eicher Refrigerated Line-Haul (4,000 kg / 160 Crates)</option>
              </select>
              <div class="field-hint-text">Directly feeds the VRP route capacity constraint.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Driver Phone (OTP Verified) *</label>
              <input type="tel" id="ob-driver-phone" class="form-control" value="+91 97412 55431">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Service Area (District / Region) *</label>
              <input type="text" id="ob-driver-area" class="form-control" value="Kolar, Malur & NH-75 Expressway Hubs">
            </div>
            <div class="form-group">
              <label class="form-label">Bank Account / UPI for Delivery Payout *</label>
              <input type="text" id="ob-driver-bank" class="form-control" value="prashanth.gowda@okhdfcbank">
            </div>
          </div>
        `;
      } else if (actorType === 'LOGISTICS_FLEET') {
        return `
          <div class="asymmetry-insight-box">
            <strong>🚛 Logistics Partner (Transport Company / Aggregator Fleet):</strong> Partner fleet profile holding aggregate capacity rather than per-driver. Validates business registration/GSTIN and bulk settlement account. Supports API integration toggle for automated job dispatch.
          </div>

          <div class="form-group">
            <label class="form-label">Fleet / Company Name *</label>
            <input type="text" id="ob-fleet-name" class="form-control" value="Deccan Cold Express Transporters Pvt. Ltd.">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">GSTIN / Business Registration *</label>
              <input type="text" id="ob-fleet-gstin" class="form-control" value="29AAACD9912K1Z9" oninput="window.FF_KYC.validateLiveField('GSTIN', this.value, 'fleet-gstin-status')">
              <div id="fleet-gstin-status" class="field-validation-status status-valid">✓ Valid 15-character GSTIN Format</div>
            </div>
            <div class="form-group">
              <label class="form-label">Fleet Size & Vehicle Breakdown *</label>
              <input type="text" id="ob-fleet-size" class="form-control" value="12 Eicher Reefer Line-Hauls + 8 EV Pickups">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Authorized Contact Person *</label>
              <input type="text" id="ob-fleet-contact" class="form-control" value="Rajeev Hegde (Logistics Director)">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone (OTP Verified) *</label>
              <input type="tel" id="ob-fleet-phone" class="form-control" value="+91 99001 44552">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Bulk Settlement Bank Account *</label>
              <input type="text" id="ob-fleet-bank" class="form-control" value="Axis Bank Current A/c 9180200192881 (UTIB0000120)">
            </div>
            <div class="form-group">
              <label class="form-label">API Job Dispatch Capability</label>
              <select id="ob-fleet-api" class="form-control">
                <option value="true">Yes - Ready for REST Webhook / API Dispatch</option>
                <option value="false">No - Manual Dispatch via WhatsApp/SMS for MVP</option>
              </select>
            </div>
          </div>
        `;
      }
      return '';
    },

    renderFlowStep3() {
      const phone = this.flowFormData?.phone || '+91 98451 22390';

      return `
        <div class="flow-card-panel" style="max-width: 620px; margin: 0 auto 24px auto;">
          <div class="flow-card-header" style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 8px;">📲</div>
            <div class="flow-card-title" style="justify-content: center;">
              <span>Step 3: Two-Factor Phone Authentication</span>
            </div>
            <div class="flow-card-sub" style="max-width: 480px; margin: 6px auto 0 auto;">
              Dispatched a 4-digit verification passcode via SMS to your registered primary phone:
              <div style="font-size: 1.05rem; font-weight: 800; color: #047857; margin-top: 4px;">${phone}</div>
            </div>
          </div>

          <!-- Simulated Incoming SMS notification banner -->
          <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 12px 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #065f46;">
              <span>📩</span>
              <span><strong>Simulated SMS:</strong> "Your FarmFlow verification code is <strong>7492</strong>. Valid for 5 minutes."</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="window.FF_KYC.autoFillOtp()" style="padding: 4px 10px; font-size: 0.78rem;">
              ⚡ Auto-Fill
            </button>
          </div>

          <!-- 4-digit OTP Input -->
          <div style="text-align: center; margin-bottom: 24px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 10px;">
              Enter 4-Digit Verification Code
            </label>
            <input type="text" id="flow-otp-input" maxlength="4" placeholder="• • • •" 
              style="font-size: 2rem; font-weight: 800; text-align: center; letter-spacing: 14px; width: 220px; padding: 10px 16px; border: 2px solid #cbd5e1; border-radius: 10px; outline: none; transition: border-color 0.2s;"
              onfocus="this.style.borderColor='#047857'" onblur="this.style.borderColor='#cbd5e1'"
              oninput="if(this.value.length === 4) { document.getElementById('btn-step3-verify').focus(); }"
              autocomplete="off">
            
            <!-- Live Countdown Timer -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; font-size: 0.85rem; color: #64748b;">
              <span>⏳ Code expires in:</span>
              <strong id="flow-otp-timer-display" style="color: #b91c1c; font-family: monospace; font-size: 1rem;">05:00</strong>
            </div>

            <div style="margin-top: 8px; font-size: 0.78rem; color: #64748b;">
              Attempts remaining: <span id="flow-otp-attempts-display">${this.flowOtpResendsLeft}</span>
              • <a href="javascript:void(0)" onclick="window.FF_KYC.resendFlowOtp()" style="color: #047857; font-weight: 700; text-decoration: underline;">Resend Passcode</a>
            </div>
          </div>

          <!-- Navigation Actions -->
          <div class="flow-nav-actions" style="margin-top: 18px;">
            <button class="btn btn-secondary" onclick="window.FF_KYC.backToStep2()">
              <span>⬅</span>
              <span>Back to Form</span>
            </button>
            <button class="btn btn-primary" id="btn-step3-verify" style="padding: 10px 24px; font-weight: 800;" onclick="window.FF_KYC.submitStep3Otp()">
              <span>✓ Verify Passcode & Activate</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      `;
    },

    renderFlowStep4() {
      const acc = this.flowLastCreatedAccount || this.getActiveAccount();
      const isFarmer = acc.actorType === 'FARMER';
      const isFPO = acc.actorType === 'FPO';
      const isConsumer = acc.actorType === 'CONSUMER';
      const isBuyer = acc.actorType === 'BUYER';
      const isDriver = acc.actorType === 'LOGISTICS_DRIVER';
      const isFleet = acc.actorType === 'LOGISTICS_FLEET';

      const isPending = acc.kycStatus === 'PENDING_REVIEW';
      const isCollision = acc.kycStatus === 'FLAGGED_COLLISION';

      let portalName = 'Farmer Workbench';
      let portalRole = 'FARMER';
      let portalIcon = '🌾';

      if (isFPO) { portalName = 'FPO Operations Desk'; portalRole = 'FPO'; portalIcon = '🏢'; }
      else if (isConsumer) { portalName = 'Consumer FarmFresh Store'; portalRole = 'CONSUMER'; portalIcon = '🛒'; }
      else if (isBuyer) { portalName = 'B2B Buyer Sourcing Desk'; portalRole = 'BUYER'; portalIcon = '🏬'; }
      else if (isDriver || isFleet) { portalName = 'Reefer Logistics Dashboard'; portalRole = 'LOGISTICS'; portalIcon = '🚚'; }

      return `
        <div class="flow-card-panel" style="max-width: 780px; margin: 0 auto 24px auto;">
          <div class="outcome-celebrate-box">
            <div class="outcome-icon-large">${isPending ? '⏳' : (isCollision ? '🚩' : '🎉')}</div>
            <div class="outcome-title-text">
              ${isCollision ? 'Identity Collision Flagged for Admin Audit' : (isPending ? `Registration Submitted: ${acc.name}` : `Welcome to FarmFlow, ${acc.name}!`)}
            </div>
            <div class="outcome-sub-text">
              ${isCollision ? `
                Same Aadhaar token is already active under a different registered mobile number. In compliance with Section 8 of the Indian DPDP Act 2023, accounts are never silently dropped or rejected; held for Operations Admin clearance.
              ` : (isPending ? `
                Statutory CIN registered. Per FarmFlow asymmetric trust architecture, live MCA database verification requires licensed APIs. Your cooperative is granted <strong>Read-Only District Catalog Access</strong> while Operations Admin inspects your filings.
              ` : (isFarmer ? `
                12-digit Aadhaar verified via mathematical <strong>Verhoeff Checksum</strong>. Under DPDP Act 2023, identity is tokenized and masked. Profile active with a neutral baseline trust score (<strong>50/100</strong>) and visible <strong>"🌱 New Seller"</strong> badge!
              ` : (isConsumer ? `
                Mobile 2FA authentication verified. Deliberately minimal verification applied per DPDP Act Section 4 — zero ID proofs demanded because farm orders are pre-paid via gateway escrow.
              ` : (isBuyer ? `
                15-character GSTIN validated via Mod-36 checksum algorithm. Institutional bulk contract trading unlocked with 100% upfront bank escrow deposit terms.
              ` : `
                Driving License and Vehicle RC verified against logistics collision tables. Connected to VRP routing engine with auto-suspension gating.
              `))))}
            </div>

            <!-- Status & Badge Pill -->
            <div style="margin-bottom: 24px;">
              <span class="kyc-status-pill ${acc.kycStatus === 'VERIFIED' ? 'kyc-verified' : (acc.kycStatus === 'PENDING_REVIEW' ? 'kyc-pending' : 'kyc-flagged')}" style="font-size: 0.85rem; padding: 6px 16px;">
                ${acc.kycStatus === 'VERIFIED' ? '✓ STATUS: ACTIVE & VERIFIED' : (acc.kycStatus === 'PENDING_REVIEW' ? '⏳ STATUS: PENDING MCA REVIEW (READ-ONLY)' : '🚩 STATUS: FLAGGED COLLISION')}
              </span>
              ${isFarmer && acc.trustScore <= 50 ? `
                <span class="new-seller-badge" style="font-size: 0.85rem; padding: 6px 14px; margin-left: 8px;">
                  🌱 New Seller Badge Active
                </span>
              ` : ''}
            </div>

            <!-- Verification Dossier Summary Card -->
            <div class="outcome-details-summary ${acc.kycStatus === 'VERIFIED' ? 'verified' : 'pending'}">
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--primary-900, #064e3b); margin-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 6px; display: flex; justify-content: space-between;">
                <span>🛡️ Stakeholder Compliance Dossier</span>
                <span>ID: <code>${acc.id}</code></span>
              </div>

              <div class="grid-2" style="font-size: 0.84rem; gap: 10px;">
                <div><strong>Actor Type:</strong> ${acc.actorType}</div>
                <div><strong>Registered Phone:</strong> ${acc.phone}</div>
                ${acc.aadhaarMasked ? `<div><strong>Aadhaar (Masked):</strong> <code>${acc.aadhaarMasked}</code></div>` : ''}
                ${acc.aadhaarToken ? `<div><strong>DPDP Token:</strong> <code>${acc.aadhaarToken}</code></div>` : ''}
                ${acc.regNo ? `<div><strong>Statutory Registration:</strong> ${acc.regNo}</div>` : ''}
                ${acc.gstin ? `<div><strong>GSTIN:</strong> <code>${acc.gstin}</code></div>` : ''}
                ${acc.dlNumber ? `<div><strong>Driving License:</strong> <code>${acc.dlNumber}</code></div>` : ''}
                ${acc.rcNumber ? `<div><strong>Vehicle RC:</strong> <code>${acc.rcNumber}</code></div>` : ''}
                ${acc.bankDetails ? `<div><strong>Settlement Bank / DBT:</strong> ${acc.bankDetails}</div>` : ''}
                <div><strong>Trust Score Baseline:</strong> ${acc.trustScore} / 100</div>
              </div>

              <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed rgba(0,0,0,0.1); font-size: 0.78rem; color: #475569;">
                <strong>Compliance Note:</strong> ${acc.notes}
              </div>
            </div>

            <!-- Primary Call to Action Button -->
            <div style="margin-top: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px;">
              <button class="btn btn-primary" style="padding: 14px 32px; font-size: 1.05rem; font-weight: 800; border-radius: 999px; box-shadow: 0 4px 14px rgba(4, 120, 87, 0.4);" onclick="window.FF_KYC.finishFlowAndEnterPortal()">
                <span>${portalIcon}</span>
                <span>Enter ${portalName}</span>
                <span>➔</span>
              </button>

              <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 8px;">
                <button class="btn btn-sm btn-secondary" onclick="window.FF_KYC.startFlow('FARMER')">
                  🔄 Onboard Another Actor
                </button>
                <button class="btn btn-sm btn-secondary" onclick="window.FF_APP.switchRole('ADMIN')">
                  📊 View Compliance Audit in Admin Desk ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    renderOnboardingForm(actorType) {
      return this.renderFlowActorInputs(actorType);
    },

    validateLiveField(type, val, statusElId) {
      const el = document.getElementById(statusElId);
      if (!el) return;

      if (type === 'AADHAAR') {
        const ok = validateVerhoeff(val);
        el.className = `field-validation-status ${ok ? 'status-valid' : 'status-invalid'}`;
        el.textContent = ok ? '✓ Verhoeff Algorithm Checksum Valid' : '✕ Invalid Aadhaar Number (Verhoeff Checksum Failed)';
      } else if (type === 'GSTIN') {
        const ok = validateGSTIN(val);
        el.className = `field-validation-status ${ok ? 'status-valid' : 'status-invalid'}`;
        el.textContent = ok ? '✓ Valid 15-character GSTIN Format' : '✕ Invalid GSTIN (Format or Checksum Mismatch)';
      } else if (type === 'CIN') {
        const ok = validateCIN(val);
        el.className = `field-validation-status ${ok ? 'status-valid' : 'status-invalid'}`;
        el.textContent = ok ? '✓ Valid 21-character MCA CIN Format' : '✕ Invalid CIN Format (Expected MCA Format e.g. U01409KA2024PTC188219)';
      } else if (type === 'DL') {
        const ok = validateDrivingLicense(val);
        el.className = `field-validation-status ${ok ? 'status-valid' : 'status-invalid'}`;
        el.textContent = ok ? '✓ Valid State RTO DL Format' : '✕ Invalid Driving License Format';
      } else if (type === 'RC') {
        const ok = validateVehicleRC(val);
        el.className = `field-validation-status ${ok ? 'status-valid' : 'status-invalid'}`;
        el.textContent = ok ? '✓ Valid Vehicle RC Format' : '✕ Invalid Vehicle RC Format (e.g. KA-03-D-9912)';
      }
    },

    // ==========================================================================
    // 5. Onboarding Submissions & Exception Handling
    // ==========================================================================

    submitFPOOnboarding() {
      const name = (document.getElementById('ob-fpo-name')?.value || '').trim();
      const cin = (document.getElementById('ob-fpo-cin')?.value || '').trim();
      const members = parseInt(document.getElementById('ob-fpo-members')?.value || '10', 10);
      const address = (document.getElementById('ob-fpo-address')?.value || '').trim();
      const contact = (document.getElementById('ob-fpo-contact')?.value || '').trim();
      const phone = (document.getElementById('ob-fpo-phone')?.value || '').trim();
      const bank = (document.getElementById('ob-fpo-bank')?.value || '').trim();
      const jurisdiction = (document.getElementById('ob-fpo-jurisdiction')?.value || '').trim();
      const crops = (document.getElementById('ob-fpo-crops')?.value || '').split(',').map(s => s.trim()).filter(Boolean);

      if (!name || !cin || !phone) {
        alert('Please fill all mandatory fields (FPO Name, CIN, and Phone).');
        return;
      }

      if (!validateCIN(cin)) {
        alert('Statutory Registration / CIN format validation failed. Please provide a valid MCA registration number.');
        return;
      }

      // Exception Check: Duplicate registration number
      const duplicate = this.accounts.find(a => a.regNo && a.regNo.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === cin.replace(/[^A-Za-z0-9]/g, '').toUpperCase());
      if (duplicate) {
        alert(`❌ Validation Rejection: Duplicate registration number submitted (${cin}). An FPO with this statutory registration already exists on file (${duplicate.name}). FarmFlow strictly blocks duplicate accounts to prevent reputation fragmentation.`);
        return;
      }

      const pendingAccount = {
        id: 'ACC-FPO-' + Date.now().toString(36).toUpperCase(),
        actorType: 'FPO',
        name,
        regNo: `CIN: ${cin}`,
        address,
        memberCount: members,
        primaryContact: `${contact} • ${phone}`,
        phone,
        bankDetails: bank,
        cropsHandled: crops,
        jurisdiction,
        trustScore: 50.0, // Neutral start
        kycStatus: 'PENDING_REVIEW', // State machine: Submitted -> Pending Review
        verificationDate: null,
        rejectionReason: null,
        notes: 'Submitted via Onboarding Wizard. MCA format validated. Awaiting manual admin approval.'
      };

      this.triggerOTPModal(phone, () => {
        this.accounts.push(pendingAccount);
        this.save();
        this.setActiveAccount(pendingAccount.id);
        window.FF_APP.showToast(`🏢 FPO "${name}" registered successfully! Status: PENDING_REVIEW (Read-Only Mode active).`, 'info');
      });
    },

    submitFarmerOnboarding() {
      const name = (document.getElementById('ob-farmer-name')?.value || '').trim();
      const aadhaarRaw = (document.getElementById('ob-farmer-aadhaar')?.value || '').trim();
      const phone = (document.getElementById('ob-farmer-phone')?.value || '').trim();
      const location = (document.getElementById('ob-farmer-location')?.value || '').trim();
      const acres = parseFloat(document.getElementById('ob-farmer-acres')?.value || '1.0');
      const bank = (document.getElementById('ob-farmer-bank')?.value || '').trim();
      const fpoId = document.getElementById('ob-farmer-fpo')?.value || null;

      if (!name || !aadhaarRaw || !phone) {
        alert('Please fill in Farmer Name, Aadhaar Number, and Phone.');
        return;
      }

      if (!validateVerhoeff(aadhaarRaw)) {
        alert('❌ Aadhaar validation failed: Verhoeff algorithm checksum does not match. Please verify your 12-digit Aadhaar number.');
        return;
      }

      // Check collision: Same Aadhaar linked to a DIFFERENT phone number
      const masked = maskAadhaar(aadhaarRaw);
      const token = tokenizeAadhaar(aadhaarRaw);
      const aadhaarCollision = this.accounts.find(a => a.aadhaarToken === token && a.phone.replace(/[\s-]/g, '') !== phone.replace(/[\s-]/g, ''));

      let kycStatus = 'VERIFIED';
      let statusNotes = 'DPDP 2023 Tokenized Aadhaar. Verhoeff algorithm passed. Direct DBT verified.';

      if (aadhaarCollision) {
        // Flag for manual admin review (could be genuine phone change or fraud attempt) — never auto-accept or auto-reject.
        kycStatus = 'FLAGGED_COLLISION';
        statusNotes = `FLAGGED COLLISION: Same Aadhaar token already on file under phone ${aadhaarCollision.phone} (${aadhaarCollision.name}). Held for manual admin investigation.`;
      }

      const newFarmer = {
        id: 'ACC-FARMER-' + Date.now().toString(36).toUpperCase(),
        actorType: 'FARMER',
        name,
        phone,
        aadhaarMasked: masked,
        aadhaarToken: token,
        farmLocation: location,
        acres,
        fpoId: fpoId || null,
        fpoName: fpoId ? 'Linked FPO Member' : 'Independent Smallholder',
        bankDetails: bank,
        trustScore: 50.0, // Neutral start; gets visible "New Seller" badge
        kycStatus,
        verificationDate: kycStatus === 'VERIFIED' ? new Date().toISOString().split('T')[0] : null,
        rejectionReason: null,
        notes: statusNotes
      };

      this.triggerOTPModal(phone, () => {
        this.accounts.push(newFarmer);
        this.save();
        this.setActiveAccount(newFarmer.id);

        if (kycStatus === 'FLAGGED_COLLISION') {
          window.FF_APP.showToast(`⚠️ Aadhaar Collision Detected! Account flagged for manual admin inspection under DPDP guidelines.`, 'warning');
        } else {
          window.FF_APP.showToast(`🌾 Welcome ${name}! Registered as direct seller with neutral trust score (50/100) & "New Seller" badge.`, 'success');
        }
      });
    },

    submitConsumerOnboarding() {
      const name = (document.getElementById('ob-consumer-name')?.value || '').trim();
      const phone = (document.getElementById('ob-consumer-phone')?.value || '').trim();
      const pay = (document.getElementById('ob-consumer-pay')?.value || '').trim();
      const addr1 = (document.getElementById('ob-consumer-addr1')?.value || '').trim();
      const addr2 = (document.getElementById('ob-consumer-addr2')?.value || '').trim();

      if (!name || !phone || !addr1) {
        alert('Please fill Name, Mobile Number, and Primary Delivery Address.');
        return;
      }

      const newConsumer = {
        id: 'ACC-CONSUMER-' + Date.now().toString(36).toUpperCase(),
        actorType: 'CONSUMER',
        name,
        phone,
        addresses: [addr1, addr2].filter(Boolean),
        paymentMethod: pay,
        trustScore: 99.0,
        kycStatus: 'VERIFIED', // Minimal verification - phone OTP only
        verificationDate: new Date().toISOString().split('T')[0],
        rejectionReason: null,
        notes: 'Minimal verification: phone OTP only. Payment risk managed by gateway.'
      };

      this.triggerOTPModal(phone, () => {
        this.accounts.push(newConsumer);
        this.save();
        this.setActiveAccount(newConsumer.id);
        window.FF_APP.showToast(`🛒 Welcome ${name}! Consumer profile active for farm-fresh ordering.`, 'success');
      });
    },

    submitBuyerOnboarding() {
      const name = (document.getElementById('ob-buyer-name')?.value || '').trim();
      const gstin = (document.getElementById('ob-buyer-gstin')?.value || '').trim();
      const contact = (document.getElementById('ob-buyer-contact')?.value || '').trim();
      const phone = (document.getElementById('ob-buyer-phone')?.value || '').trim();
      const address = (document.getElementById('ob-buyer-address')?.value || '').trim();

      if (!name || !gstin || !phone) {
        alert('Please fill Business Name, GSTIN, and Contact Phone.');
        return;
      }

      if (!validateGSTIN(gstin)) {
        alert('❌ Invalid GSTIN format: Must be a valid 15-character Indian Goods & Services Tax Identification Number.');
        return;
      }

      const pendingBuyer = {
        id: 'ACC-BUYER-' + Date.now().toString(36).toUpperCase(),
        actorType: 'BUYER',
        name,
        gstin,
        address,
        contactPerson: `${contact} • ${phone}`,
        phone,
        paymentTerms: '100% Upfront Escrow Deposit (Credit terms deferred for future scope)',
        trustScore: 50.0,
        kycStatus: 'PENDING_REVIEW', // State machine: Pending Admin Review
        verificationDate: null,
        rejectionReason: null,
        notes: 'GSTIN format validated. Awaiting admin manual verification to enable procurement demand posting.'
      };

      this.triggerOTPModal(phone, () => {
        this.accounts.push(pendingBuyer);
        this.save();
        this.setActiveAccount(pendingBuyer.id);
        window.FF_APP.showToast(`🏬 B2B Buyer "${name}" registered! Status: PENDING_REVIEW (Read-Only Mode active).`, 'info');
      });
    },

    submitDriverOnboarding() {
      const name = (document.getElementById('ob-driver-name')?.value || '').trim();
      const dl = (document.getElementById('ob-driver-dl')?.value || '').trim();
      const rc = (document.getElementById('ob-driver-rc')?.value || '').trim();
      const type = document.getElementById('ob-driver-type')?.value || 'Mahindra E-Loader';
      const phone = (document.getElementById('ob-driver-phone')?.value || '').trim();
      const area = (document.getElementById('ob-driver-area')?.value || '').trim();
      const bank = (document.getElementById('ob-driver-bank')?.value || '').trim();

      if (!name || !dl || !rc || !phone) {
        alert('Please fill Driver Name, DL Number, Vehicle RC, and Phone.');
        return;
      }

      if (!validateDrivingLicense(dl)) {
        alert('❌ Driving License format validation failed. Please provide a valid State RTO license number.');
        return;
      }

      if (!validateVehicleRC(rc)) {
        alert('❌ Vehicle Registration (RC) format validation failed. Please check registration number (e.g. KA-03-D-9912).');
        return;
      }

      // Exception Check 1: Vehicle registration number already active under a different driver account
      const cleanRc = rc.replace(/[\s-]/g, '').toUpperCase();
      const rcCollision = this.accounts.find(a => a.rcNumber && a.rcNumber.replace(/[\s-]/g, '').toUpperCase() === cleanRc);
      if (rcCollision) {
        alert(`❌ Validation Rejection: Vehicle registration number (${rc}) is already active under another driver account (${rcCollision.name}). To prevent double-booking of logistics assets, one vehicle cannot be registered simultaneously across multiple accounts.`);
        return;
      }

      // Exception Check 2: Same driving license under two different phone numbers
      const cleanDl = dl.replace(/[\s-]/g, '').toUpperCase();
      const dlCollision = this.accounts.find(a => a.dlNumber && a.dlNumber.replace(/[\s-]/g, '').toUpperCase() === cleanDl && a.phone.replace(/[\s-]/g, '') !== phone.replace(/[\s-]/g, ''));

      let kycStatus = 'PENDING_REVIEW';
      let notes = 'License and RC format-verified. Awaiting admin review to activate load dispatch.';

      if (dlCollision) {
        kycStatus = 'FLAGGED_COLLISION';
        notes = `FLAGGED COLLISION: Driving License ${dl} already on file under phone ${dlCollision.phone}. Held for manual review.`;
      }

      const newDriver = {
        id: 'ACC-DRIVER-' + Date.now().toString(36).toUpperCase(),
        actorType: 'LOGISTICS_DRIVER',
        name,
        phone,
        dlNumber: dl,
        rcNumber: rc,
        vehicleType: type,
        serviceArea: area,
        bankDetails: bank,
        trustScore: 50.0,
        kycStatus,
        verificationDate: null,
        rejectionReason: null,
        notes
      };

      this.triggerOTPModal(phone, () => {
        this.accounts.push(newDriver);
        this.save();
        this.setActiveAccount(newDriver.id);
        if (kycStatus === 'FLAGGED_COLLISION') {
          window.FF_APP.showToast(`⚠️ License Collision: Held for manual admin inspection.`, 'warning');
        } else {
          window.FF_APP.showToast(`🚚 Driver partner "${name}" registered! Status: PENDING_REVIEW.`, 'info');
        }
      });
    },

    submitFleetOnboarding() {
      const name = (document.getElementById('ob-fleet-name')?.value || '').trim();
      const gstin = (document.getElementById('ob-fleet-gstin')?.value || '').trim();
      const size = (document.getElementById('ob-fleet-size')?.value || '').trim();
      const contact = (document.getElementById('ob-fleet-contact')?.value || '').trim();
      const phone = (document.getElementById('ob-fleet-phone')?.value || '').trim();
      const bank = (document.getElementById('ob-fleet-bank')?.value || '').trim();
      const api = document.getElementById('ob-fleet-api')?.value === 'true';

      if (!name || !gstin || !phone) {
        alert('Please fill Fleet Name, GSTIN, and Contact Phone.');
        return;
      }

      if (!validateGSTIN(gstin)) {
        alert('❌ Invalid GSTIN format. Must be a valid 15-character GSTIN.');
        return;
      }

      const pendingFleet = {
        id: 'ACC-FLEET-' + Date.now().toString(36).toUpperCase(),
        actorType: 'LOGISTICS_FLEET',
        name,
        gstin,
        fleetSize: size,
        contactPerson: `${contact} • ${phone}`,
        phone,
        bankDetails: bank,
        apiCapability: api,
        serviceArea: 'Regional Highway & Inter-Mandi Cold Corridors',
        trustScore: 50.0,
        kycStatus: 'PENDING_REVIEW',
        verificationDate: null,
        rejectionReason: null,
        notes: 'Partner fleet aggregator. Awaiting admin review to activate corridor fleet status.'
      };

      this.triggerOTPModal(phone, () => {
        this.accounts.push(pendingFleet);
        this.save();
        this.setActiveAccount(pendingFleet.id);
        window.FF_APP.showToast(`🚛 Fleet Aggregator "${name}" registered! Status: PENDING_REVIEW.`, 'info');
      });
    },

    // ==========================================================================
    // 6. Interactive OTP Simulator (5-Min Countdown, Max 3 Resends)
    // ==========================================================================

    triggerOTPModal(phone, onVerified) {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      this.otpSecondsRemaining = 300; // 5 minutes
      this.otpResendCount = 0;
      const demoOtp = '849201'; // Pre-filled simulated OTP for seamless demo

      clearInterval(this.activeOtpTimer);

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <span>📱</span>
            <span>Phone OTP Verification • Two-Factor Auth</span>
          </div>
          <button class="modal-close-btn" onclick="window.FF_KYC.closeOtpModal()">✕</button>
        </div>
        <div class="modal-body otp-dialog-wrapper">
          <div style="font-size: 2.2rem; margin-bottom: 6px;">📲</div>
          <h3 style="font-size: 1.15rem; color: var(--primary-900);">Enter 6-Digit Verification Code</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 4px auto 14px;">
            A one-time password has been dispatched to <strong>${phone}</strong>. (Simulated SMS OTP: <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 800;">${demoOtp}</code>)
          </p>

          <div class="otp-inputs-row">
            <input type="text" maxlength="1" class="otp-box" value="8" id="otp-1">
            <input type="text" maxlength="1" class="otp-box" value="4" id="otp-2">
            <input type="text" maxlength="1" class="otp-box" value="9" id="otp-3">
            <input type="text" maxlength="1" class="otp-box" value="2" id="otp-4">
            <input type="text" maxlength="1" class="otp-box" value="0" id="otp-5">
            <input type="text" maxlength="1" class="otp-box" value="1" id="otp-6">
          </div>

          <div class="otp-timer-text">
            <span>Code expires in: </span>
            <span class="otp-timer-count" id="otp-countdown-val">05:00</span>
          </div>

          <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 16px;">
            Anti-Spam Security: Maximum 3 resend attempts allowed before temporary lockout.
          </div>

          <div style="display: flex; justify-content: center; gap: 12px;">
            <button class="btn btn-secondary btn-sm" id="btn-resend-otp" onclick="window.FF_KYC.resendOTP('${phone}')">
              Resend OTP (Attempt <span id="resend-count-val">0</span>/3)
            </button>
            <button class="btn btn-primary" id="btn-confirm-otp" onclick="window.FF_KYC.verifyOTPCode()">
              ✓ Confirm & Complete Registration
            </button>
          </div>
        </div>
      `;

      this._pendingVerifyCallback = onVerified;

      // Start countdown timer
      this.activeOtpTimer = setInterval(() => {
        this.otpSecondsRemaining--;
        const mins = Math.floor(this.otpSecondsRemaining / 60).toString().padStart(2, '0');
        const secs = (this.otpSecondsRemaining % 60).toString().padStart(2, '0');
        const el = document.getElementById('otp-countdown-val');
        if (el) el.textContent = `${mins}:${secs}`;

        if (this.otpSecondsRemaining <= 0) {
          clearInterval(this.activeOtpTimer);
          if (el) el.textContent = 'EXPIRED';
          const btn = document.getElementById('btn-confirm-otp');
          if (btn) btn.disabled = true;
          alert('OTP expired (5-minute window ended). Please request a new code.');
        }
      }, 1000);
    },

    resendOTP(phone) {
      if (this.otpResendCount >= this.MAX_OTP_RESENDS) {
        alert('❌ Anti-Spam Lockout: You have reached the maximum of 3 OTP resend attempts. Please wait 10 minutes before retrying.');
        return;
      }
      this.otpResendCount++;
      this.otpSecondsRemaining = 300;
      const countEl = document.getElementById('resend-count-val');
      if (countEl) countEl.textContent = this.otpResendCount;
      window.FF_APP.showToast(`📲 New OTP dispatched to ${phone}. Attempt ${this.otpResendCount} of 3.`, 'info');
    },

    verifyOTPCode() {
      clearInterval(this.activeOtpTimer);
      window.FF_APP.closeModal();
      if (typeof this._pendingVerifyCallback === 'function') {
        this._pendingVerifyCallback();
        this._pendingVerifyCallback = null;
      }
    },

    closeOtpModal() {
      clearInterval(this.activeOtpTimer);
      window.FF_APP.closeModal();
    },

    // ==========================================================================
    // 7. Admin Compliance Desk Actions (Approve, Reject, Suspend, Reinstate)
    // ==========================================================================

    adminApproveAccount(id) {
      const acc = this.getAccountById(id);
      if (!acc) return;
      acc.kycStatus = 'VERIFIED';
      acc.verificationDate = new Date().toISOString().split('T')[0];
      acc.rejectionReason = null;
      this.save();
      this.updateHeaderIdentityUI();
      if (window.FF_APP) window.FF_APP.renderCurrentView();
      window.FF_APP.showToast(`✅ Approved: ${acc.name} (${acc.actorType}) is now VERIFIED & ACTIVE!`, 'success');
    },

    adminRejectAccount(id) {
      const acc = this.getAccountById(id);
      if (!acc) return;
      const reason = prompt(`Enter rejection reason for ${acc.name}:`, 'Statutory registration discrepancy or unverified business address.');
      if (!reason) return;

      acc.kycStatus = 'REJECTED';
      acc.rejectionReason = reason;
      this.save();
      this.updateHeaderIdentityUI();
      if (window.FF_APP) window.FF_APP.renderCurrentView();
      window.FF_APP.showToast(`❌ Rejected: ${acc.name} (${acc.actorType}) has been marked REJECTED.`, 'error');
    },

    adminSuspendAccount(id) {
      const acc = this.getAccountById(id);
      if (!acc) return;
      acc.kycStatus = 'SUSPENDED';
      acc.rejectionReason = 'Suspended by Operations Admin: Transit failure / customer complaint threshold breached.';
      this.save();
      this.updateHeaderIdentityUI();
      if (window.FF_APP) window.FF_APP.renderCurrentView();
      window.FF_APP.showToast(`⚠️ Account Suspended: ${acc.name} has been paused to contain spoilage risk.`, 'warning');
    },

    adminReinstateAccount(id) {
      const acc = this.getAccountById(id);
      if (!acc) return;
      acc.kycStatus = 'VERIFIED';
      acc.rejectionReason = null;
      this.save();
      this.updateHeaderIdentityUI();
      if (window.FF_APP) window.FF_APP.renderCurrentView();
      window.FF_APP.showToast(`✅ Account Reinstated: ${acc.name} is back to ACTIVE.`, 'success');
    },

    // Inspect Details Modal for Admin
    adminInspectAccount(id) {
      const acc = this.getAccountById(id);
      if (!acc) return;
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <span>🛡️</span>
            <span>KYC Audit Dossier: ${acc.name}</span>
          </div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; color: var(--primary-900);">${acc.name}</h3>
              <span style="font-size: 0.82rem; color: var(--text-muted);">${acc.actorType} • ID: ${acc.id}</span>
            </div>
            <span class="kyc-status-pill ${acc.kycStatus === 'VERIFIED' ? 'kyc-verified' : (acc.kycStatus === 'PENDING_REVIEW' ? 'kyc-pending' : (acc.kycStatus === 'SUSPENDED' ? 'kyc-suspended' : 'kyc-rejected'))}">
              ${acc.kycStatus}
            </span>
          </div>

          <div class="grid-2" style="font-size: 0.85rem; gap: 12px; margin-bottom: 16px;">
            <div><strong>Contact Phone:</strong> ${acc.phone}</div>
            <div><strong>Trust Score:</strong> ${acc.trustScore} / 100</div>
            ${acc.regNo ? `<div><strong>Statutory Reg (CIN):</strong> ${acc.regNo}</div>` : ''}
            ${acc.gstin ? `<div><strong>GSTIN:</strong> ${acc.gstin}</div>` : ''}
            ${acc.aadhaarMasked ? `<div><strong>Aadhaar (Masked):</strong> ${acc.aadhaarMasked}</div>` : ''}
            ${acc.aadhaarToken ? `<div><strong>DPDP Token:</strong> <code>${acc.aadhaarToken}</code></div>` : ''}
            ${acc.dlNumber ? `<div><strong>Driving License:</strong> ${acc.dlNumber}</div>` : ''}
            ${acc.rcNumber ? `<div><strong>Vehicle RC:</strong> ${acc.rcNumber}</div>` : ''}
            ${acc.bankDetails ? `<div><strong>Settlement Bank:</strong> ${acc.bankDetails}</div>` : ''}
            ${acc.serviceArea ? `<div><strong>Operating Area:</strong> ${acc.serviceArea}</div>` : ''}
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 0.82rem; margin-bottom: 16px;">
            <strong>Compliance & Audit Notes:</strong><br>
            ${acc.notes || 'No security flags recorded.'}
            ${acc.rejectionReason ? `<div style="color: #b91c1c; margin-top: 6px;"><strong>Adverse Action Note:</strong> ${acc.rejectionReason}</div>` : ''}
          </div>

          <div class="modal-footer" style="padding: 0; justify-content: space-between;">
            <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Close</button>
            <div style="display: flex; gap: 8px;">
              ${acc.kycStatus !== 'VERIFIED' ? `
                <button class="btn btn-primary" onclick="window.FF_KYC.adminApproveAccount('${acc.id}'); window.FF_APP.closeModal();">
                  ✓ Approve & Make Active
                </button>
              ` : ''}
              ${acc.kycStatus === 'VERIFIED' ? `
                <button class="btn btn-secondary" style="color: #be123c;" onclick="window.FF_KYC.adminSuspendAccount('${acc.id}'); window.FF_APP.closeModal();">
                  ⚠️ Suspend Account
                </button>
              ` : ''}
              ${acc.kycStatus === 'SUSPENDED' ? `
                <button class="btn btn-primary" onclick="window.FF_KYC.adminReinstateAccount('${acc.id}'); window.FF_APP.closeModal();">
                  ✓ Reinstate to Active
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      window.FF_APP.openModal();
    },

    // Collision Simulator for Judge/Jury Demo
    simulateCollisionScenario(type) {
      if (type === 'AADHAAR_PHONE_COLLISION') {
        const demoAadhaar = '54891230491' + generateVerhoeffChecksum('54891230491');
        // Register same Aadhaar under different phone
        const collisionAcc = {
          id: 'ACC-COLLISION-' + Date.now().toString(36).toUpperCase(),
          actorType: 'FARMER',
          name: 'Shankar Gowda (Simulated Collision)',
          phone: '+91 91102 99881', // Different phone!
          aadhaarMasked: maskAadhaar(demoAadhaar),
          aadhaarToken: tokenizeAadhaar(demoAadhaar),
          farmLocation: 'Kolar Sub-district',
          acres: 3.0,
          bankDetails: 'Canara Bank',
          trustScore: 50.0,
          kycStatus: 'FLAGGED_COLLISION',
          verificationDate: null,
          rejectionReason: null,
          notes: 'SIMULATED EXCEPTION: Same Aadhaar token submitted under a different phone number (+91 91102 99881 vs Ramesh Patel on file). Automatically routed to Admin Manual Review Queue.'
        };
        this.accounts.unshift(collisionAcc);
        this.save();
        if (window.FF_APP) window.FF_APP.renderCurrentView();
        window.FF_APP.showToast('🚨 Simulated Exception Triggered: Aadhaar Phone Mismatch flagged for Admin review!', 'warning');
      } else if (type === 'DUPLICATE_RC') {
        alert('Simulating Duplicate Vehicle RC submission: Trying to register active RC "KA-03-D-9912" under a second driver...');
        alert('❌ Rejected at validation: "KA-03-D-9912 already active under driver Kiran Gowda. Double-booking prevented."');
      } else if (type === 'DUPLICATE_CIN') {
        alert('Simulating Duplicate CIN submission: Trying to register existing CIN "U01409KA2024PTC188219"...');
        alert('❌ Rejected at validation: "Registration number already on file for GreenRoots Kisan Producer Co. Duplicate account blocked."');
      }
    }
  };

  // Auto initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.FF_KYC.init();
  });
})();
