/**
 * FarmFlow - Master Enterprise Application Controller
 * Orchestrates views, multilingual switching, e-commerce, logistics hero & FPO operations
 */

(function () {
  'use strict';

  window.FF_APP = {
    activeRole: 'FARMER', // Initial role
    activeFpoTab: 'QUOTA', // 'QUOTA', 'INTAKE', 'MACHINERY', 'LEDGER'

    init() {
      if (window.FF_I18N && window.FF_I18N.init) {
        window.FF_I18N.init();
      }
      this.bindEvents();
      this.updateLanguageStrings();
      this.renderCurrentView();

      // Show welcome toast
      setTimeout(() => {
        const lang = window.FF_I18N.currentLang;
        const msg = lang === 'hi' 
          ? '🌾 फार्मफ्लो में आपका स्वागत है। लॉजिस्टिक्स व ऑन-डिमांड ट्रांसपोर्ट का उपयोग करें!'
          : (lang === 'kn' ? '🌾 ಫಾರ್ಮ್‌ಫ್ಲೋಗೆ ಸ್ವಾಗತ. ಆನ್-ಡಿಮ್ಯಾಂಡ್ ಕೃಷಿ ಸಾರಿಗೆ ಬಳಸಿ!' : '🌾 Welcome to FarmFlow. Explore the Logistics Hub & On-Demand Farm Transport!');
        this.showToast(msg, 'success');
      }, 600);
    },

    bindEvents() {
      // Role Switcher Navigation
      document.querySelectorAll('.role-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          const role = e.currentTarget.getAttribute('data-role');
          if (role) this.switchRole(role);
        });
      });

      // Top Admin Ribbon Button
      const adminBtn = document.getElementById('btn-admin-pitch') || document.getElementById('btn-judge-pitch');
      if (adminBtn) {
        adminBtn.addEventListener('click', () => {
          this.switchRole('ADMIN');
        });
      }

      // Language Selector
      const langSelect = document.getElementById('lang-select');
      if (langSelect) {
        langSelect.addEventListener('change', (e) => {
          window.FF_I18N.setLang(e.target.value);
          this.updateLanguageStrings();
          this.renderCurrentView();
          const toastMsg = e.target.value === 'hi' 
            ? 'भाषा बदलकर हिन्दी कर दी गई है।' 
            : (e.target.value === 'kn' ? 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.' : 'Language changed to English.');
          this.showToast(toastMsg, 'info');
        });
      }

      // Voice Button ("Kisan Vani")
      const voiceBtn = document.getElementById('btn-kisan-vani');
      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          window.FF_VOICE.readDailyAdvisory();
        });
      }

      // Floating Cart Trigger
      const cartBtn = document.getElementById('btn-floating-cart');
      if (cartBtn) {
        cartBtn.addEventListener('click', () => {
          window.FF_STORE.openCartDrawer();
        });
      }
    },

    switchRole(role) {
      this.activeRole = role;

      // Update tab active state
      document.querySelectorAll('.role-tab').forEach(tab => {
        if (tab.getAttribute('data-role') === role) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      this.renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    updateLanguageStrings() {
      const i18n = window.FF_I18N;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = i18n.get(key);
        }
      });
    },

    renderCurrentView() {
      const container = document.getElementById('main-workspace');
      if (!container) return;

      switch (this.activeRole) {
        case 'FARMER':
          this.renderFarmerView(container);
          break;
        case 'CONSUMER':
          this.renderConsumerView(container);
          break;
        case 'LOGISTICS':
          this.renderLogisticsView(container);
          break;
        case 'FPO':
          this.renderFPOView(container);
          break;
        case 'BUYER':
          this.renderBuyerView(container);
          break;
        case 'ADMIN':
          this.renderAdminView(container);
          break;
        default:
          this.renderFarmerView(container);
      }
    },

    // ========================================================================
    // 1. FARMER-FIRST WORKBENCH
    // ========================================================================
    renderFarmerView(container) {
      const farmer = window.FF_DATA.currentFarmer;
      const weather = window.FF_DATA.weatherFeed;
      const distress = window.FF_DATA.distressSaleShield || {};
      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';
      const enam = window.FF_DATA.enamExtension || {};

      container.innerHTML = `
        <!-- 1. OFFICIAL e-NAM EXTENSION SPOKE RIBBON (भारत सरकार e-NAM अधिकृत विलेज स्पोक) -->
        <div class="enam-spoke-ribbon">
          <div class="enam-spoke-content">
            <div class="enam-emblem">🏛️</div>
            <div class="enam-spoke-titles">
              <h2>
                <span>${isHi ? 'भारत सरकार e-NAM अधिकृत विलेज स्पोक' : 'e-NAM Certified Village Spoke & Aggregator'}</span>
                <span class="enam-badge-pill">Spoke #${enam.spokeId || 'KA-KOL-042'}</span>
              </h2>
              <div class="enam-spoke-sub">
                ${isHi ? 
                  'हम e-NAM के पूरक (Extension) के रूप में कार्य करते हैं: 3 किमी में खेत से माल संग्रह, डिजिटल लोड-सेल ग्रेडिंग, और शून्य बिचौलिया कट।' : 
                  'Operating on top of e-NAM: Village-level aggregation within 3km, IoT load-cell assaying, farmgate transport, and 100% direct bank DBT.'}
              </div>
            </div>
          </div>
          <div class="enam-spoke-stats">
            <div class="enam-stat-pill">
              <span class="lbl">${isHi ? 'निकटतम स्पोक' : 'Nearest Spoke'}</span>
              <span class="val">${enam.distanceToFarmerKm || '2.8'} km</span>
            </div>
            <div class="enam-stat-pill">
              <span class="lbl">${isHi ? 'मंडी टैक्स' : 'Mandi Tax'}</span>
              <span class="val" style="color: #4ade80;">0% ZERO</span>
            </div>
            <div class="enam-stat-pill">
              <span class="lbl">${isHi ? 'आज का सीधा भाव' : 'Direct Realization'}</span>
              <span class="val">₹ 23.50/kg</span>
            </div>
          </div>
        </div>

        <!-- 2. KISAN VANI AUDIO ADVISORY HERO (किसान वाणी - आवाज में सुनें) -->
        <div class="kisan-voice-hero">
          <div class="kisan-voice-left">
            <div class="voice-mic-icon-wrap" onclick="window.FF_VOICE.playAdvisory()" title="Tap to Listen">
              🎙️
            </div>
            <div>
              <div class="kisan-voice-title">
                <span>🎙️ ${isHi ? 'किसान वाणी (Kisan Vani)' : 'Kisan Voice Advisory'}</span>
                <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff; font-size: 0.72rem;">Live Voice</span>
              </div>
              <div class="kisan-voice-sub">
                ${isHi ? 
                  'आज कोलार में टमाटर ₹23.50/kg बिका है। शाम को हल्की बारिश संभव है, छिड़काव न करें। पूरा संदेश सुनने के लिए पीला बटन दबाएं।' : 
                  'Tomato net realization today is ₹23.50/kg (+₹12.50 above mandi). Evening rain forecasted. Press the listen button to hear voice advisory.'}
              </div>
            </div>
          </div>
          <div class="kisan-voice-actions">
            <button class="btn-kisan-listen-main" onclick="window.FF_VOICE.playAdvisory()">
              <span>🔊</span>
              <span>${isHi ? 'आवाज में सुनें (Tap to Listen)' : 'Listen to Advisory'}</span>
            </button>
            <button class="btn-kisan-stop" onclick="window.FF_VOICE.stop()">
              <span>⏹️</span>
              <span>${isHi ? 'रोकें' : 'Stop'}</span>
            </button>
          </div>
        </div>

        <!-- PRACTICAL LIFECYCLE DEMO BANNER (खेत से खरीदार तक लाइव डेमो - SIH 2026 Judge Winner) -->
        <div class="practical-demo-banner">
          <div class="demo-banner-left">
            <div class="demo-banner-icon">🎬</div>
            <div>
              <div class="demo-banner-title">
                <span>${isHi ? 'प्रैक्टिकल लाइव डेमो: खेत से खरीदार और बैंक खाता' : 'Interactive 5-Stage Live Lifecycle Simulator'}</span>
                <span class="badge" style="background: #f59e0b; color: #1e1b4b; font-size: 0.72rem; font-weight: 800;">SIH 2026 Practical Flow</span>
              </div>
              <div class="demo-banner-sub">
                ${isHi ? 
                  'देखें कैसे 15 मिनट में खेत पर गाड़ी आती है, डिजिटल कांटा होता है, और बिना किसी बिचौलिये के 2 घंटे में सीधे बैंक खाते में पैसे आते हैं।' : 
                  'Experience how FarmFlow actually works: Demand matching, 100% bank escrow, farmgate EV dispatch, village IoT Brix assaying, and 2-hour Aadhaar DBT payout.'}
              </div>
            </div>
          </div>
          <button class="btn-run-demo" onclick="window.FF_APP.runPracticalDemoModal(1)">
            <span>▶️</span>
            <span>${isHi ? 'लाइव डेमो चलाएं (Run Demo)' : 'Run Live Demo'}</span>
          </button>
        </div>

        <!-- 3. ILLITERATE-FRIENDLY 5 BIG TACTILE ACTION TILES (बड़ी रंगीन टच टाइल्स) -->
        <div class="kisan-big-grid">
          <!-- Tile 1: 🟢 फसल बेचें -->
          <div class="kisan-tile tile-sell" onclick="window.FF_APP.openSellModal('Tomato', 23.50)">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">🌾</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('sell')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">१. ${isHi ? 'फसल बेचें' : 'Sell Produce'}</div>
              <div class="kisan-tile-sub">${isHi ? 'सीधे खरीदार को बेचें (बिचौलिया मुक्त)' : 'Direct Institutional Forward Deal'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">₹ 23.50 / kg</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'टैप करें 👉' : 'Tap here 👉'}</span>
            </div>
          </div>

          <!-- Tile 2: 🚚 खेत से गाड़ी बुलाएं -->
          <div class="kisan-tile tile-transport" onclick="window.FF_LOGISTICS.openBookingModal()">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">🚚</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('transport')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">२. ${isHi ? 'खेत से गाड़ी' : 'Book Vehicle'}</div>
              <div class="kisan-tile-sub">${isHi ? 'खेत पर 15 मिनट में ई-लोडर पिकअप' : 'Farmgate 15-min EV/Reefer Pickup'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">${isHi ? '₹350 भाड़ा बचत' : 'Save ₹350/Qtl'}</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'टैप करें 👉' : 'Tap here 👉'}</span>
            </div>
          </div>

          <!-- Tile 3: ⚖️ डिजिटल धर्मकांटा व DBT -->
          <div class="kisan-tile tile-weigh" onclick="window.FF_APP.openWeighbridgeModal('Ramesh Patel', 650)">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">⚖️</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('weighbridge')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">३. ${isHi ? 'डिजिटल धर्मकांटा' : 'Weighbridge & DBT'}</div>
              <div class="kisan-tile-sub">${isHi ? 'कंप्यूटरीकृत वजन व 2 घंटे में DBT' : 'IoT Load-Cell Slip & Direct Bank Payout'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">${isHi ? '0 ग्राम चोरी' : 'Zero Theft'}</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'टैप करें 👉' : 'Tap here 👉'}</span>
            </div>
          </div>

          <!-- Tile 4: ❄️ सोलर कोल्ड रूम व 70% ऋण -->
          <div class="kisan-tile tile-storage" onclick="window.FF_APP.claimDistressShield()">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">❄️</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('storage')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">४. ${isHi ? 'कोल्ड स्टोरेज व लोन' : 'Cold Safe & 70% Loan'}</div>
              <div class="kisan-tile-sub">${isHi ? 'दाम गिरने पर माल रखें व तुरंत अग्रिम पाएं' : 'Store produce & get instant e-NWR advance'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">${isHi ? '70% तुरंत लोन' : '70% Instant Cash'}</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'टैप करें 👉' : 'Tap here 👉'}</span>
            </div>
          </div>

          <!-- Tile 5: 🩺 फसल डॉक्टर -->
          <div class="kisan-tile tile-doctor" onclick="window.FF_APP.scrollToId('crop-doctor-section')">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">🩺</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('doctor')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">५. ${isHi ? 'फसल डॉक्टर' : 'AI Crop Doctor'}</div>
              <div class="kisan-tile-sub">${isHi ? 'पत्ती की फोटो से तुरंत बीमारी पहचानें' : 'Instant AI Computer Vision Leaf Diagnosis'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">${isHi ? 'मुफ्त ICAR जांच' : 'Free ICAR Scan'}</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'टैप करें 👉' : 'Tap here 👉'}</span>
            </div>
          </div>
        </div>

        <!-- 4. e-NAM EXTENSION VALUE PROPOSITION STRIP (e-NAM की कमियां ➔ FarmFlow समाधान) -->
        <div class="enam-solve-strip">
          <div class="enam-solve-header">
            <div class="enam-solve-title">
              <span>🏛️</span>
              <span>${isHi ? 'e-NAM को जमीन पर कैसे सफल बनाता है FarmFlow विलेज स्पोक?' : 'How FarmFlow Acts as the Ground Execution Layer on top of e-NAM'}</span>
            </div>
            <span class="badge badge-success">SIH 2026 Problem Statement 33 Solution</span>
          </div>
          <div class="enam-solve-grid">
            <div class="enam-solve-box">
              <div class="bottleneck">❌ ${isHi ? 'e-NAM मंडी 45 किमी दूर' : 'e-NAM Mandi 45 km away'}</div>
              <div class="solution">✅ ${isHi ? 'विलेज स्पोक 2.8 किमी पर' : 'FarmFlow Spoke @ 2.8 km'}</div>
              <div class="impact-tag">${isHi ? 'छोटे किसान को ₹350/क्विंटल भाड़ा बचत' : 'Saves ₹350/Qtl line-haul freight for smallholders'}</div>
            </div>
            <div class="enam-solve-box">
              <div class="bottleneck">❌ ${isHi ? 'मंडी में 2.5 kg/क्रेट वजन चोरी' : 'APMC manual scale theft (1.5-2.5 kg/crate)'}</div>
              <div class="solution">✅ ${isHi ? 'डिजिटल IoT लोड-सेल 0 ग्राम चोरी' : 'IoT Load-Cell & Digital Brix Assaying'}</div>
              <div class="impact-tag">${isHi ? 'किसान को ₹1,800/लॉट का सीधा फायदा' : 'Tamper-proof digital weight slip & instant quality cert'}</div>
            </div>
            <div class="enam-solve-box">
              <div class="bottleneck">❌ ${isHi ? 'आढ़तिया भुगतान 4-7 दिन अटकाना' : 'Mandi commission agent 4-7 day credit delay'}</div>
              <div class="solution">✅ ${isHi ? 'बैंक एस्क्रो से 2 घंटे में DBT' : '2-Hour Bank Escrow DBT to SBI A/c'}</div>
              <div class="impact-tag">${isHi ? '100% बिचौलिया-मुक्त सीधी बैंक जमा' : 'Zero middleman commission, direct account credit'}</div>
            </div>
            <div class="enam-solve-box">
              <div class="bottleneck">❌ ${isHi ? 'मंडी क्रैश होने पर फसल सड़क पर फेंकना' : 'Distress dumping on highways during market crash'}</div>
              <div class="solution">✅ ${isHi ? 'सोलर कोल्ड स्टोरेज + 70% e-NWR ऋण' : 'Solar Cold Storage + 70% e-NWR Cash Advance'}</div>
              <div class="impact-tag">${isHi ? 'शून्य संकट बिक्री (Zero Distress Sale)' : 'Farmer gets immediate cash without distress selling'}</div>
            </div>
          </div>
        </div>

        <!-- 3 Essential Clean Metric Cards (Minimalist & High Clarity) -->
        <div class="grid-3" style="margin-bottom: 24px;">
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-green">₹</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">₹ 23.50 / kg</div>
              <div class="farmer-stat-label">${i18n.get('netRateCard')}</div>
              <div class="farmer-stat-tag">📈 +₹ 12.50 ${i18n.get('todayMandiRate')}</div>
            </div>
          </div>
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-amber">🏦</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">₹ ${farmer.walletBalanceRs.toLocaleString()}.00</div>
              <div class="farmer-stat-label">${i18n.get('walletCard')}</div>
              <div class="farmer-stat-tag">⚡ Direct DBT Linked (SBI A/c ••••8842)</div>
            </div>
          </div>
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-sky">📦</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">${(farmer.activeListings || []).length} Deals Active</div>
              <div class="farmer-stat-label">${i18n.get('activeDealsCard')}</div>
              <div class="farmer-stat-tag">FreshMart 650 kg Lot</div>
            </div>
          </div>
        </div>

        <!-- 5. AUTOMATED DISTRESS SALE & PRICE CRASH PROTECTION SHIELD BANNER -->
        ${distress.isCrashAlertActive ? `
          <div class="distress-shield-banner">
            <div class="distress-header-row">
              <div>
                <span class="distress-tag-pill">🚨 ${isHi ? 'मंडी दाम क्रैश चेतावनी' : 'APMC Mandi Crash Alert'}</span>
                <h3 class="distress-title">${i18n.get('distressTitle')}</h3>
                <div class="distress-msg">${distress.alertMessage}</div>
              </div>
            </div>
            <div class="distress-stats-grid">
              <div class="distress-stat-box">
                <div class="distress-stat-lbl">${isHi ? 'मंडी क्रैश भाव' : 'Mandi Crash Rate'}</div>
                <div class="distress-stat-val" style="color: #dc2626;">₹ ${distress.currentMandiCrashRate.toFixed(2)} / kg</div>
              </div>
              <div class="distress-stat-box">
                <div class="distress-stat-lbl">${isHi ? 'लागत खर्च' : 'Cultivation Cost'}</div>
                <div class="distress-stat-val">₹ ${distress.baselineCultivationCost.toFixed(2)} / kg</div>
              </div>
              <div class="distress-stat-box">
                <div class="distress-stat-lbl">${isHi ? 'सोलर कोल्ड किराया' : 'Solar Cold Rental'}</div>
                <div class="distress-stat-val" style="color: #16a34a;">₹ ${distress.rentalCostPerCrateDay.toFixed(2)} / day</div>
              </div>
              <div class="distress-stat-box">
                <div class="distress-stat-lbl">${isHi ? 'तुरंत e-NWR अग्रिम ऋण' : 'Instant 70% e-NWR Loan'}</div>
                <div class="distress-stat-val" style="color: #0284c7;">₹ ${distress.eNwrLoanAdvanceRatePerKg.toFixed(2)} / kg</div>
              </div>
            </div>
            <div class="distress-action-tray">
              <div>
                <strong style="color: #9a3412;">${distress.solutionTitle}</strong>
                <div style="font-size: 0.8rem; color: #7c2d12;">${distress.coldStorageFacility} • Expected price recovery: ₹${distress.expectedRecoveryRate.toFixed(2)} in ${distress.recoveryHorizonDays}</div>
              </div>
              <button class="btn-claim-shield" onclick="window.FF_APP.claimDistressShield()">
                ${i18n.get('btnClaimShield')}
              </button>
            </div>
          </div>
        ` : ''}

        <!-- 2. LIVE DIRECT BUYER DEMAND BOARD (सीधे खरीदार मांग बोर्ड) -->
        <div id="buyer-demands-section" class="demands-board-wrap">
          <div class="demands-board-header">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem;">🏬</span>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                  ${i18n.get('buyerDemandTitle')}
                </h3>
                <span class="badge badge-success">✓ 100% Escrow Secured</span>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
                ${i18n.get('buyerDemandSub')}
              </div>
            </div>
            <div class="crop-selector-pills">
              <button class="crop-pill active" onclick="window.FF_APP.filterBuyerDemands('all', this)">All Demands</button>
              <button class="crop-pill" onclick="window.FF_APP.filterBuyerDemands('tomato', this)">🍅 Tomato</button>
              <button class="crop-pill" onclick="window.FF_APP.filterBuyerDemands('onion', this)">🧅 Onion</button>
              <button class="crop-pill" onclick="window.FF_APP.filterBuyerDemands('potato', this)">🥔 Potato</button>
              <button class="crop-pill" onclick="window.FF_APP.filterBuyerDemands('capsicum', this)">🫑 Capsicum</button>
            </div>
          </div>
          <div id="demands-grid-content" class="demands-grid">
            ${this.renderBuyerDemandCards('all')}
          </div>
        </div>

        <!-- UPGRADED: "MY ACTIVE HARVEST CONTRACTS & SPOKE INTAKE JOURNEY" COMPONENT -->
        <div class="harvest-journey-card">
          <div class="journey-top-row">
            <div>
              <div class="journey-meta-title">
                <span>📋</span>
                <span>${i18n.get('journeyTitle')}</span>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
                ${i18n.get('journeySub')}
              </div>
            </div>
            <span class="badge badge-success">✓ 100% ESCROW SECURED</span>
          </div>

          <div class="journey-steps-timeline">
            <div class="journey-step-box completed">
              <span class="step-num-pill">✓ Stage 1</span>
              <div class="step-title">${i18n.get('journeyStep1')}</div>
              <div class="step-time">14 Sept, 08:30 AM</div>
              <div style="font-size: 0.78rem; color: #166534; margin-top: 4px;">
                Locked @ ₹26.00/kg with FreshMart. Escrow held in bank.
              </div>
            </div>
            <div class="journey-step-box completed">
              <span class="step-num-pill">✓ Stage 2</span>
              <div class="step-title">${i18n.get('journeyStep2')}</div>
              <div class="step-time">14 Sept, 10:15 AM</div>
              <div style="font-size: 0.78rem; color: #166534; margin-top: 4px;">
                E-Loader KA-03-D-9912 picked up 26 crates at Vokkaleri farmgate.
              </div>
            </div>
            <div class="journey-step-box completed">
              <span class="step-num-pill">✓ Stage 3</span>
              <div class="step-title">${i18n.get('journeyStep3')}</div>
              <div class="step-time">14 Sept, 11:30 AM</div>
              <div style="font-size: 0.78rem; color: #166534; margin-top: 4px;">
                Verified 650.0 kg net weight. Brix Sugar: 4.8° (Grade A+).
              </div>
            </div>
            <div class="journey-step-box completed" style="background: #ecfdf5; border-color: #10b981;">
              <span class="step-num-pill" style="background: #059669;">✓ Stage 4</span>
              <div class="step-title" style="color: #065f46;">${i18n.get('journeyStep4')}</div>
              <div class="step-time">14 Sept, 11:42 AM</div>
              <div style="font-size: 0.78rem; color: #047857; font-weight: 700; margin-top: 4px;">
                ₹ 15,275 credited to SBI A/c ••••8842. (UTR: SBIN90214892)
              </div>
            </div>
          </div>

          <div class="journey-actions-tray">
            <button class="btn btn-secondary btn-sm" onclick="window.FF_LOGISTICS.showVehicleTelemetry('KA-03-D-9912')">
              ${i18n.get('btnTrackReefer')}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.FF_APP.openWeighbridgeModal('Ramesh Patel', 650)">
              ${i18n.get('btnScaleSlip')}
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.FF_APP.showToast('📞 Dialing Driver Kiran (+91 88612 99014)...', 'info')">
              ${i18n.get('btnCallDriver')}
            </button>
          </div>
        </div>

        <!-- HERO FEATURE: "WHERE SHOULD I SELL?" MULTI-MANDI ADVISOR -->
        <div id="where-to-sell-section" class="market-advisor-box">
          <div class="market-advisor-header">
            <div class="advisor-title-area">
              <div class="advisor-title">
                <span>🗺️</span>
                <span>${i18n.get('whereToSellTitle')}</span>
              </div>
              <div class="advisor-subtitle">${i18n.get('whereToSellSub')}</div>
            </div>

            <div class="crop-selector-pills">
              <button class="crop-pill active" onclick="window.FF_APP.changeLogisticsCrop('tomato', this)">🍅 Tomato</button>
              <button class="crop-pill" onclick="window.FF_APP.changeLogisticsCrop('onion', this)">🧅 Onion</button>
              <button class="crop-pill" onclick="window.FF_APP.changeLogisticsCrop('potato', this)">🥔 Potato</button>
              <button class="crop-pill" onclick="window.FF_APP.changeLogisticsCrop('capsicum', this)">🫑 Capsicum</button>
            </div>
          </div>

          <div id="market-advisor-content">
            <!-- Rendered by window.FF_LOGISTICS -->
          </div>
        </div>

        <!-- Hyperlocal Agro-Weather & Spray Advisory -->
        <div class="weather-advisory-strip">
          <div class="weather-metric">
            <div class="weather-icon">🌤️</div>
            <div class="weather-metric-info">
              <div class="weather-temp">${weather.temp}</div>
              <div class="weather-sub">${weather.condition}</div>
            </div>
          </div>
          <div class="weather-metric">
            <div class="weather-icon">💧</div>
            <div class="weather-metric-info">
              <div class="weather-temp">${weather.humidity}</div>
              <div class="weather-sub">${isHi ? 'हवा में नमी' : 'Relative Air Humidity'}</div>
            </div>
          </div>
          <div class="weather-metric">
            <div class="weather-icon">💨</div>
            <div class="weather-metric-info">
              <div class="weather-temp">${weather.windSpeed}</div>
              <div class="weather-sub">${weather.rainfallForecast}</div>
            </div>
          </div>
          <div class="spray-advice-box">
            <div class="spray-title">🌱 ${i18n.get('sprayAdvice')}</div>
            <div class="spray-msg">${weather.sprayAdvisory.recommendation}</div>
          </div>
        </div>

        <!-- SECTION: Live Mandi vs FarmFlow Net Realization Comparator -->
        <div id="mandi-comparator-section" class="mandi-comparator-wrap">
          <div class="comparator-header">
            <div class="comparator-title-area">
              <div class="comparator-title">
                <span>⚖️</span>
                <span>${i18n.get('mandiCompTitle')}</span>
              </div>
              <div class="comparator-subtitle">${i18n.get('mandiCompSub')}</div>
            </div>

            <div class="crop-selector-pills">
              <button class="crop-pill active" onclick="window.FF_APP.changeCrop('tomato', this)">🍅 ${isHi ? 'टमाटर' : 'Tomato'}</button>
              <button class="crop-pill" onclick="window.FF_APP.changeCrop('onion', this)">🧅 ${isHi ? 'प्याज' : 'Onion'}</button>
              <button class="crop-pill" onclick="window.FF_APP.changeCrop('potato', this)">🥔 ${isHi ? 'आलू' : 'Potato'}</button>
              <button class="crop-pill" onclick="window.FF_APP.changeCrop('capsicum', this)">🫑 ${isHi ? 'शिमला मिर्च' : 'Capsicum'}</button>
            </div>
          </div>

          <div id="mandi-comparator-content">
            <!-- Rendered by window.FF_MANDI -->
          </div>
        </div>

        <!-- SECTION: AI Crop Doctor ("Kisan Doctor") -->
        <div id="crop-doctor-section" class="crop-doctor-box">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>🩺</span>
                <span>${i18n.get('doctorTitle')}</span>
              </div>
              <div class="ff-card-subtitle">${i18n.get('doctorSub')}</div>
            </div>
            <span class="badge badge-success">${isHi ? 'आईसीएआर प्रमाणित' : 'ICAR Certified Advisory'}</span>
          </div>

          <div class="doctor-grid">
            <div class="doctor-scan-area">
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">
                ${isHi ? 'जांच के लिए पत्ती का नमूना चुनें:' : 'Select Leaf Sample to Diagnose:'}
              </div>

              <div class="leaf-samples-tray">
                <div class="leaf-sample-btn active" onclick="window.FF_APP.selectLeaf('early_blight', this)">
                  <div class="leaf-sample-img" style="background: #fef3c7;">🍂</div>
                  <span class="leaf-sample-label">${isHi ? 'अगेती झुलसा' : 'Early Blight'}</span>
                </div>
                <div class="leaf-sample-btn" onclick="window.FF_APP.selectLeaf('late_blight', this)">
                  <div class="leaf-sample-img" style="background: #fee2e2;">🥀</div>
                  <span class="leaf-sample-label">${isHi ? 'पछेती झुलसा' : 'Late Blight'}</span>
                </div>
                <div class="leaf-sample-btn" onclick="window.FF_APP.selectLeaf('leaf_curl', this)">
                  <div class="leaf-sample-img" style="background: #ffedd5;">🌱</div>
                  <span class="leaf-sample-label">${isHi ? 'मरोड़िया रोग' : 'Leaf Curl'}</span>
                </div>
                <div class="leaf-sample-btn" onclick="window.FF_APP.selectLeaf('healthy_crop', this)">
                  <div class="leaf-sample-img" style="background: #dcfce7;">🌿</div>
                  <span class="leaf-sample-label">${isHi ? 'स्वस्थ पत्ती' : 'Healthy Leaf'}</span>
                </div>
              </div>

              <div class="upload-leaf-zone" onclick="window.FF_APP.simulateUpload()">
                <div style="font-size: 2rem;">📸</div>
                <div style="font-weight: 700; font-size: 0.95rem; color: var(--primary-800); margin-top: 6px;">
                  ${isHi ? 'फोटो लें या पत्ती अपलोड करें' : 'Take Photo or Upload Leaf'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${isHi ? 'तत्काल कंप्यूटर विजन रोग निदान' : 'Instant AI Computer Vision diagnosis'}</div>
              </div>
            </div>

            <div id="doctor-results-panel" class="doctor-results-panel">
              <!-- Rendered by window.FF_DOCTOR -->
            </div>
          </div>
        </div>

        <!-- SECTION: Nearby Solar Micro-Cold Storage -->
        <div id="cold-storage-section" class="ff-card" style="margin-bottom: 28px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>❄️</span>
                <span>${isHi ? 'सोलर फार्म-गेट माइक्रो कोल्ड स्टोरेज' : 'Solar-Powered Farm-Gate Micro Cold Storages'}</span>
              </div>
              <div class="ff-card-subtitle">
                ${isHi ? 'मंडी में दाम गिरने पर मजबूरी में फसल बेचने से बचें। 100% सौर ऊर्जा संचालित।' : 'Store produce near the farm to prevent distress sales when market dips. Powered by 100% solar PV.'}
              </div>
            </div>
            <span class="badge badge-info">${isHi ? 'शून्य संकट बिक्री' : 'Zero Distress Selling'}</span>
          </div>

          <div class="cold-storage-grid">
            ${window.FF_DATA.coldStorages.map(cs => `
              <div class="cold-card">
                <div class="cold-header">
                  <div class="cold-name">${cs.name}</div>
                  <span class="cold-distance">${cs.distanceKm} km ${isHi ? 'दूर' : 'away'}</span>
                </div>
                <div style="font-size: 0.82rem; color: var(--text-muted);">${cs.location}</div>
                <div class="cold-stats-row">
                  <span>${isHi ? 'उपलब्ध क्रेट्स:' : 'Available Space:'}</span>
                  <span class="cold-stats-val" style="color: #16a34a;">${cs.availableCrates} Crates</span>
                </div>
                <div class="cold-stats-row">
                  <span>${isHi ? 'तापमान:' : 'Temperature:'}</span>
                  <span class="cold-stats-val">${cs.tempC}</span>
                </div>
                <div class="cold-stats-row">
                  <span>${isHi ? 'किराया:' : 'Rental Rate:'}</span>
                  <span class="cold-stats-val" style="color: var(--primary-700);">${cs.ratePerCrateDay}</span>
                </div>
                <button class="btn-book-slot" onclick="window.FF_APP.bookColdStorage('${cs.name}')">
                  ${i18n.get('bookColdSlot')}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Render Sub-Components
      window.FF_LOGISTICS.renderAdvisor();
      window.FF_MANDI.renderComparator();
      window.FF_DOCTOR.renderResults();
    },

    changeLogisticsCrop(cropKey, btnEl) {
      document.querySelectorAll('#where-to-sell-section .crop-pill').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      window.FF_LOGISTICS.setCrop(cropKey);
    },

    withdrawFarmerDBT() {
      const farmer = window.FF_DATA.currentFarmer;
      const amount = farmer.walletBalanceRs;
      if (amount <= 0) {
        this.showToast('Wallet balance is ₹ 0.00', 'info');
        return;
      }

      farmer.walletBalanceRs = 0;
      this.renderCurrentView();
      this.showToast(`⚡ ₹ ${amount.toLocaleString()}.00 successfully transferred to SBI A/c ••••8842 via Aadhaar DBT! UTR: SBI9942188219`, 'success');
      window.FF_VOICE.speak(`Amount of ${amount} rupees has been credited directly to your bank account via D B T.`);
    },

    // ========================================================================
    // 2. CONSUMER FARM-TO-FORK E-COMMERCE STOREFRONT
    // ========================================================================
    renderConsumerView(container) {
      const selectedSocId = window.FF_STORE.selectedSocietyId || 'SOC-01';
      const cluster = (window.FF_DATA.consumerSocieties || []).find(s => s.id === selectedSocId) || window.FF_DATA.consumerSocieties[0];
      const progressPct = Math.min(100, Math.round((cluster.currentPoolKg / cluster.targetPoolKg) * 100));
      const kgNeeded = Math.max(0, cluster.targetPoolKg - cluster.currentPoolKg);
      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';

      container.innerHTML = `
        <!-- E-Commerce Store Hero Banner -->
        <div class="store-hero-banner">
          <div class="store-hero-tag">
            <span>🌱</span>
            <span>${isHi ? 'प्रत्यक्ष फार्म-टू-किचन स्टोर • शून्य बिचौलिए' : 'Direct Farm-to-Fork Marketplace • Zero Middlemen'}</span>
          </div>
          <h1 class="store-hero-title">${i18n.get('storeTitle')}</h1>
          <p class="store-hero-desc">${i18n.get('storeSub')}</p>
        </div>

        <!-- Neighborhood Group-Buy Cluster Progress Bar & Society Switcher -->
        <div class="cluster-progress-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900);">
              🏘️ ${isHi ? 'अपना हाउसिंग सोसायटी हब चुनें:' : 'Select Your Apartment / Housing Society Hub:'}
            </div>
            <div class="society-selector-tray" style="margin: 0;">
              ${(window.FF_DATA.consumerSocieties || []).map(soc => `
                <button class="society-pill-btn ${soc.id === cluster.id ? 'active' : ''}" onclick="window.FF_STORE.setSociety('${soc.id}')">
                  ${soc.name} (${soc.unitsCount} flats)
                </button>
              `).join('')}
            </div>
          </div>

          <div class="cluster-progress-info">
            <div class="cluster-progress-title">
              <span>🏘️</span>
              <span>${cluster.name} ${isHi ? 'सामूहिक पूल' : 'Group-Buy Pool'}</span>
              <span class="badge ${cluster.currentPoolKg >= cluster.targetPoolKg ? 'badge-success' : 'badge-warning'}">
                ${cluster.currentPoolKg >= cluster.targetPoolKg ? '✓ Extra 15% OFF Active!' : '15% Group-Buy Discount'}
              </span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              <strong>${cluster.currentPoolKg} kg</strong> ${isHi ? 'बुक हुआ' : 'pooled of'} <strong>${cluster.targetPoolKg} kg</strong> ${isHi ? 'लक्ष्य में से। ' + cluster.scheduledDelivery + ' पर डिलीवरी।' : 'target. Scheduled for ' + cluster.scheduledDelivery + ' at ' + cluster.hubDropLocation}
            </div>
            <div class="cluster-meter-wrap">
              <div class="cluster-meter-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: 800; color: #166534; font-family: 'Outfit', sans-serif;">${progressPct}% Reached</div>
            <div style="font-size: 0.78rem; color: #15803d;">
              ${kgNeeded > 0 ? `${kgNeeded} kg needed to unlock free green chillies & society bonus!` : '🎉 Target Reached! Extra 15% discount applied to all orders.'}
            </div>
          </div>
        </div>

        <!-- Store Filter & Search Bar -->
        <div class="store-filter-bar">
          <div class="category-filter-chips">
            <button class="filter-chip active" onclick="window.FF_APP.changeStoreCategory('all', this)">All Produce</button>
            <button class="filter-chip" onclick="window.FF_APP.changeStoreCategory('solanaceous', this)">🍅 Tomatoes & Peppers</button>
            <button class="filter-chip" onclick="window.FF_APP.changeStoreCategory('tubers', this)">🥔 Onions & Potatoes</button>
            <button class="filter-chip" onclick="window.FF_APP.changeStoreCategory('condiments', this)">🌶️ Chillies</button>
            <button class="filter-chip" onclick="window.FF_APP.changeStoreCategory('combos', this)">🧺 Curated Family Boxes</button>
          </div>

          <div class="store-search-box">
            <span>🔍</span>
            <input type="text" class="store-search-input" placeholder="Search fresh produce or farmer..." oninput="window.FF_STORE.setSearch(this.value)">
          </div>
        </div>

        <!-- Products Grid -->
        <div id="store-products-grid" class="products-grid">
          <!-- Rendered by window.FF_STORE -->
        </div>

        <!-- Batch QR Provenance Tracer -->
        <div style="background: #ffffff; border: 2px dashed #16a34a; border-radius: var(--radius-xl); padding: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; box-shadow: var(--shadow-sm);">
          <div>
            <h3 style="color: var(--primary-900); font-size: 1.25rem;">📱 Farm-to-Fork Batch Traceability (Tamper-Proof QR)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Every crate is sealed at the village spoke with a certified digital load-cell QR code tracing harvest hour, vehicle temperature logs, and farmer identity.
            </p>
          </div>
          <div style="display: flex; gap: 14px; align-items: center;">
            <div class="qr-box">📱</div>
            <button class="btn btn-secondary" onclick="window.FF_APP.openReceiptModal('Ramesh Patel', 650)">
              🔍 Scan Sample Batch Certificate
            </button>
          </div>
        </div>
      `;

      window.FF_STORE.renderProductGrid();
    },

    changeStoreCategory(cat, btnEl) {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      window.FF_STORE.setCategory(cat);
    },

    // ========================================================================
    // 3. LOGISTICS & ON-DEMAND FARM TRANSPORT (HERO SHOWCASE)
    // ========================================================================
    renderLogisticsView(container) {
      const i18n = window.FF_I18N;
      const activeSub = window.FF_LOGISTICS.activeTab || 'CORRIDOR';

      container.innerHTML = `
        <!-- Logistics Hero Banner -->
        <div class="store-hero-banner" style="background: linear-gradient(135deg, #091a10 0%, #0f2e1c 50%, #0369a1 100%);">
          <div class="store-hero-tag" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">
            <span>🚚</span>
            <span>Cold-Chain Telemetry & On-Demand Farm Logistics</span>
          </div>
          <h1 class="store-hero-title">${i18n.get('logisticsTitle')}</h1>
          <p class="store-hero-desc">${i18n.get('logisticsSub')}</p>
        </div>

        <!-- 4 Sub-Tabs for Hero Logistics -->
        <div class="fpo-tabs-strip" style="margin-bottom: 24px;">
          <button class="fpo-tab-btn ${activeSub === 'CORRIDOR' ? 'active' : ''}" onclick="window.FF_LOGISTICS.switchLogisticsTab('CORRIDOR')">
            <span>🛣️</span>
            <span>1. ${i18n.get('tabCorridor')}</span>
          </button>
          <button class="fpo-tab-btn ${activeSub === 'BOOKING' ? 'active' : ''}" onclick="window.FF_LOGISTICS.switchLogisticsTab('BOOKING')">
            <span>⚡</span>
            <span>2. ${i18n.get('tabBookPickup')} (Blinkit / Porter)</span>
          </button>
          <button class="fpo-tab-btn ${activeSub === 'PARTNER' ? 'active' : ''}" onclick="window.FF_LOGISTICS.switchLogisticsTab('PARTNER')">
            <span>🤝</span>
            <span>3. ${i18n.get('tabPartnerDesk')}</span>
          </button>
          <button class="fpo-tab-btn ${activeSub === 'SPOILAGE' ? 'active' : ''}" onclick="window.FF_LOGISTICS.switchLogisticsTab('SPOILAGE')">
            <span>🧪</span>
            <span>4. ${i18n.get('tabSpoilageSim')}</span>
          </button>
        </div>

        <!-- Dynamic Subtab Content -->
        <div id="logistics-subtab-container">
          ${this.renderLogisticsSubtabContent(activeSub)}
        </div>
      `;
    },

    renderLogisticsSubtabContent(activeSub) {
      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';

      if (activeSub === 'BOOKING') {
        const opts = window.FF_DATA.transportOptions;
        const defaultVeh = opts[0];
        const estFare = defaultVeh.baseFareRs + Math.round(4.2 * defaultVeh.perKmRs);

        return `
          <div class="transport-booking-widget">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-light); padding-bottom: 14px;">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">
                  ⚡ ${i18n.get('bookTransportTitle')}
                </h3>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                  ${i18n.get('bookTransportSub')}
                </div>
              </div>
              <span class="badge badge-success">● Instant Farmgate ETA: 12-18 mins</span>
            </div>

            <div class="grid-2" style="margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label">${i18n.get('fieldPickupLabel')}</label>
                <input type="text" class="form-control" value="Vokkaleri Village, Field No. 4 (Ramesh Patel)" readonly style="background: #f8fafc;">
              </div>
              <div class="form-group">
                <label class="form-label">${i18n.get('destHubLabel')}</label>
                <select class="form-control" id="booking-dest-select" onchange="window.FF_LOGISTICS.updateFareEstimate()">
                  <option value="4.2">Kolar Solar Pre-cooling Spoke (4.2 km)</option>
                  <option value="18.5">Hoskote Line-Haul Cross-Dock (18.5 km)</option>
                  <option value="48.0">Bengaluru Peri-Urban Hub Gate 2 (48.0 km)</option>
                </select>
              </div>
            </div>

            <label class="form-label" style="font-weight: 700;">${i18n.get('vehicleSelectLabel')}</label>
            <div class="vehicle-select-grid">
              ${opts.map(v => `
                <div class="vehicle-choice-card ${v.id === window.FF_LOGISTICS.selectedVehicleId ? 'selected' : ''}" data-veh-id="${v.id}" onclick="window.FF_LOGISTICS.selectVehicle('${v.id}')">
                  <div class="vehicle-choice-header">
                    <div class="vehicle-choice-icon">${v.icon}</div>
                    <div>
                      <div class="vehicle-choice-name">${v.name}</div>
                      <span class="vehicle-choice-tag">${v.tag}</span>
                    </div>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                    Capacity: <strong>${v.capacityKg} kg (${v.cratesCap} Crates)</strong><br>
                    ${v.coldSupport}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 8px;">
                    <span class="driver-eta-pill">⚡ Driver ETA: ${v.etaMins} mins</span>
                    <strong style="color: var(--primary-900); font-size: 1.1rem;">₹ ${v.baseFareRs} + ₹${v.perKmRs}/km</strong>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-lg); padding: 18px; margin-top: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <div>
                <span style="font-size: 0.85rem; color: #166534;">Estimated Upfront Fare (Direct to Driver via Bank Escrow):</span>
                <div id="booking-est-fare-display" style="font-size: 1.35rem; font-weight: 800; color: #15803d;">₹ ${estFare} (Inclusive of GST & Tolls)</div>
              </div>
              <button class="btn btn-primary" onclick="window.FF_LOGISTICS.confirmTransportBooking()">
                ${i18n.get('confirmBookingBtn')}
              </button>
            </div>
          </div>
        `;
      } else if (activeSub === 'PARTNER') {
        const loads = window.FF_DATA.partnerLoads;
        return `
          <div class="partner-board-panel">
            <div class="partner-status-bar">
              <div>
                <div style="font-size: 1.15rem; font-weight: 800;">${i18n.get('partnerDeskTitle')}</div>
                <div id="driver-partner-status-text" style="font-size: 0.82rem; color: #94a3b8; margin-top: 2px;">
                  ${window.FF_LOGISTICS.isDriverOnline ? '🟢 <strong>You are Online</strong> • Receiving harvest pickup requests nearby' : '🔴 <strong>You are Offline</strong>'}
                </div>
              </div>
              <div style="display: flex; gap: 10px; align-items: center;">
                <span style="font-size: 0.85rem; color: #cbd5e1;">Today's Payout: <strong>₹ 1,850.00</strong></span>
                <button id="btn-driver-status-toggle" class="btn btn-sm ${window.FF_LOGISTICS.isDriverOnline ? 'btn-secondary' : 'btn-primary'}" onclick="window.FF_LOGISTICS.toggleDriverOnline()">
                  ${window.FF_LOGISTICS.isDriverOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>
            </div>

            <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary-900); margin-bottom: 12px;">
              📦 Available Harvest Loads Nearby (Direct Farmer Bookings):
            </div>

            <div class="loads-grid">
              ${loads.map(load => `
                <div class="load-card">
                  <div class="load-card-head">
                    <div>
                      <span class="badge badge-success">${load.pickupWindow}</span>
                      <div style="font-size: 1.05rem; font-weight: 800; color: var(--primary-900); margin-top: 4px;">${load.crop}</div>
                    </div>
                    <div class="load-fare-badge">₹ ${load.offerFareRs}</div>
                  </div>

                  <div class="load-route-row">
                    <div>📍 <strong>Pickup:</strong> ${load.pickupVillage}</div>
                    <div>🏁 <strong>Delivery:</strong> ${load.destHub}</div>
                  </div>

                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted);">
                    <span>Volume: <strong>${load.weightKg} kg (${load.cratesCount} Crates)</strong></span>
                    <span>Farmer: <strong>${load.farmerName}</strong></span>
                  </div>

                  <button id="btn-accept-${load.id}" class="btn btn-sm ${load.status === 'ACCEPTED' ? 'btn-secondary' : 'btn-primary'}" ${load.status === 'ACCEPTED' ? 'disabled' : ''} onclick="window.FF_LOGISTICS.acceptPartnerLoad('${load.id}')">
                    ${load.status === 'ACCEPTED' ? '✓ Trip Accepted' : i18n.get('acceptTripBtn')}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (activeSub === 'SPOILAGE') {
        return `
          <div class="spoilage-lab-container">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 14px;">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">
                  🧪 ${i18n.get('spoilageLabTitle')}
                </h3>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                  ${i18n.get('spoilageLabSub')}
                </div>
              </div>
              <span class="badge badge-info">Lot Size: 2,000 kg Tomatoes</span>
            </div>

            <!-- Sliders -->
            <div class="spoilage-controls-row">
              <div class="spoilage-slider-group">
                <div style="display: flex; justify-content: space-between; font-weight: 700;">
                  <span>☀️ Ambient Summer Heat:</span>
                  <span id="ambient-temp-val" style="color: #dc2626; font-size: 1.15rem; font-weight: 800;">38°C</span>
                </div>
                <input type="range" min="25" max="44" step="1" value="38" oninput="window.FF_LOGISTICS.setAmbientTemp(this.value)" style="cursor: pointer;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Range: 25°C (Pleasant) to 44°C (Scorching Heat Wave)</span>
              </div>

              <div class="spoilage-slider-group">
                <div style="display: flex; justify-content: space-between; font-weight: 700;">
                  <span>⏳ Bengaluru Traffic Delay:</span>
                  <span id="transit-delay-val" style="color: #ea580c; font-size: 1.15rem; font-weight: 800;">3.5 Hours</span>
                </div>
                <input type="range" min="1" max="8" step="0.5" value="3.5" oninput="window.FF_LOGISTICS.setTransitDelay(this.value)" style="cursor: pointer;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Range: 1 Hour (Clear Highway) to 8 Hours (Severe City Jam)</span>
              </div>
            </div>

            <!-- Comparison Output -->
            <div class="spoilage-comparison-grid">
              <div class="spoilage-scenario-box spoilage-traditional">
                <div style="font-size: 1.1rem; font-weight: 800;">❌ Traditional Open Tempo (No Cooling)</div>
                <div id="open-spoilage-pct" style="font-size: 1.8rem; font-weight: 800;">32.5% Rotten / Lost</div>
                <div id="open-spoilage-loss" style="font-size: 1rem; font-weight: 700;">650 kg (₹ 16,900 Lost)</div>
                <div style="font-size: 0.8rem; line-height: 1.4;">
                  Unshielded tomatoes subjected to heat fermentation, crate crushing, and microbial rot during congestion.
                </div>
              </div>

              <div class="spoilage-scenario-box spoilage-farmflow">
                <div style="font-size: 1.1rem; font-weight: 800;">✅ FarmFlow Active Chiller (+6°C Stable)</div>
                <div id="reefer-spoilage-pct" style="font-size: 1.8rem; font-weight: 800; color: #15803d;">1.1% Spoilage</div>
                <div id="reefer-spoilage-loss" style="font-size: 1rem; font-weight: 700; color: #166534;">22 kg (Only ₹ 572)</div>
                <div style="font-size: 0.8rem; line-height: 1.4;">
                  Cold-chain prevents respiration breakdown, preserving firm export texture and 99% market value.
                </div>
              </div>
            </div>

            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-lg); padding: 18px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.85rem; color: #166534;">Farmer Wealth Protected on 2,000 kg Lot:</span>
                <div id="spoilage-saved-rs" style="font-size: 1.5rem; font-weight: 800; color: #15803d;">₹ 16,328.00</div>
              </div>
              <button class="btn btn-primary" onclick="window.FF_APP.showToast('✅ Cold-chain simulation validated: Over 95% food waste avoided!', 'success')">
                Validate Cold-Chain Impact
              </button>
            </div>
          </div>
        `;
      } else {
        // CORRIDOR & FLEET TELEMETRY
        return `
          <!-- 4 Core Logistics Telemetry Metrics -->
          <div class="grid-4" style="margin-bottom: 28px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">❄️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">6.2°C</div>
                <div class="farmer-stat-label">Corridor Reefer Temp</div>
                <div class="farmer-stat-tag">Chill Zone Maintained</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">📉</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">1.2%</div>
                <div class="farmer-stat-label">Transit Spoilage Loss</div>
                <div class="farmer-stat-tag">Down from 28% Open Tempo</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">🚛</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">3 Vehicles</div>
                <div class="farmer-stat-label">Active Fleet Units</div>
                <div class="farmer-stat-tag">1 Standby at Hoskote</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">⚡</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">68% Lower</div>
                <div class="farmer-stat-label">Last-Mile Freight Cost</div>
                <div class="farmer-stat-tag">Via Cluster Group Dispatch</div>
              </div>
            </div>
          </div>

          <!-- INTERACTIVE LOGISTICS CORRIDOR SCHEMATIC -->
          <div class="corridor-map-container">
            <div class="corridor-header-row">
              <div>
                <div class="corridor-title">
                  <span>🛣️</span>
                  <span>Active NH-75 Cold-Chain Logistics Corridor Schematic</span>
                </div>
                <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 2px;">
                  Physical consolidation: Rural Collection Spokes ➔ Line-Haul Corridors ➔ Urban Peri-Hub ➔ Demand Clusters.
                </div>
              </div>
              <span class="corridor-live-pill">● REEFER IN TRANSIT (54 KM/H)</span>
            </div>

            <!-- 5-Stage Physical Waypoints Track -->
            <div class="corridor-track-wrapper">
              <div class="corridor-node-box">
                <span class="node-step-tag">Waypoint 1</span>
                <div class="node-name">Kolar Solar Spoke</div>
                <div class="node-detail">Weighbridge & Pre-cooling</div>
                <span class="node-status-pill">✓ 2,200 kg Loaded</span>
              </div>

              <div class="corridor-node-box active-hub">
                <span class="node-step-tag">Waypoint 2 (Active)</span>
                <div class="node-name">NH-75 Expressway</div>
                <div class="node-detail">Mile 42 • Speed: 54 km/h</div>
                <span class="node-status-pill">⚡ Temp: 6.2°C Chill</span>
              </div>

              <div class="corridor-node-box">
                <span class="node-step-tag">Waypoint 3</span>
                <div class="node-name">Hoskote Cross-Dock</div>
                <div class="node-detail">Standby Hub KA-51-B-3310</div>
                <span class="node-status-pill">● Standby Ready</span>
              </div>

              <div class="corridor-node-box">
                <span class="node-step-tag">Waypoint 4</span>
                <div class="node-name">Bengaluru Peri-Hub</div>
                <div class="node-detail">Gate 3 Central Sorting</div>
                <span class="node-status-pill">ETA: 38 mins</span>
              </div>

              <div class="corridor-node-box">
                <span class="node-step-tag">Waypoint 5</span>
                <div class="node-name">Whitefield Cluster</div>
                <div class="node-detail">E-Loader Last-Mile Drop</div>
                <span class="node-status-pill">120 Households</span>
              </div>
            </div>
          </div>

          <!-- VISUAL FLEET TELEMETRY CARDS -->
          <div class="ff-card" style="margin-bottom: 28px;">
            <div class="ff-card-header">
              <div>
                <div class="ff-card-title">
                  <span>🚛</span>
                  <span>Active Refrigerated & Electric Fleet (Live IoT Telemetry)</span>
                </div>
                <div class="ff-card-subtitle">Real-time load capacity, thermal sensor feeds, and corridor telemetry.</div>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-sm btn-secondary" onclick="window.FF_LOGISTICS.openBookingModal()">🚚 Book Farmgate Pickup</button>
                <button class="btn btn-sm btn-danger" onclick="window.FF_CHAIN.triggerBreakdown()">🚨 Simulate Incident</button>
              </div>
            </div>

            <div class="fleet-telemetry-grid">
              <!-- Vehicle 1: Eicher Reefer -->
              <div class="fleet-vehicle-card">
                <div class="vehicle-header">
                  <span class="vehicle-plate-pill">KA-04-E-4421</span>
                  <span class="vehicle-status-badge status-transit">● IN TRANSIT</span>
                </div>

                <div class="vehicle-visual-row">
                  <div class="vehicle-icon-bubble">🚛</div>
                  <div class="vehicle-details">
                    <div class="vehicle-model">Refrigerated 4-Ton Eicher</div>
                    <div class="vehicle-corridor">NH-75 Line-Haul Corridor</div>
                  </div>
                </div>

                <div class="thermal-monitor-widget">
                  <div class="thermal-left">
                    <span class="thermal-icon-pulse">❄️</span>
                    <div>
                      <div class="thermal-temp">6.2°C</div>
                      <div class="thermal-sub">Chamber Temperature</div>
                    </div>
                  </div>
                  <span class="thermal-state-tag">CHILL ZONE SAFE</span>
                </div>

                <div class="payload-wrap">
                  <div class="payload-label-row">
                    <span>Payload Utilization:</span>
                    <strong>2,200 kg / 4,000 kg (55%)</strong>
                  </div>
                  <div class="payload-bar-outer">
                    <div class="payload-bar-fill" style="width: 55%;"></div>
                  </div>
                </div>

                <div class="vehicle-driver-info">
                  <span>Driver: <strong>Manjunath (+91 99002 44321)</strong></span>
                  <span>Speed: <strong>54 km/h</strong></span>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn-ping-telemetry" style="flex: 1;" onclick="window.FF_LOGISTICS.showVehicleTelemetry('KA-04-E-4421')">
                    <span>📡</span>
                    <span>IoT Sensor Log</span>
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="window.FF_LOGISTICS.openEWayBillModal('KA-04-E-4421')">
                    <span>📄</span>
                    <span>e-Way Bill</span>
                  </button>
                </div>
              </div>

              <!-- Vehicle 2: Standby Reefer -->
              <div class="fleet-vehicle-card">
                <div class="vehicle-header">
                  <span class="vehicle-plate-pill">KA-51-B-3310</span>
                  <span class="vehicle-status-badge status-standby">● STANDBY READY</span>
                </div>

                <div class="vehicle-visual-row">
                  <div class="vehicle-icon-bubble" style="background: #fef3c7;">🚚</div>
                  <div class="vehicle-details">
                    <div class="vehicle-model">Standby Reefer 3.5-Ton</div>
                    <div class="vehicle-corridor">Stationed at Hoskote Hub</div>
                  </div>
                </div>

                <div class="thermal-monitor-widget" style="background: linear-gradient(135deg, #1e293b, #334155);">
                  <div class="thermal-left">
                    <span class="thermal-icon-pulse">❄️</span>
                    <div>
                      <div class="thermal-temp" style="color: #67e8f9;">4.0°C</div>
                      <div class="thermal-sub">Pre-Cooled Chamber</div>
                    </div>
                  </div>
                  <span class="thermal-state-tag" style="border-color: #67e8f9; color: #67e8f9;">STANDBY SHIFT</span>
                </div>

                <div class="payload-wrap">
                  <div class="payload-label-row">
                    <span>Standby Capacity:</span>
                    <strong>0 kg / 3,500 kg (0%)</strong>
                  </div>
                  <div class="payload-bar-outer">
                    <div class="payload-bar-fill" style="width: 0%;"></div>
                  </div>
                </div>

                <div class="vehicle-driver-info">
                  <span>Driver: <strong>Gururaj (+91 97311 00223)</strong></span>
                  <span>Response: <strong>&lt; 15 mins</strong></span>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn-ping-telemetry" style="flex: 1;" onclick="window.FF_LOGISTICS.showVehicleTelemetry('KA-51-B-3310')">
                    <span>📡</span>
                    <span>Inspect Readiness</span>
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="window.FF_LOGISTICS.openEWayBillModal('KA-51-B-3310')">
                    <span>📄</span>
                    <span>e-Way Bill</span>
                  </button>
                </div>
              </div>

              <!-- Vehicle 3: Mahindra E-Loader -->
              <div class="fleet-vehicle-card">
                <div class="vehicle-header">
                  <span class="vehicle-plate-pill">KA-03-D-9912</span>
                  <span class="vehicle-status-badge status-dispatch">● LAST MILE</span>
                </div>

                <div class="vehicle-visual-row">
                  <div class="vehicle-icon-bubble" style="background: #e0f2fe;">🛵</div>
                  <div class="vehicle-details">
                    <div class="vehicle-model">Mahindra Zor Grand E-Loader</div>
                    <div class="vehicle-corridor">Whitefield Cluster Route</div>
                  </div>
                </div>

                <div class="thermal-monitor-widget" style="background: linear-gradient(135deg, #064e3b, #047857);">
                  <div class="thermal-left">
                    <span class="thermal-icon-pulse">⚡</span>
                    <div>
                      <div class="thermal-temp" style="color: #a7f3d0;">88%</div>
                      <div class="thermal-sub">EV Battery Charge</div>
                    </div>
                  </div>
                  <span class="thermal-state-tag" style="border-color: #a7f3d0; color: #a7f3d0;">ZERO EMISSION</span>
                </div>

                <div class="payload-wrap">
                  <div class="payload-label-row">
                    <span>Cluster Load:</span>
                    <strong>700 kg / 800 kg (87%)</strong>
                  </div>
                  <div class="payload-bar-outer">
                    <div class="payload-bar-fill" style="width: 87%; background: linear-gradient(90deg, #0284c7, #38bdf8);"></div>
                  </div>
                </div>

                <div class="vehicle-driver-info">
                  <span>Driver: <strong>Kiran (+91 88612 99014)</strong></span>
                  <span>Drop: <strong>Gate 2 Cluster</strong></span>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn-ping-telemetry" style="flex: 1;" onclick="window.FF_LOGISTICS.showVehicleTelemetry('KA-03-D-9912')">
                    <span>📡</span>
                    <span>Cluster Route</span>
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="window.FF_LOGISTICS.openEWayBillModal('KA-03-D-9912')">
                    <span>📄</span>
                    <span>e-Way Bill</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    },

    // ========================================================================
    // 4. FPO COOPERATIVE WORKBENCH (PRACTICAL NABARD/SFAC MODEL)
    // ========================================================================
    renderFPOView(container) {
      const fpo = window.FF_DATA.fpoInfo;
      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';

      container.innerHTML = `
        <div class="ff-card" style="margin-bottom: 28px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>🏢</span>
                <span>${fpo.name}</span>
              </div>
              <div class="ff-card-subtitle">${fpo.regNo} • ${isHi ? 'नाबार्ड समर्थित 242 किसान सदस्य' : 'NABARD & SFAC Supported • 242 Smallholder Farmer Members'}</div>
            </div>
            <span class="badge badge-success">COOPERATIVE ACTIVE</span>
          </div>

          <!-- 4 Real FPO Management Dials -->
          <div class="grid-4" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">🚜</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">2,200 kg</div>
                <div class="farmer-stat-label">${isHi ? 'सक्रिय संकलन कोटा' : 'Active Forward Quota'}</div>
                <div class="farmer-stat-tag">FreshMart Order #ORD-8812</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">⚖️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">${fpo.collectedSoFarKg} kg</div>
                <div class="farmer-stat-label">${isHi ? 'संकलित उपज' : 'Collected Produce'}</div>
                <div class="farmer-stat-tag">91% Fulfilled</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">💰</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">₹ 4,32,400</div>
                <div class="farmer-stat-label">${isHi ? 'मासिक सदस्य भुगतान' : 'Monthly Member Payout'}</div>
                <div class="farmer-stat-tag">Direct DBT Credits</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">❄️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">840 Crates</div>
                <div class="farmer-stat-label">${isHi ? 'सोलर कोल्ड रूम शेष' : 'Cold Storage Available'}</div>
                <div class="farmer-stat-tag">1,660 Crates In Store</div>
              </div>
            </div>
          </div>

          <!-- FPO Practical Workbenches 4 Tabs -->
          <div class="fpo-tabs-strip">
            <button class="fpo-tab-btn ${this.activeFpoTab === 'QUOTA' ? 'active' : ''}" onclick="window.FF_APP.switchFpoTab('QUOTA')">
              <span>📋</span>
              <span>${i18n.get('fpoTabQuota')}</span>
            </button>
            <button class="fpo-tab-btn ${this.activeFpoTab === 'INTAKE' ? 'active' : ''}" onclick="window.FF_APP.switchFpoTab('INTAKE')">
              <span>⚖️</span>
              <span>${i18n.get('fpoTabIntake')}</span>
            </button>
            <button class="fpo-tab-btn ${this.activeFpoTab === 'MACHINERY' ? 'active' : ''}" onclick="window.FF_APP.switchFpoTab('MACHINERY')">
              <span>🚜</span>
              <span>${i18n.get('fpoTabInputs')}</span>
            </button>
            <button class="fpo-tab-btn ${this.activeFpoTab === 'LEDGER' ? 'active' : ''}" onclick="window.FF_APP.switchFpoTab('LEDGER')">
              <span>📊</span>
              <span>${i18n.get('fpoTabLedger')}</span>
            </button>
          </div>

          <!-- Dynamic FPO Tab Content Area -->
          <div id="fpo-subtab-container">
            ${this.renderFpoSubtabContent()}
          </div>
        </div>
      `;
    },

    switchFpoTab(tabKey) {
      this.activeFpoTab = tabKey;
      const subContainer = document.getElementById('fpo-subtab-container');
      if (subContainer) {
        subContainer.innerHTML = this.renderFpoSubtabContent();
      }
      document.querySelectorAll('.fpo-tab-btn').forEach(btn => {
        const check = tabKey === 'QUOTA' ? '1.' : (tabKey === 'INTAKE' ? '2.' : (tabKey === 'MACHINERY' ? '3.' : '4.'));
        btn.classList.toggle('active', btn.textContent.includes(check));
      });
    },

    renderFpoSubtabContent() {
      const isHi = window.FF_I18N.currentLang === 'hi';

      if (this.activeFpoTab === 'QUOTA') {
        return `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.15rem; color: var(--primary-900);">${isHi ? 'थोक अनुबंध हेतु सदस्य कोटा आवंटन' : 'Commercial Contract Quota Allocation Desk'}</h3>
                <div style="font-size: 0.82rem; color: var(--text-muted);">${isHi ? 'फ्रेशमार्ट 2,200 किग्रा टमाटर की मांग को सदस्य क्षमता के अनुसार विभाजित करें' : 'Allocating 2,200 kg Tomato demand from FreshMart across smallholder members based on acreage and harvest schedule.'}</div>
              </div>
              <span class="badge badge-success">Target: 2,200 kg (100% Allocated)</span>
            </div>

            <div class="quota-cards-grid">
              ${window.FF_DATA.farmers.map(f => `
                <div class="quota-member-card">
                  <div class="quota-member-head">
                    <span class="quota-member-name">${f.name}</span>
                    <span class="quota-status-pill badge-success">${f.intakeStatus}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${f.village} • ${f.crop}</div>
                  
                  <div class="quota-val-row">
                    <span>Allocated Quota:</span>
                    <strong>${f.allocatedQuotaKg} kg</strong>
                  </div>
                  <div class="quota-val-row">
                    <span>Quality Grade:</span>
                    <span style="color: #16a34a; font-weight: 700;">${f.brixAssay}</span>
                  </div>
                  <div class="quota-val-row">
                    <span>Direct Payout:</span>
                    <strong style="color: #16a34a;">₹ ${f.totalDisbursedRs.toLocaleString()}</strong>
                  </div>

                  <button class="btn btn-sm btn-secondary" style="margin-top: 6px;" onclick="window.FF_APP.openReceiptModal('${f.name}', ${f.allocatedQuotaKg})">
                    📄 View Ticket (${f.scaleTicketNo})
                  </button>
                </div>
              `).join('')}
            </div>

            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <strong>${isHi ? 'सहकारी मार्जिन पारदर्शिता:' : 'Cooperative Economic Margin:'}</strong>
                <span style="font-size: 0.85rem; color: #166534; margin-left: 6px;">
                  Gross Buyer Price: ₹26.00/kg ➔ Member Take-Home: ₹23.50/kg | FPO 3% Service Reserve: ₹0.78/kg | Spoke Assay: ₹0.60/kg | Zero Middleman Cuts!
                </span>
              </div>
              <button class="btn btn-sm btn-primary" onclick="window.FF_APP.showToast('✅ Quota allocations confirmed and locked with FreshMart.', 'success')">
                Lock Quotas & Notify Members
              </button>
            </div>
          </div>
        `;
      } else if (this.activeFpoTab === 'INTAKE') {
        return `
          <!-- Digital Scale Desk -->
          <div class="scale-simulator-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h3 style="color: #ffffff; font-size: 1.25rem;">⚖️ Digital Spoke Weighbridge & Intake Desk (Load-Cell Certified)</h3>
                <div style="font-size: 0.82rem; color: #94a3b8;">Govt. certified digital load cells with tamper-proof QR certificate generation.</div>
              </div>
              <span class="badge badge-success">CALIBRATION CERTIFIED</span>
            </div>

            <div class="scale-display-panel">
              <div>
                <div class="scale-meta-lbl">Live Intake Reading:</div>
                <div class="scale-digital-readout" id="digital-scale-num">650.0 kg</div>
              </div>

              <div class="scale-meta-grid">
                <div class="scale-meta-col">
                  <span class="scale-meta-lbl">Farmer Member:</span>
                  <span class="scale-meta-val">Ramesh Patel</span>
                </div>
                <div class="scale-meta-col">
                  <span class="scale-meta-lbl">Brix Sugar Assay:</span>
                  <span class="scale-meta-val" style="color: #4ade80;">4.8° Brix (Grade A+)</span>
                </div>
                <div class="scale-meta-col">
                  <span class="scale-meta-lbl">Tare Deduction:</span>
                  <span class="scale-meta-val">18.0 kg Crates</span>
                </div>
              </div>
            </div>

            <div class="scale-controls-tray">
              <button class="btn btn-primary" onclick="window.FF_LOGISTICS.simulateScaleIntake()">
                ⚖️ Re-Weigh Member Intake Crate
              </button>
              <button class="btn btn-secondary" onclick="window.FF_APP.openReceiptModal('Ramesh Patel', 650)">
                📄 Generate Digital Certificate & QR Slip
              </button>
            </div>
          </div>
        `;
      } else if (this.activeFpoTab === 'MACHINERY') {
        return `
          <div>
            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 1.15rem; color: var(--primary-900);">${isHi ? '🚜 कस्टम हायरिंग सेंटर (CHC) कृषि मशीनरी एवं आदान' : '🚜 Custom Hiring Center (CHC) Machinery & Bulk Farm Inputs'}</h3>
              <div style="font-size: 0.82rem; color: var(--text-muted);">${isHi ? 'एफपीओ द्वारा रियायती किराए पर ट्रैक्टर, रोटावेटर, स्प्रेयर एवं खाद-बीज उपलब्ध' : 'Subsidized farm implements and bulk certified inputs for member smallholders saving 40-70% on equipment.'}</div>
            </div>

            <div class="input-supply-grid" style="margin-bottom: 24px;">
              ${(window.FF_DATA.chcMachinery || []).map(item => `
                <div class="input-item-card">
                  <span class="input-stock-tag" style="background: #e0f2fe; color: #0284c7;">${item.discount}</span>
                  <div class="input-item-title">${item.icon} ${item.name}</div>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
                    <span style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">${item.memberRate}</span>
                    <span style="font-size: 0.78rem; text-decoration: line-through; color: var(--text-muted);">Market: ${item.marketRate}</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${item.operator}</div>
                  <button class="btn btn-sm btn-primary" style="margin-top: 8px;" onclick="window.FF_APP.showToast('✅ Slot booked for ${item.name}! FPO coordinator will contact you.', 'success')">
                    Book Machine Slot
                  </button>
                </div>
              `).join('')}
            </div>

            <div style="margin-bottom: 12px; font-weight: 800; font-size: 0.95rem; color: var(--primary-900);">
              🌱 Certified Bulk Inputs Inventory:
            </div>
            <div class="input-supply-grid">
              ${window.FF_DATA.fpoInfo.inputInventory.map(item => `
                <div class="input-item-card">
                  <span class="input-stock-tag">${item.stock}</span>
                  <div class="input-item-title">${item.item}</div>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
                    <span style="font-size: 1.2rem; font-weight: 800; color: var(--primary-900);">${item.price}</span>
                    <span style="font-size: 0.8rem; font-weight: 700; color: #16a34a;">${item.memberDiscount}</span>
                  </div>
                  <button class="btn btn-sm btn-secondary" style="margin-top: 8px;" onclick="window.FF_APP.showToast('✅ Issued ${item.item} to member account.', 'success')">
                    Issue to Member Account
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        // LEDGER & DIVIDENDS
        return `
          <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-light); padding-bottom: 14px;">
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--primary-900);">
                  📊 ${isHi ? 'सहकारी वित्तीय बहीखाता एवं सदस्य लाभांश' : 'Cooperative Financial Ledger & Member Patronage Dividends'}
                </h3>
                <div style="font-size: 0.82rem; color: var(--text-muted);">
                  SFAC & NABARD audited balance sheet with transparent patronage bonus distribution based on produce volume supplied.
                </div>
              </div>
              <span class="badge badge-success">SFAC AUDIT COMPLIANT</span>
            </div>

            <div class="grid-3" style="margin-bottom: 20px;">
              <div style="background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Total Monthly Revenue:</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-900);">₹ 5,72,000</div>
                <div style="font-size: 0.72rem; color: #16a34a;">22,000 kg aggregated produce</div>
              </div>
              <div style="background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Direct Member Payouts:</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: #16a34a;">₹ 5,17,000</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">90.4% disbursed via direct DBT</div>
              </div>
              <div style="background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">FPO Retained Surplus & Reserve:</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: #0284c7;">₹ 55,000</div>
                <div style="font-size: 0.72rem; color: #0284c7;">Patronage Bonus: ₹0.65/kg to members</div>
              </div>
            </div>

            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Member Ramesh Patel's Patronage Dividend:</strong>
                <span style="font-size: 0.88rem; color: #166534; margin-left: 8px;">
                  Supplied 14,200 kg this season ➔ Bonus Dividend Earned: <strong>₹ 9,230.00</strong>
                </span>
              </div>
              <button class="btn btn-sm btn-primary" onclick="window.FF_APP.showToast('✅ ₹ 9,230 Patronage Dividend credited to SBI A/c ••••8842!', 'success')">
                Claim Member Dividend
              </button>
            </div>
          </div>
        `;
      }
    },

    // ========================================================================
    // 5. B2B BUYER PORTAL
    // ========================================================================
    renderBuyerView(container) {
      const demands = window.FF_DATA.buyerDemands || [];
      const totalEscrow = demands.reduce((sum, d) => sum + d.escrowDepositRs, 0);

      container.innerHTML = `
        <div class="ff-card" style="margin-bottom: 28px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>🏬</span>
                <span>B2B Commercial Buyer Portal & Direct Procurement Desk</span>
              </div>
              <div class="ff-card-subtitle">
                Guaranteed quality farmgate sourcing, zero middleman markups, and 100% escrow-backed forward contracts.
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.FF_APP.openPostDemandModal()">
              + Post New Procurement Demand
            </button>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">🛒</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">${demands.length} Orders</div>
                <div class="farmer-stat-label">Active Procurement Demands</div>
                <div class="farmer-stat-tag">Aggregating 8,500 kg</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">🔒</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">₹ ${totalEscrow.toLocaleString()}</div>
                <div class="farmer-stat-label">Total Escrow Locked</div>
                <div class="farmer-stat-tag">100% Protected in SBI Escrow</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">⭐</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">99.1%</div>
                <div class="farmer-stat-label">FPO Supply Reliability</div>
                <div class="farmer-stat-tag">Zero Spoilage & Direct Line-Haul</div>
              </div>
            </div>
          </div>

          <!-- Active Demands Cards Grid -->
          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--primary-900); margin-bottom: 12px;">Active Commercial Demands Fulfilling by Smallholders & FPO:</h4>
            <div class="quota-cards-grid">
              ${demands.map(d => `
                <div class="quota-member-card">
                  <div class="quota-member-head">
                    <span class="quota-member-name">${d.icon} ${d.buyerName}</span>
                    <span class="badge badge-success">${d.status}</span>
                  </div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
                    ${d.crop} • ${d.deliveryWindow}
                  </div>
                  <div class="quota-val-row" style="margin-top: 10px;">
                    <span>Target Volume:</span>
                    <strong>${d.volumeNeededKg.toLocaleString()} kg</strong>
                  </div>
                  <div class="quota-val-row">
                    <span>Fulfillment Progress:</span>
                    <strong style="color: #16a34a;">${d.fulfilledKg.toLocaleString()} kg (${Math.round((d.fulfilledKg / d.volumeNeededKg) * 100)}%)</strong>
                  </div>
                  <div class="quota-val-row">
                    <span>Direct Price:</span>
                    <strong>₹ ${d.offeredRateGross.toFixed(2)} / kg</strong>
                  </div>
                  <div class="quota-val-row">
                    <span>Bank Escrow:</span>
                    <strong style="color: #0284c7;">₹ ${d.escrowDepositRs.toLocaleString()} Locked</strong>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Receiving Dock & Quality Acceptance Station -->
          <div style="background: #f8fafc; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
              <div>
                <h4 style="color: var(--primary-900); font-size: 1.15rem; margin: 0;">🚚 City Receiving Dock & Quality Acceptance Station:</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                  Shipment #ORD-2026-8812 arriving at Bay 2 via Reefer Truck KA-04-E-4421 from Kolar Agro Spoke.
                </p>
              </div>
              <span class="badge badge-success">● Truck Arrived at Dock Bay 2</span>
            </div>

            <div class="grid-3" style="margin-bottom: 18px;">
              <div style="background: #ffffff; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.75rem; color: var(--text-muted);">Verified Net Weight:</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #166534;">1,490.0 kg</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">10 kg transit moisture allowance</div>
              </div>
              <div style="background: #ffffff; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.75rem; color: var(--text-muted);">Dock Brix Assay:</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #166534;">4.8° Brix (Grade A+)</div>
                <div style="font-size: 0.7rem; color: #166534;">Export Grade Confirmed</div>
              </div>
              <div style="background: #ffffff; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.75rem; color: var(--text-muted);">Smart Escrow Settlement:</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #0284c7;">₹ 38,740.00</div>
                <div style="font-size: 0.7rem; color: #0284c7;">Ready for Instant Direct DBT Release</div>
              </div>
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="window.FF_APP.acceptDockShipment()">
                ✅ Accept Shipment & Release Escrow to Farmers
              </button>
              <button class="btn btn-secondary" onclick="window.FF_CHAIN.triggerOverdue()">
                📅 Request 7-Day Credit Grace
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // ========================================================================
    // 6. OPERATIONS CONTROL TOWER & SYSTEM ARCHITECTURE (ADMIN)
    // ========================================================================
    renderAdminView(container) {
      const i18n = window.FF_I18N;

      container.innerHTML = `
        <!-- Executive Architecture Panel -->
        <div class="judge-pitch-panel">
          <div class="judge-top-meta">
            <span class="sih-badge-pill">📊 Operations Control Tower • System Architecture</span>
            <span style="font-size: 0.85rem; color: #86efac; font-weight: 700;">Live Network Balance: Active Coordination</span>
          </div>

          <h1 class="judge-title">${i18n.get('adminTitle')}</h1>
          <p class="judge-desc">${i18n.get('adminSub')}</p>

          <div class="judge-metrics-grid">
            <div class="judge-metric-card">
              <div class="judge-metric-num">+113.6%</div>
              <div class="judge-metric-title">Farmer Net Realization</div>
              <div class="judge-metric-sub">₹23.50/kg vs Mandi's ₹11.00/kg</div>
            </div>
            <div class="judge-metric-card">
              <div class="judge-metric-num">5 Intermediaries</div>
              <div class="judge-metric-title">Completely Eliminated</div>
              <div class="judge-metric-sub">Zero commission agents & cuts</div>
            </div>
            <div class="judge-metric-card">
              <div class="judge-metric-num">-22.5%</div>
              <div class="judge-metric-title">Consumer Price Reduction</div>
              <div class="judge-metric-sub">Direct cluster pooling</div>
            </div>
            <div class="judge-metric-card">
              <div class="judge-metric-num">&lt; 3%</div>
              <div class="judge-metric-title">Cold Chain Spoilage</div>
              <div class="judge-metric-sub">Down from 25-30% open transit loss</div>
            </div>
          </div>
        </div>

        <!-- SECTION: Where Does Your Rupee Go? Interactive Comparison -->
        <div class="rupee-breakdown-box">
          <div class="rupee-header">
            <div class="rupee-title">
              <span>💰</span>
              <span>Where Does Every ₹100 Go? (Price Transparency Breakdown)</span>
            </div>
            <div class="rupee-sub">
              Comparative analysis of traditional Mandi supply chain vs FarmFlow demand-driven coordination.
            </div>
          </div>

          <div class="rupee-bars-grid">
            <!-- Traditional Breakdown -->
            <div class="rupee-scenario-col">
              <div class="scenario-title">
                <span style="color: #dc2626;">Traditional Middleman System</span>
                <span style="font-size: 0.85rem; color: var(--text-muted);">Consumer pays ₹ 40 / kg</span>
              </div>
              <div class="scenario-stacked-bar">
                <div class="bar-segment seg-farmer" style="width: 27.5%;" title="Farmer: 27.5%">27.5%</div>
                <div class="bar-segment seg-middlemen" style="width: 25.0%;" title="Middlemen: 25%">25%</div>
                <div class="bar-segment seg-retail" style="width: 22.5%;" title="Retail Markup: 22.5%">22.5%</div>
                <div class="bar-segment seg-spoilage" style="width: 25.0%;" title="Spoilage Waste: 25%">25%</div>
              </div>

              <div class="legend-list">
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-farmer"></span><span>Farmer Share (Take-Home)</span></div>
                  <span class="legend-val" style="color: #dc2626;">₹ 11.00 (27.5%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-middlemen"></span><span>5 Intermediaries (Broker, Arhtiya, Wholesaler)</span></div>
                  <span class="legend-val">₹ 10.00 (25.0%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-retail"></span><span>Retail / Vendor Markups</span></div>
                  <span class="legend-val">₹ 9.00 (22.5%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-spoilage"></span><span>Unrefrigerated Transit Rot & Waste</span></div>
                  <span class="legend-val">₹ 10.00 (25.0%)</span>
                </div>
              </div>
            </div>

            <!-- FarmFlow Breakdown -->
            <div class="rupee-scenario-col">
              <div class="scenario-title">
                <span style="color: var(--primary-800);">FarmFlow Direct Coordination</span>
                <span style="font-size: 0.85rem; color: #16a34a; font-weight: 700;">Consumer pays ₹ 32 / kg (20% Less!)</span>
              </div>
              <div class="scenario-stacked-bar">
                <div class="bar-segment seg-farmer" style="width: 73.4%;" title="Farmer: 73.4%">73.4%</div>
                <div class="bar-segment seg-logistics" style="width: 14.1%;" title="Cold Logistics: 14.1%">14.1%</div>
                <div class="bar-segment seg-platform" style="width: 9.4%;" title="Spoke & Platform: 9.4%">9.4%</div>
                <div class="bar-segment seg-spoilage" style="width: 3.1%;" title="Wastage: 3.1%">3.1%</div>
              </div>

              <div class="legend-list">
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-farmer"></span><span>Farmer Direct Bank Payout</span></div>
                  <span class="legend-val" style="color: #16a34a;">₹ 23.50 (73.4%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-logistics"></span><span>Direct Cold-Chain Line Haul</span></div>
                  <span class="legend-val">₹ 4.50 (14.1%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-platform"></span><span>Spoke Weighbridge & Platform Fee</span></div>
                  <span class="legend-val">₹ 3.00 (9.4%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-left"><span class="legend-dot seg-spoilage"></span><span>Cold-Chain Spoilage (Controlled)</span></div>
                  <span class="legend-val" style="color: #16a34a;">&lt; ₹ 1.00 (&lt; 3%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION: 15-Step End-to-End Live Orchestrator -->
        <div class="orchestrator-box">
          <div class="orchestrator-controls">
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">
                15-Step End-to-End Live System Pipeline
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                Demonstrates the complete transactional lifecycle from demand creation to instant bank DBT payout.
              </div>
            </div>

            <div class="sim-actions-tray">
              <span class="sim-step-badge" id="sim-current-step-badge">Stage 1 of 15</span>
              <button class="btn btn-secondary btn-sm" onclick="window.FF_CHAIN.prevStep()">◀ Prev</button>
              <button class="btn btn-secondary btn-sm" onclick="window.FF_CHAIN.nextStep()">Next ▶</button>
              <button class="btn btn-amber btn-sm" id="btn-play-sim" onclick="window.FF_CHAIN.playSim()">
                ▶️ Auto Run 15 Steps
              </button>
            </div>
          </div>

          <div id="pipeline-stage-view">
            <!-- Rendered by window.FF_CHAIN -->
          </div>

          <!-- Real-World Incident Mitigations -->
          <div style="margin-top: 32px; border-top: 1px solid var(--border-light); padding-top: 20px;">
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary-900); margin-bottom: 4px;">
              🚨 Live System Resilience & Real-World Incident Demonstrations
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
              Simulate real supply-chain anomalies and test self-healing recovery algorithms:
            </div>

            <div class="failure-scenarios-tray">
              <div class="failure-card" onclick="window.FF_CHAIN.triggerBreakdown()">
                <div class="failure-title">
                  <span>🚛</span>
                  <span>Vehicle Breakdown on NH-75</span>
                </div>
                <div class="failure-desc">
                  Simulate engine failure of primary reefer truck. System auto-assigns standby truck KA-51-B-3310 and notifies destination hub.
                </div>
                <button class="btn-trigger-fail">Simulate Breakdown</button>
              </div>

              <div class="failure-card" onclick="window.FF_CHAIN.triggerShortage()">
                <div class="failure-title">
                  <span>⚖️</span>
                  <span>150 kg Spoke Shortage</span>
                </div>
                <div class="failure-desc">
                  Simulate weight deficit at spoke intake scale. System dynamically allocates buffer from pre-cooled solar cold storage reserve.
                </div>
                <button class="btn-trigger-fail">Simulate Shortage</button>
              </div>

              <div class="failure-card" onclick="window.FF_CHAIN.triggerOverdue()">
                <div class="failure-title">
                  <span>📅</span>
                  <span>Buyer 7-Day Credit Extension</span>
                </div>
                <div class="failure-desc">
                  Simulate B2B buyer requesting 7-day payment grace period. Smart escrow bridge releases farmer payout on schedule without credit risk.
                </div>
                <button class="btn-trigger-fail">Simulate Credit Request</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Render Stage 1
      window.FF_CHAIN.renderSimStage();
    },

    // ========================================================================
    // Interactive Modals & Actions
    // ========================================================================
    runPracticalDemoModal(step = 1) {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const currentStep = Math.max(1, Math.min(5, step));
      const isHi = window.FF_I18N.currentLang === 'hi';

      const stages = [
        {
          num: 1,
          icon: '🏬',
          badge: isHi ? 'चरण १: खरीदार मांग व भाव' : 'Stage 1: Marketplace Demand Matching',
          title: isHi ? 'फ्रेशमार्ट सुपरमार्केट से सीधा सौदा पक्का' : 'Direct Forward Contract with FreshMart Hypermarket',
          desc: isHi ? 
            'फ्रेशमार्ट को 1,500 किलो टमाटर चाहिए। किसान रमेश पटेल ने 650 किलो का सौदा ₹26.00/kg (नेट ₹23.50/kg) में पक्का किया। मंडी के ₹11.00/kg के मुकाबले किसान को प्रति किलो ₹12.50 ज्यादा मिले (+₹8,125 शुद्ध अतिरिक्त मुनाफा)।' :
            'FreshMart requires 1,500 kg tomatoes. Farmer Ramesh Patel locks a forward lot of 650 kg at ₹26.00/kg gross (₹23.50/kg net). Compared to Mandi ₹11.00/kg, farmer gains +₹12.50/kg extra take-home (+₹8,125 extra profit).',
          metrics: [
            { lbl: isHi ? 'फार्मफ्लो सीधा भाव' : 'FarmFlow Direct Rate', val: '₹ 23.50 / kg', color: '#166534' },
            { lbl: isHi ? 'कोलार मंडी भाव' : 'APMC Mandi Rate', val: '₹ 11.00 / kg', color: '#dc2626' },
            { lbl: isHi ? 'किसान को अतिरिक्त लाभ' : 'Net Farmer Realization', val: '+ ₹ 8,125.00', color: '#0284c7' }
          ],
          audioText: isHi ? 
            'चरण एक: फ्रेशमार्ट सुपरमार्केट को 650 किलो टमाटर का सीधा सौदा पक्का हुआ। मंडी के 11 रुपये के मुकाबले किसान को 23 रुपये 50 पैसे प्रति किलो मिले।' :
            'Stage 1: Forward contract of 650 kg tomatoes locked directly with FreshMart. Farmer earns 23.50 rupees per kg versus only 11 rupees in Mandi.'
        },
        {
          num: 2,
          icon: '🔒',
          badge: isHi ? 'चरण २: 100% बैंक एस्क्रो सुरक्षा' : 'Stage 2: 100% Escrow Funding',
          title: isHi ? 'आईसीआईसीआई बैंक स्मार्ट एस्क्रो में ₹16,900 जमा' : 'Buyer Funds ₹16,900 into Smart Bank Escrow',
          desc: isHi ? 
            'पारंपरिक मंडी में आढ़तिया किसान का भुगतान 7 से 14 दिन अटकाता है। फार्मफ्लो पर खरीदार को पहले ही पूरी राशि बैंक एस्क्रो में जमा करनी होती है। शून्य डिफॉल्ट जोखिम, 100% भुगतान की सुरक्षित गारंटी।' :
            'In traditional mandis, commission agents hold payments for 7 to 14 days. On FarmFlow, buyer deposits 100% funds upfront into bank escrow. Zero default risk, 100% guaranteed settlement.',
          metrics: [
            { lbl: isHi ? 'एस्क्रो सुरक्षित राशि' : 'Escrow Secured Funds', val: '₹ 16,900.00', color: '#166534' },
            { lbl: isHi ? 'भुगतान डिफॉल्ट रिस्क' : 'Default Credit Risk', val: '0.00% ZERO', color: '#0284c7' },
            { lbl: isHi ? 'एस्क्रो पार्टनर बैंक' : 'Escrow Partner Bank', val: 'ICICI Smart Escrow', color: '#334155' }
          ],
          audioText: isHi ? 
            'चरण दो: खरीदार ने 16 हजार 900 रुपये बैंक एस्क्रो में जमा कर दिए हैं। आढ़तिया का चक्कर खत्म, पैसे डूबने का शून्य जोखिम।' :
            'Stage 2: FreshMart deposited 16,900 rupees into bank escrow. Commission agent delays eliminated, zero default risk.'
        },
        {
          num: 3,
          icon: '🚚',
          badge: isHi ? 'चरण ३: खेत पर 15 मिनट में ई-लोडर' : 'Stage 3: Farmgate EV Logistics Dispatch',
          title: isHi ? 'महिंद्रा ई-लोडर KA-03-D-9912 खेत के दरवाजे पर पहुंचा' : 'Mahindra Treo EV Pickup KA-03-D-9912 at Farmgate',
          desc: isHi ? 
            'ड्राइवर किरण कुमार (+91 88612 99014) 14 मिनट में रमेश पटेल के खेत पहुंचा। 26 क्रेट सीधे खेत से लादी गईं। किसान को मंडी जाने का कोई भारी भाड़ा नहीं देना पड़ा (साझा ग्रामीण भाड़ा मात्र ₹150, मंडी भाड़े से ₹350 प्रति क्विंटल की बचत)।' :
            'Driver Kiran Kumar (+91 88612 99014) arrived at Ramesh Patel\'s field in 14 minutes. 26 crates loaded directly from farmgate. Shared freight is just ₹150 (saving ₹350/quintal in line-haul freight).',
          metrics: [
            { lbl: isHi ? 'खेत पर पहुंचने का समय' : 'Farmgate Arrival ETA', val: '14 mins', color: '#166534' },
            { lbl: isHi ? 'सवारी वाहन' : 'Assigned EV Vehicle', val: 'KA-03-D-9912', color: '#0284c7' },
            { lbl: isHi ? 'किसान की भाड़ा बचत' : 'Line-haul Freight Saved', val: '₹ 350 / Qtl', color: '#16a34a' }
          ],
          audioText: isHi ? 
            'चरण तीन: 14 मिनट में ड्राइवर किरण महिंद्रा ई-लोडर लेकर खेत पर पहुंच गए। 26 क्रेट लोड हुईं और 350 रुपये प्रति क्विंटल भाड़ा बचा।' :
            'Stage 3: Driver Kiran arrived in 14 minutes with electric loader. 26 crates loaded directly from farmgate, saving 350 rupees per quintal.'
        },
        {
          num: 4,
          icon: '⚖️',
          badge: isHi ? 'चरण ४: विलेज स्पोक डिजिटल कांटा व Brix' : 'Stage 4: Village Spoke IoT Weighing & Brix Assaying',
          title: isHi ? 'डिजिटल धर्मकांटा 650.0 kg • मिठास Brix 4.8° Grade A+' : 'IoT Load-Cell Reads 650.0 kg Net • Brix Refractometer 4.8°',
          desc: isHi ? 
            '2.8 किमी दूर वोक्कलेरी विलेज स्पोक पर डिजिटल लोड-सेल से तौल हुई। मंडी में आढ़तिया हर क्रेट पर 2.5 किलो काटता था, यहाँ 0 ग्राम वजन चोरी। डिजिटल रिफ्रैक्टोमीटर ने Brix 4.8° मापकर Grade A+ सर्टिफिकेट तुरंत जारी किया।' :
            'At Vokkaleri village spoke (2.8 km away), IoT load-cells certified 650.0 kg net weight. Zero Arhtiya weight theft (saving 2.5 kg/crate = ₹1,800 saved). Digital refractometer verified 4.8° Brix Grade A+ quality.',
          metrics: [
            { lbl: isHi ? 'प्रमाणित शुद्ध वजन' : 'Certified Net Weight', val: '650.0 kg', color: '#166534' },
            { lbl: isHi ? 'गुणवत्ता Brix स्कोर' : 'Refractometer Brix', val: '4.8° (Grade A+)', color: '#0284c7' },
            { lbl: isHi ? 'वजन चोरी बचत' : 'Weight Theft Saved', val: '0 gm CUT (₹1,800 saved)', color: '#16a34a' }
          ],
          audioText: isHi ? 
            'चरण चार: विलेज स्पोक पर डिजिटल धर्मकांटे से 650 किलो तौल हुई और ब्रिक्स मिठास 4.8 डिग्री निकली। मंडी की वजन चोरी से 1,800 रुपये बचे।' :
            'Stage 4: Village spoke digital weighbridge certified 650 kg and 4.8 Brix sugar score. Zero weight theft saved 1,800 rupees.'
        },
        {
          num: 5,
          icon: '⚡',
          badge: isHi ? 'चरण ५: 2 घंटे में सीधा बैंक DBT' : 'Stage 5: 2-Hour Direct Aadhaar DBT Payout',
          title: isHi ? '₹ 15,275.00 सीधे स्टेट बैंक खाते में जमा (UTR: SBIN90214892)' : '₹ 15,275.00 Credited Directly to SBI A/c ••••8842',
          desc: isHi ? 
            'डिजिटल तौल पर्ची कटते ही आईसीआईसीआई बैंक एस्क्रो ने ₹15,275 रमेश पटेल के एसबीआई खाते में सीधे ट्रांसफर कर दिए। कोई आढ़तिया नहीं, कोई दलाल नहीं। तुरंत एसएमएस और किसान वाणी से आवाज में सूचना।' :
            'Upon digital weighment, bank escrow immediately released ₹15,275 directly to Ramesh Patel\'s SBI account via Aadhaar DBT (UTR: SBIN90214892). Zero intermediaries, instant SMS and voice confirmation.',
          metrics: [
            { lbl: isHi ? 'बैंक खाते में जमा' : 'Direct Bank DBT', val: '₹ 15,275.00', color: '#166534' },
            { lbl: isHi ? 'लेनदेन संख्या' : 'Bank UTR Reference', val: 'SBIN90214892', color: '#0284c7' },
            { lbl: isHi ? 'कमीशन कटौती' : 'Intermediary Cut', val: '₹ 0.00 ZERO', color: '#16a34a' }
          ],
          audioText: isHi ? 
            'बधाई हो रमेश जी! 15 हजार 275 रुपये आपके स्टेट बैंक खाते में सीधे जमा हो गए हैं। कोई बिचौलिया नहीं, पूरा पैसा आपका।' :
            'Congratulations Ramesh Patel! 15,275 rupees credited directly to your State Bank of India account via DBT. Zero middleman cut.'
        }
      ];

      const currentStage = stages[currentStep - 1];

      modalBox.innerHTML = `
        <div class="modal-header" style="background: #1e1b4b; color: #fff;">
          <div class="modal-title" style="color: #fef08a;">
            🎬 ${isHi ? 'प्रैक्टिकल लाइव डेमो: खेत से खरीदार और बैंक खाता' : 'SIH 2026 Practical Demo: Farmgate to Direct Bank DBT'}
          </div>
          <button class="modal-close-btn" style="color: #fff;" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <!-- 5-Stage Stepper Navigation -->
          <div class="demo-stepper-wrap">
            ${stages.map((st, idx) => `
              <div class="demo-step-pill ${st.num === currentStep ? 'active' : (st.num < currentStep ? 'completed' : '')}" onclick="window.FF_APP.runPracticalDemoModal(${st.num})">
                <div class="demo-step-dot">
                  ${st.num < currentStep ? '✓' : st.num}
                </div>
                <div class="demo-step-label">${st.num}. ${st.badge.split(':')[0]}</div>
              </div>
            `).join('')}
          </div>

          <!-- Active Stage Card -->
          <div class="demo-stage-box">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="demo-stage-badge">${currentStage.badge}</span>
                <h3 class="demo-stage-title">${currentStage.icon} ${currentStage.title}</h3>
              </div>
              <button class="btn-listen-card" onclick="window.FF_VOICE.speak('${currentStage.audioText.replace(/'/g, "\\'")}')" title="आवाज सुनें">
                🔊 ${isHi ? 'आवाज में सुनें' : 'Listen'}
              </button>
            </div>

            <p class="demo-stage-desc">${currentStage.desc}</p>

            <!-- 3 Highlight Metric Cells -->
            <div class="demo-stage-grid">
              ${currentStage.metrics.map(m => `
                <div class="demo-metric-cell">
                  <div class="demo-metric-lbl">${m.lbl}</div>
                  <div class="demo-metric-val" style="color: ${m.color};">${m.val}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <div>
            <button class="btn btn-secondary" onclick="window.FF_APP.runPracticalDemoModal(${Math.max(1, currentStep - 1)})" ${currentStep === 1 ? 'disabled' : ''}>
              ⬅️ ${isHi ? 'पिछला चरण' : 'Previous'}
            </button>
            <button class="btn btn-primary" onclick="window.FF_APP.runPracticalDemoModal(${Math.min(5, currentStep + 1)})" ${currentStep === 5 ? 'disabled' : ''}>
              ${isHi ? 'अगला चरण ➡️' : 'Next Stage ➡️'}
            </button>
          </div>
          <div>
            <button class="btn btn-secondary" onclick="window.FF_VOICE.speak('${currentStage.audioText.replace(/'/g, "\\'")}')">
              🔊 ${isHi ? 'कथा सुनें' : 'Narrate Step'}
            </button>
            <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">
              ${isHi ? 'बंद करें' : 'Close Demo'}
            </button>
          </div>
        </div>
      `;

      this.openModal();
      window.FF_VOICE.speak(currentStage.audioText);
    },

    openSellModal(cropName = 'Tomato', netRate = 23.50) {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const isHi = window.FF_I18N.currentLang === 'hi';
      const demands = window.FF_DATA.buyerDemands || [];

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">🌾 ${isHi ? 'मार्केटप्लेस लिंकेज व वाहन डिस्पैच विजार्ड' : 'Marketplace Linkage & Farmgate Transport Wizard'}</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
            ${isHi ? 
              'अपनी फसल सीधे सत्यापित सुपरमार्केट और सोसायटियों को 100% बैंक एस्क्रो और खेत पर गाड़ी पिकअप के साथ बेचें।' : 
              'Link your harvest lot directly with verified institutional buyers, 100% bank escrow, and on-demand farmgate EV transport.'}
          </p>

          <!-- 1. Select Buyer Channel -->
          <div class="form-group">
            <label class="form-label">${isHi ? '१. खरीदार चैनल चुनें (Select Buyer Channel):' : '1. Select Buyer Channel:'}</label>
            <select class="form-control" id="input-sell-buyer" onchange="window.FF_APP.updateSellWizardCalc()">
              ${demands.map(d => `
                <option value="${d.id}" data-rate="${d.netFarmerTakeHome}" data-mandi="${d.mandiRateComparison}">
                  ${d.icon} ${d.buyerName} (${d.buyerType}) • भाव: ₹${d.netFarmerTakeHome.toFixed(2)}/kg
                </option>
              `).join('')}
            </select>
          </div>

          <!-- 2. Volume & Live Payout Calculation -->
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">${isHi ? '२. कुल वजन (kg):' : '2. Harvest Volume (kg):'}</label>
              <input type="number" id="input-sell-qty" class="form-control" value="650" min="50" max="10000" oninput="window.FF_APP.updateSellWizardCalc()">
            </div>
            <div class="form-group">
              <label class="form-label">${isHi ? 'कटाई की तारीख:' : 'Harvest Date:'}</label>
              <input type="date" class="form-control" value="2026-09-15">
            </div>
          </div>

          <!-- Live Calculator Display Box -->
          <div id="sell-calc-display-box" style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span>${isHi ? 'सीधा बैंक भाव:' : 'Direct Net Rate:'}</span>
              <strong style="color: #166534;">₹ 23.50 / kg</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span>${isHi ? 'पारंपरिक मंडी में मिलता:' : 'APMC Mandi Net would be:'}</span>
              <span style="color: #dc2626; text-decoration: line-through;">₹ 7,150.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px dashed #86efac; padding-top: 8px; margin-top: 6px;">
              <span style="color: #14532d;">${isHi ? 'गारंटीड बैंक जमा (DBT):' : 'Guaranteed Bank Deposit:'}</span>
              <span id="sell-modal-total-payout" style="color: #166534; font-size: 1.3rem;">₹ 15,275.00</span>
            </div>
            <div style="font-size: 0.82rem; color: #15803d; font-weight: 700; margin-top: 4px;">
              🎉 ${isHi ? 'मंडी से ₹ 8,125.00 अतिरिक्त नकद मुनाफा!' : 'You earn +₹ 8,125.00 extra cash profit over Mandi!'}
            </div>
          </div>

          <!-- 3. Farmgate Transport Dispatch Selection -->
          <div class="form-group">
            <label class="form-label">${isHi ? '३. खेत पर पिकअप गाड़ी चुनें (Farmgate Transport Dispatch):' : '3. Select Farmgate Pickup Vehicle:'}</label>
            <select class="form-control" id="input-sell-vehicle">
              <option value="E_LOADER">⚡ महिंद्रा ई-लोडर KA-03-D-9912 (ड्राइवर किरण • 15 मिनट पिकअप • ₹150 साझा भाड़ा)</option>
              <option value="REEFER">🚚 टाटा ऐस कोल्ड रीफर KA-04-E-1029 (20 मिनट पिकअप • ₹350 भाड़ा)</option>
              <option value="TRACTOR">🚜 विलेज स्पोक ट्रैक्टर ट्रॉली (30 मिनट पिकअप • ₹450 साझा भाड़ा)</option>
            </select>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <button class="btn btn-secondary" onclick="window.FF_VOICE.narrateCard('sell')">
            🔊 ${isHi ? 'आवाज में सुनें' : 'Listen'}
          </button>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">${isHi ? 'रद्द करें' : 'Cancel'}</button>
            <button class="btn btn-primary" onclick="window.FF_APP.confirmSellWithTransport()">
              🔒 ${isHi ? 'सौदा पक्का करें व गाड़ी भेजें' : 'Lock Deal & Dispatch Vehicle'}
            </button>
          </div>
        </div>
      `;

      this.openModal();
    },

    updateSellWizardCalc() {
      const selectBuyer = document.getElementById('input-sell-buyer');
      const qtyInput = document.getElementById('input-sell-qty');
      const payoutEl = document.getElementById('sell-modal-total-payout');
      if (!selectBuyer || !qtyInput || !payoutEl) return;

      const selectedOpt = selectBuyer.options[selectBuyer.selectedIndex];
      const rate = Number(selectedOpt.getAttribute('data-rate')) || 23.50;
      const qty = Math.max(10, Number(qtyInput.value) || 500);
      const total = Math.round(qty * rate);

      payoutEl.textContent = `₹ ${total.toLocaleString()}.00`;
    },

    confirmSellWithTransport() {
      const qty = Number(document.getElementById('input-sell-qty')?.value) || 650;
      const buyerSelect = document.getElementById('input-sell-buyer');
      const buyerName = buyerSelect ? buyerSelect.options[buyerSelect.selectedIndex].text.split('(')[0].trim() : 'FreshMart';
      const vehSelect = document.getElementById('input-sell-vehicle');
      const vehText = vehSelect ? vehSelect.options[vehSelect.selectedIndex].text.split('(')[0].trim() : 'Mahindra E-Loader';

      const netTotal = Math.round(qty * 23.50);

      const farmer = window.FF_DATA.currentFarmer;
      farmer.activeListings.unshift({
        id: `LST-${Date.now().toString().slice(-4)}`,
        crop: 'Tomato (Grade A+)',
        qtyKg: qty,
        targetRate: 26.00,
        netExpected: 23.50,
        harvestDate: 'Tomorrow Morning',
        spoke: 'Vokkaleri Village Spoke',
        status: 'MATCHED_ORDER'
      });

      this.closeModal();
      this.renderCurrentView();

      const isHi = window.FF_I18N.currentLang === 'hi';
      const toastMsg = isHi ? 
        `🎉 बधाई हो! ${buyerName} के साथ ${qty} किलो का सौदा पक्का हुआ। गाड़ी 15 मिनट में खेत पर पहुंच रही है!` :
        `🎉 Contract locked with ${buyerName} for ${qty} kg! ${vehText} dispatched to farmgate (ETA 15 mins).`;
      
      this.showToast(toastMsg, 'success');

      const voiceMsg = isHi ?
        `बधाई हो रमेश जी! आपका ${qty} किलो टमाटर का सीधा सौदा ${buyerName} के साथ पक्का हो गया है। महिंद्रा ई-लोडर 15 मिनट में आपके खेत पर पहुंच रहा है। कुल गारंटीड कमाई: ${netTotal} रुपये।` :
        `Congratulations Ramesh Patel. Your direct deal of ${qty} kilograms has been locked with ${buyerName}. Vehicle dispatched to farmgate. Total earnings: ${netTotal} rupees.`;

      window.FF_VOICE.speak(voiceMsg);
    },

    openReceiptModal(farmerName, qtyKg) {
      const name = farmerName || 'Ramesh Patel';
      const qty = qtyKg || 650;
      const rate = 23.50;
      const total = qty * rate;

      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">📄 Digital Weighbridge & Bank Payout Voucher</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="receipt-voucher">
            <div class="receipt-header">
              <div class="receipt-title">FARMFLOW AGRI NETWORK</div>
              <div class="receipt-id">TICKET #WB-2026-991 • KOLAR AGRO SPOKE</div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Govt. Weighbridge Certified Load Cell</div>
            </div>

            <table class="receipt-table">
              <tr>
                <td>Farmer Name:</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td>Aadhaar Status:</td>
                <td><span style="color: #16a34a;">VERIFIED (DBT LINKED)</span></td>
              </tr>
              <tr>
                <td>Crop & Variety:</td>
                <td>Tomato (Grade-A Export Quality)</td>
              </tr>
              <tr>
                <td>Gross Intake:</td>
                <td>${qty} kg</td>
              </tr>
              <tr>
                <td>Deductions:</td>
                <td>₹ 0.00 (Zero Middleman Arhtiya Cut)</td>
              </tr>
              <tr>
                <td>Net Take-Home Rate:</td>
                <td>₹ ${rate.toFixed(2)} / kg</td>
              </tr>
              <tr style="font-size: 1.05rem; border-top: 1px solid #0f172a;">
                <td><strong>Total Bank Deposit:</strong></td>
                <td><strong style="color: #16a34a;">₹ ${Math.round(total).toLocaleString()}.00</strong></td>
              </tr>
            </table>

            <div class="receipt-qr-wrap">
              <div class="qr-box">📱</div>
              <div style="text-align: right;">
                <div class="receipt-stamp">PAID VIA DBT</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">UTR: SBI98231049281</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.print()">🖨️ Print Slip</button>
          <button class="btn btn-primary" onclick="window.FF_APP.closeModal()">Close</button>
        </div>
      `;

      this.openModal();
    },

    bookColdStorage(name) {
      this.showToast(`❄️ Slot reserved at ${name}! 40 Crates allocated for 5 days.`, 'success');
    },

    changeCrop(cropKey, btnEl) {
      document.querySelectorAll('#mandi-comparator-section .crop-pill').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      window.FF_MANDI.selectCrop(cropKey);
    },

    selectLeaf(caseId, btnEl) {
      document.querySelectorAll('.leaf-sample-btn').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      window.FF_DOCTOR.selectCase(caseId);
    },

    simulateUpload() {
      this.showToast('📸 Scanning camera photo with AI Vision model...', 'info');
      setTimeout(() => {
        window.FF_DOCTOR.selectCase('late_blight');
        this.showToast('⚠️ AI Detected: Late Blight (85% severity). Remedies updated!', 'warning');
      }, 1000);
    },

    activeDemandCropFilter: 'all',

    filterBuyerDemands(cropKey, btnEl) {
      this.activeDemandCropFilter = cropKey;
      document.querySelectorAll('#buyer-demands-section .crop-pill').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      const grid = document.getElementById('demands-grid-content');
      if (grid) {
        grid.innerHTML = this.renderBuyerDemandCards(cropKey);
      }
    },

    renderBuyerDemandCards(cropKey = 'all') {
      const demands = (window.FF_DATA.buyerDemands || []).filter(d => {
        return (cropKey === 'all') || (d.cropKey === cropKey);
      });

      if (demands.length === 0) {
        return `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">No buyer demands posted for this crop currently.</div>`;
      }

      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';

      return demands.map(d => `
        <div class="demand-card ${d.id === 'DEM-01' ? 'highlight' : ''}">
          <div>
            <div class="demand-top-head">
              <div class="demand-buyer-badge">
                <div class="demand-buyer-icon">${d.icon}</div>
                <div>
                  <div class="demand-buyer-name">${d.buyerName}</div>
                  <div class="demand-buyer-type">${d.buyerType}</div>
                </div>
              </div>
              <span class="badge badge-success">✓ Escrow Locked</span>
            </div>

            <div class="demand-crop-title">${d.crop}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Quality: <strong>${d.qualityGrade}</strong></div>

            <div class="demand-rates-row">
              <div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Farmer Take-Home:</div>
                <div class="demand-net-rate">₹ ${d.netFarmerTakeHome.toFixed(2)} <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-muted);">/ kg</span></div>
                <div class="demand-mandi-comp">APMC Mandi: ₹ ${d.mandiRateComparison.toFixed(2)}/kg</div>
              </div>
              <div style="text-align: right;">
                <span class="demand-gain-badge">+₹ ${d.gainPerKg.toFixed(2)}/kg Gain</span>
                <div style="font-size: 0.72rem; color: #166534; font-weight: 700; margin-top: 4px;">Gross: ₹${d.offeredRateGross.toFixed(2)}</div>
              </div>
            </div>

            <div class="demand-meta-list">
              <div class="demand-meta-item">
                <span>Required Quantity:</span>
                <strong>${d.volumeNeededKg.toLocaleString()} kg</strong>
              </div>
              <div class="demand-meta-item">
                <span>Pickup Spoke:</span>
                <span>${d.pickupSpoke}</span>
              </div>
              <div class="demand-meta-item">
                <span>Delivery Window:</span>
                <span>${d.deliveryWindow}</span>
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-block" style="margin-top: 8px;" onclick="window.FF_APP.openAcceptDemandModal('${d.id}')">
            ${i18n.get('acceptDemandBtn')}
          </button>
        </div>
      `).join('');
    },

    openAcceptDemandModal(demandId) {
      const demand = (window.FF_DATA.buyerDemands || []).find(d => d.id === demandId);
      if (!demand) return;

      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const defaultQty = 500;
      const grossVal = defaultQty * demand.offeredRateGross;
      const netVal = defaultQty * demand.netFarmerTakeHome;
      const mandiVal = defaultQty * demand.mandiRateComparison;
      const extraEarnings = netVal - mandiVal;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">🤝 Confirm Direct Contract with ${demand.buyerName}</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 12px 16px;">
            <div style="font-size: 2.2rem;">${demand.icon}</div>
            <div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #166534;">${demand.crop}</div>
              <div style="font-size: 0.8rem; color: #15803d;">Buyer: <strong>${demand.buyerName}</strong> • Escrow Deposit: ₹ ${demand.escrowDepositRs.toLocaleString()} Secured</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">How Many Kilograms (kg) Do You Want to Sell?</label>
            <input type="number" id="input-demand-qty" class="form-control" value="${defaultQty}" min="50" max="${demand.volumeNeededKg}" oninput="window.FF_APP.updateDemandCalculation('${demand.id}', this.value)">
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Buyer requires up to ${demand.volumeNeededKg.toLocaleString()} kg (${demand.fulfilledKg} kg already committed by FPO).</div>
          </div>

          <!-- Dynamic Live Earnings Comparison -->
          <div id="demand-calc-box" style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; margin: 16px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
              <span>Agreed Direct Rate:</span>
              <strong>₹ ${demand.offeredRateGross.toFixed(2)} / kg (Net ₹ ${demand.netFarmerTakeHome.toFixed(2)}/kg)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
              <span>Traditional Mandi Payout would be:</span>
              <span style="color: #dc2626; text-decoration: line-through;">₹ ${mandiVal.toLocaleString()}.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding-top: 8px; font-size: 1.1rem;">
              <strong style="color: #166534;">Guaranteed Bank Deposit:</strong>
              <strong id="demand-net-payout" style="color: #166534; font-size: 1.25rem;">₹ ${netVal.toLocaleString()}.00</strong>
            </div>
            <div style="text-align: right; font-size: 0.8rem; color: #15803d; font-weight: 700; margin-top: 4px;">
              🎉 You make <span id="demand-extra-gain">+₹ ${extraEarnings.toLocaleString()}.00</span> extra compared to Mandi!
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Preferred Farmgate Pickup Slot:</label>
            <select class="form-control" id="input-demand-pickup">
              <option>⚡ Tomorrow 06:30 AM (Mahindra E-Loader KA-03-D-9912)</option>
              <option>🚚 Tomorrow 09:00 AM (Tata Ace Cold Reefer)</option>
              <option>🚜 I will drop off at ${demand.pickupSpoke} directly</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.FF_APP.confirmAcceptDemand('${demand.id}')">
            🔒 Lock Direct Forward Deal
          </button>
        </div>
      `;

      this.openModal();
    },

    updateDemandCalculation(demandId, qtyVal) {
      const demand = (window.FF_DATA.buyerDemands || []).find(d => d.id === demandId);
      if (!demand) return;
      const qty = Math.max(10, Number(qtyVal) || 100);
      const netVal = qty * demand.netFarmerTakeHome;
      const mandiVal = qty * demand.mandiRateComparison;
      const extra = netVal - mandiVal;

      const payoutEl = document.getElementById('demand-net-payout');
      const extraEl = document.getElementById('demand-extra-gain');
      if (payoutEl) payoutEl.textContent = `₹ ${netVal.toLocaleString()}.00`;
      if (extraEl) extraEl.textContent = `+₹ ${extra.toLocaleString()}.00`;
    },

    confirmAcceptDemand(demandId) {
      const demand = (window.FF_DATA.buyerDemands || []).find(d => d.id === demandId);
      if (!demand) return;

      const qty = Number(document.getElementById('input-demand-qty')?.value) || 500;
      const netTotal = Math.round(qty * demand.netFarmerTakeHome);

      // Mutate state
      demand.fulfilledKg += qty;
      const farmer = window.FF_DATA.currentFarmer;
      farmer.activeListings.unshift({
        id: `LST-${Date.now().toString().slice(-4)}`,
        crop: demand.crop,
        qtyKg: qty,
        targetRate: demand.offeredRateGross,
        netExpected: demand.netFarmerTakeHome,
        harvestDate: 'Tomorrow Morning',
        spoke: demand.pickupSpoke,
        status: 'MATCHED_ORDER'
      });

      this.closeModal();
      this.renderCurrentView();

      const isHi = window.FF_I18N.currentLang === 'hi';
      const toastMsg = isHi ?
        `🎉 ${demand.buyerName} के साथ ${qty} किलो का सौदा पक्का! शुद्ध आमदनी: ₹${netTotal.toLocaleString()}` :
        `🎉 Forward deal of ${qty} kg locked with ${demand.buyerName}! Net take-home: ₹${netTotal.toLocaleString()}`;
      this.showToast(toastMsg, 'success');

      const voiceMsg = isHi ?
        `बधाई हो रमेश जी! ${demand.buyerName} के साथ ${qty} किलो का सीधा सौदा पक्का हो गया है। महिंद्रा ई-लोडर आपके खेत पर 15 मिनट में आ रहा है। कुल गारंटीड कमाई: ${netTotal} रुपये।` :
        `Congratulations Ramesh Patel. Your direct harvest deal of ${qty} kilograms has been locked with ${demand.buyerName}. Total guaranteed earnings: ${netTotal} rupees. EV loader dispatched to farmgate.`;

      window.FF_VOICE.speak(voiceMsg);
    },

    claimDistressShield() {
      const shield = window.FF_DATA.distressSaleShield;
      const farmer = window.FF_DATA.currentFarmer;
      const advanceAmount = 10725; // 650kg * ₹16.50/kg

      // Credit wallet
      farmer.walletBalanceRs += advanceAmount;
      shield.isCrashAlertActive = false; // Resolved!

      this.renderCurrentView();

      // Show e-NWR Certificate modal
      const modalBox = document.getElementById('modal-box');
      if (modalBox) {
        modalBox.innerHTML = `
          <div class="modal-header">
            <div class="modal-title">🛡️ e-NWR Warehouse Receipt & Advance Credit Voucher</div>
            <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div style="background: #f0fdf4; border: 2px 2px dashed #16a34a; border-radius: var(--radius-lg); padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #86efac; padding-bottom: 12px; margin-bottom: 14px;">
                <div>
                  <div style="font-weight: 800; color: #166534; font-size: 1.15rem;">WDRA / NABARD ACCREDITED e-NWR RECEIPT</div>
                  <div style="font-size: 0.75rem; color: #15803d;">Govt. Warehousing Development & Regulatory Authority</div>
                </div>
                <span class="badge badge-success">✓ 100% SUBSIDY ACTIVE</span>
              </div>

              <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.6;">
                Farmer Name: <strong>Ramesh Patel (Aadhaar Linked)</strong><br>
                Commodity: <strong>Tomato (Grade A) • 40 Ventilated Crates (1,000 kg)</strong><br>
                Cold Room: <strong>Kolar Gramin Solar Cold Storage (Unit 2) • +6.0°C</strong><br>
                Holding Period: <strong>Up to 14 Days (Rental: ₹1.50/crate/day)</strong><br>
                Instant e-NWR Cash Advance Disbursed: <strong style="color: #166534; font-size: 1.2rem;">₹ 10,725.00</strong><br>
                Bank Account: <strong>State Bank of India (•••• •••• 8842)</strong><br>
                Bank UTR: <strong>SBIN-ENWR-2026-88192</strong>
              </div>

              <div style="margin-top: 16px; background: #ffffff; border-radius: var(--radius-md); padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <span style="font-size: 0.78rem; color: #166534; font-weight: 700;">Zero Distress Selling Guarantee:</span>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Produce will be released when market recovers to > ₹24.00/kg.</div>
                </div>
                <div class="qr-box" style="width: 60px; height: 60px; font-size: 2.2rem;">📱</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="window.print()">🖨️ Print Certificate</button>
            <button class="btn btn-primary" onclick="window.FF_APP.closeModal()">Done</button>
          </div>
        `;
        this.openModal();
      }

      this.showToast('🛡️ Distress Sale Shield Activated! ₹10,725 e-NWR advance credited to your SBI account.', 'success');
      window.FF_VOICE.speak('Distress sale shield activated. Forty crates secured in solar cold storage. Ten thousand seven hundred and twenty-five rupees credited to your SBI bank account.');
    },

    openWeighbridgeModal(farmerName, defaultKg = 650) {
      const name = farmerName || 'Ramesh Patel';
      const qty = Number(defaultKg) || 650;
      const rate = 23.50;
      const total = qty * rate;

      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">⚖️ Live Spoke Digital Weighbridge & Instant DBT Terminal</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <!-- Digital Scale Simulator -->
          <div style="background: #0f172a; border-radius: var(--radius-lg); padding: 22px; color: #ffffff; margin-bottom: 18px; text-align: center;">
            <div style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Govt. Load-Cell Certified Weighbridge Reading</div>
            <div id="live-weighbridge-display" style="font-size: 3.2rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #4ade80; margin: 8px 0;">
              ${qty.toFixed(1)} kg
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; font-size: 0.85rem; color: #cbd5e1;">
              <span>Gross: <strong>${(qty + 18).toFixed(1)} kg</strong></span>
              <span>Tare Deduction: <strong>18.0 kg (26 Crates)</strong></span>
              <span>Quality: <strong style="color: #4ade80;">4.8° Brix (Grade A+)</strong></span>
            </div>
          </div>

          <table class="receipt-table" style="background: #f8fafc; border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px;">
            <tr>
              <td>Farmer Beneficiary:</td>
              <td><strong>${name}</strong> (SBI A/c ••••8842)</td>
            </tr>
            <tr>
              <td>Verified Net Produce:</td>
              <td><strong>${qty.toFixed(1)} kg Native Tomatoes</strong></td>
            </tr>
            <tr>
              <td>Agreed Direct Rate:</td>
              <td><strong>₹ ${rate.toFixed(2)} / kg</strong></td>
            </tr>
            <tr>
              <td>Middlemen / Arhtiya Deduction:</td>
              <td><span style="color: #16a34a; font-weight: 700;">₹ 0.00 (Zero Commissions)</span></td>
            </tr>
            <tr style="font-size: 1.15rem; border-top: 1px solid #cbd5e1;">
              <td><strong style="color: #166534;">Total Direct Bank Payout:</strong></td>
              <td><strong style="color: #166534;">₹ ${Math.round(total).toLocaleString()}.00</strong></td>
            </tr>
          </table>

          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-secondary" onclick="window.FF_APP.simulateScaleFluctuation()">
              🔄 Re-Calibrate Scale
            </button>
            <button class="btn btn-primary" onclick="window.FF_APP.disburseIntakeDBT(${Math.round(total)}, '${name}')">
              ⚡ Instant DBT Payout to SBI Bank
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Close</button>
        </div>
      `;

      this.openModal();
    },

    simulateScaleFluctuation() {
      const display = document.getElementById('live-weighbridge-display');
      if (!display) return;
      display.textContent = '... CALIBRATING ...';
      setTimeout(() => {
        display.textContent = '650.0 kg';
        this.showToast('⚖️ Digital load-cell zeroed and certified.', 'info');
      }, 400);
    },

    disburseIntakeDBT(amount, farmerName) {
      const farmer = window.FF_DATA.currentFarmer;
      farmer.walletBalanceRs += amount;
      this.closeModal();
      this.renderCurrentView();

      this.showToast(`⚡ ₹ ${amount.toLocaleString()}.00 successfully credited to SBI A/c ••••8842 via Aadhaar DBT! UTR: SBIN90214892`, 'success');
      window.FF_VOICE.speak(`Direct Benefit Transfer completed. ${amount} rupees has been deposited into your bank account.`);
    },

    openPostDemandModal() {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">🏬 Post Commercial Procurement Demand</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            Procure fresh produce directly from 242 verified smallholders and FPOs. Escrow deposit guarantees priority fulfillment.
          </p>

          <div class="form-group">
            <label class="form-label">Buyer Organization:</label>
            <input type="text" id="input-b2b-name" class="form-control" value="FreshMart Hypermarket (Bay 2 Sourcing)">
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Crop Required:</label>
              <select class="form-control" id="input-b2b-crop">
                <option value="Tomato (Grade A+ Export)">🍅 Tomato (Grade A+ Export)</option>
                <option value="Sun-Cured Red Onion">🧅 Sun-Cured Red Onion</option>
                <option value="Golden Mountain Potato">🥔 Golden Mountain Potato</option>
                <option value="Green Bell Capsicum">🫑 Green Bell Capsicum</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Volume Needed (kg):</label>
              <input type="number" id="input-b2b-vol" class="form-control" value="1500" min="200" max="10000">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Offered Direct Rate (₹/kg):</label>
              <input type="number" id="input-b2b-rate" class="form-control" value="26.00" step="0.5" min="10">
            </div>
            <div class="form-group">
              <label class="form-label">Delivery Hub:</label>
              <select class="form-control" id="input-b2b-spoke">
                <option>Kolar Solar Pre-cooling Spoke</option>
                <option>Hoskote Line-Haul Cross-Dock</option>
                <option>Bengaluru Peri-Urban Hub</option>
              </select>
            </div>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; margin-top: 10px;">
            <div style="font-size: 0.85rem; color: #166534; font-weight: 700;">100% Escrow Protection:</div>
            <div style="font-size: 0.78rem; color: #15803d; margin-top: 2px;">
              Total commitment of ₹ 39,000 will be held in SBI escrow and released to farmers only upon certified digital weighbridge receipt and Brix assay.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.FF_APP.confirmPostDemand()">
            🔒 Deposit Escrow & Post Demand
          </button>
        </div>
      `;

      this.openModal();
    },

    confirmPostDemand() {
      const buyerName = document.getElementById('input-b2b-name')?.value || 'Commercial Buyer';
      const crop = document.getElementById('input-b2b-crop')?.value || 'Tomato';
      const vol = Number(document.getElementById('input-b2b-vol')?.value) || 1500;
      const rate = Number(document.getElementById('input-b2b-rate')?.value) || 26.00;
      const spoke = document.getElementById('input-b2b-spoke')?.value || 'Kolar Spoke';

      const newDemand = {
        id: `DEM-${Date.now().toString().slice(-4)}`,
        buyerName: buyerName,
        buyerType: 'Verified B2B Enterprise',
        icon: '🏬',
        crop: crop,
        cropKey: crop.toLowerCase().includes('onion') ? 'onion' : (crop.toLowerCase().includes('potato') ? 'potato' : (crop.toLowerCase().includes('capsicum') ? 'capsicum' : 'tomato')),
        volumeNeededKg: vol,
        offeredRateGross: rate,
        netFarmerTakeHome: rate - 2.50,
        mandiRateComparison: rate * 0.45,
        gainPerKg: rate - 2.50 - (rate * 0.45),
        pickupSpoke: spoke,
        deliveryWindow: 'Tomorrow, Morning Slot',
        escrowDepositRs: Math.round(vol * rate),
        escrowStatus: '100% SECURED_IN_BANK',
        qualityGrade: 'Grade A Export',
        status: 'OPEN_ACCEPTING',
        fulfilledKg: 0
      };

      window.FF_DATA.buyerDemands.unshift(newDemand);
      this.closeModal();
      this.renderCurrentView();

      this.showToast(`✅ Demand for ${vol} kg ${crop} posted with ₹${newDemand.escrowDepositRs.toLocaleString()} Escrow! Smallholders notified.`, 'success');
      window.FF_VOICE.speak(`Commercial demand for ${vol} kilograms of ${crop} has been posted with secured escrow.`);
    },

    acceptDockShipment() {
      const farmer = window.FF_DATA.currentFarmer;
      farmer.walletBalanceRs += 15275;
      this.showToast('✅ FreshMart Dock: 1,490 kg verified & accepted! ₹38,740 Escrow released directly to farmers (Ramesh: ₹15,275 via DBT).', 'success');
      window.FF_VOICE.speak('Shipment verified at city dock. Escrow payment of 15,275 rupees released directly to your bank account.');
      this.renderCurrentView();
    },

    openModal() {
      const backdrop = document.getElementById('modal-backdrop');
      if (backdrop) backdrop.classList.add('open');
    },

    closeModal() {
      const backdrop = document.getElementById('modal-backdrop');
      if (backdrop) backdrop.classList.remove('open');
    },

    showToast(message, type = 'info') {
      const tray = document.getElementById('toast-container');
      if (!tray) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span>${message}</span>`;
      tray.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 20);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    },

    scrollToId(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Bootstrap when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.FF_APP.init();
  });
})();
