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
      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';

      container.innerHTML = `
        <!-- Farmer Hero Greeting -->
        <div class="farmer-hero-banner">
          <div class="farmer-hero-content">
            <div class="farmer-greeting-pill">
              <span>🌾</span>
              <span>${isHi ? 'रमेश पटेल' : farmer.name} • ${isHi ? 'कोलार जिला, कर्नाटक' : farmer.location}</span>
            </div>
            <h1 class="farmer-greeting-title">${i18n.get('farmerGreeting')}</h1>
            <p class="farmer-greeting-sub">${i18n.get('farmerHeroSub')}</p>
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
              <div class="farmer-stat-val">₹ 15,275.00</div>
              <div class="farmer-stat-label">${i18n.get('walletCard')}</div>
              <div class="farmer-stat-tag">⚡ Direct DBT Linked (SBI A/c ••••8842)</div>
            </div>
          </div>
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-sky">📦</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">1 Deal Active</div>
              <div class="farmer-stat-label">${i18n.get('activeDealsCard')}</div>
              <div class="farmer-stat-tag">FreshMart 650 kg Lot</div>
            </div>
          </div>
        </div>

        <!-- Touch Quick Action Bar for Farmers (Clean, Touch-friendly) -->
        <div class="farmer-quick-actions" style="margin-bottom: 28px;">
          <div class="farmer-action-card" onclick="window.FF_APP.openSellModal('Tomato', 23.50)">
            <div class="farmer-action-icon">🌾</div>
            <div class="farmer-action-title">${i18n.get('actionSell')}</div>
            <div class="farmer-action-sub">Direct Forward Deal</div>
          </div>
          <div class="farmer-action-card active" onclick="window.FF_LOGISTICS.openBookingModal()" style="border-color: #0284c7; background: #f0f9ff;">
            <div class="farmer-action-icon">🚚</div>
            <div class="farmer-action-title">${i18n.get('actionBookTransport')}</div>
            <div class="farmer-action-sub">Blinkit/Porter 15-min Pickup</div>
          </div>
          <div class="farmer-action-card" onclick="window.FF_APP.scrollToId('where-to-sell-section')">
            <div class="farmer-action-icon">🗺️</div>
            <div class="farmer-action-title">${i18n.get('actionWhereToSell')}</div>
            <div class="farmer-action-sub">Logistics Advisor</div>
          </div>
          <div class="farmer-action-card" onclick="window.FF_APP.scrollToId('crop-doctor-section')">
            <div class="farmer-action-icon">🩺</div>
            <div class="farmer-action-title">${i18n.get('actionDoctor')}</div>
            <div class="farmer-action-sub">Plant Health Scan</div>
          </div>
          <div class="farmer-action-card" onclick="window.FF_APP.openReceiptModal('Ramesh Patel', 650)">
            <div class="farmer-action-icon">📄</div>
            <div class="farmer-action-title">${i18n.get('actionPayout')}</div>
            <div class="farmer-action-sub">Weighbridge Slips</div>
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
            <button class="btn btn-secondary btn-sm" onclick="window.FF_APP.openReceiptModal('Ramesh Patel', 650)">
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
      const cluster = window.FF_DATA.consumerClusters[0];
      const progressPct = ((cluster.currentPoolKg / cluster.targetPoolKg) * 100).toFixed(0);
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

        <!-- Neighborhood Group-Buy Cluster Progress Bar -->
        <div class="cluster-progress-box">
          <div class="cluster-progress-info">
            <div class="cluster-progress-title">
              <span>🏘️</span>
              <span>${cluster.name} ${isHi ? 'सामूहिक पूल' : 'Group-Buy Pool'}</span>
              <span class="badge badge-success">Extra 15% OFF Active</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              <strong>${cluster.currentPoolKg} kg</strong> ${isHi ? 'बुक हुआ' : 'pooled of'} <strong>${cluster.targetPoolKg} kg</strong> ${isHi ? 'लक्ष्य में से। कल सुबह गेट पर डिलीवरी।' : 'target. Delivery tomorrow at Gate 2 Hub!'}
            </div>
            <div class="cluster-meter-wrap">
              <div class="cluster-meter-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: 800; color: #166534; font-family: 'Outfit', sans-serif;">${progressPct}% Reached</div>
            <div style="font-size: 0.78rem; color: #15803d;">85 kg needed to unlock free green chillies!</div>
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
      container.innerHTML = `
        <div class="ff-card" style="margin-bottom: 28px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>🏬</span>
                <span>B2B Commercial Buyer Portal (FreshMart Hypermarket)</span>
              </div>
              <div class="ff-card-subtitle">
                Forward harvest procurement desk: Guaranteed supply quality, zero middlemen markups, 100% escrow backed.
              </div>
            </div>
            <span class="badge badge-success">Escrow Verified</span>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">🛒</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">1,500 kg</div>
                <div class="farmer-stat-label">Forward Demand Posted</div>
                <div class="farmer-stat-tag">Tomato Grade A+</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">🔒</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">₹ 39,000</div>
                <div class="farmer-stat-label">Secured Escrow Lien</div>
                <div class="farmer-stat-tag">Protected in Bank Escrow</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">⭐</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">99.1%</div>
                <div class="farmer-stat-label">Buyer Reliability Score</div>
                <div class="farmer-stat-tag">Settlement Punctual</div>
              </div>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px;">
            <h4 style="margin-bottom: 8px; color: var(--primary-900);">Dock Receiving & Quality Acceptance Station:</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
              Shipment #ORD-2026-8812 arriving at Bay 2. Verified 1,490 kg accepted produce with 10 kg handling moisture loss.
            </p>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-primary" onclick="window.FF_APP.showToast('✅ FreshMart Dock: 1,490 kg verified & accepted! Settlement triggered.', 'success')">
                ✅ Accept Shipment & Release Escrow
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
    openSellModal(cropName, netRate) {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">🌾 Smart Harvest Listing Wizard (Sell Directly)</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 18px;">
            Post your harvest lot directly to verified B2B buyers and consumer clusters with guaranteed bank escrow.
          </p>

          <div class="form-group">
            <label class="form-label">Crop & Variety:</label>
            <select class="form-control" id="input-sell-crop">
              <option value="Tomato" ${cropName && cropName.includes('Tomato') ? 'selected' : ''}>🍅 Native Tomato (Grade-A Export)</option>
              <option value="Onion" ${cropName && cropName.includes('Onion') ? 'selected' : ''}>🧅 Sun-Cured Red Onion (Grade-A)</option>
              <option value="Potato" ${cropName && cropName.includes('Potato') ? 'selected' : ''}>🥔 Golden Mountain Potato</option>
              <option value="Capsicum" ${cropName && cropName.includes('Capsicum') ? 'selected' : ''}>🫑 Green Bell Capsicum</option>
            </select>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Estimated Harvest Volume (kg):</label>
              <input type="number" id="input-sell-qty" class="form-control" value="800" min="100" max="10000">
            </div>
            <div class="form-group">
              <label class="form-label">Harvest Date:</label>
              <input type="date" class="form-control" value="2026-09-15">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Logistics Drop-off Method:</label>
            <select class="form-control" id="input-sell-transport">
              <option>🚜 I will deliver to Kolar Solar Spoke (4.2 km away)</option>
              <option>🚚 Request Village Spoke Tractor Pickup (Shared ₹150)</option>
              <option>❄️ Move directly to Kolar Solar Cold Room for pre-cooling</option>
            </select>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; margin-top: 12px;">
            <div style="font-size: 0.9rem; color: #166534; font-weight: 800;">
              ✨ Recommended Forward Contract Rate: ₹ ${netRate || 23.50} / kg
            </div>
            <div style="font-size: 0.78rem; color: #15803d; margin-top: 2px;">
              Zero commission cuts. Direct deposit into SBI A/c ••••8842 immediately upon digital scale intake.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.FF_APP.confirmSell()">Confirm & Lock Forward Deal</button>
        </div>
      `;

      this.openModal();
    },

    confirmSell() {
      const qty = document.getElementById('input-sell-qty')?.value || 800;
      const crop = document.getElementById('input-sell-crop')?.value || 'Tomato';
      this.closeModal();
      this.showToast(`🎉 Harvest lot of ${qty} kg ${crop} registered successfully! Forward contract locked.`, 'success');
      window.FF_VOICE.speak(`Congratulations. Your harvest lot of ${qty} kilograms has been registered directly at recommended contract rate.`);
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
