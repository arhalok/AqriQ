/**
 * FarmFlow Kisan - Farmer Dedicated Modular Workflows & Step-by-Step Selling Pipeline
 * Provides isolated views for:
 * 1. Farmer Workbench (PRIMARY)
 * 2. Guided 5-Step Selling Pipeline & AI Pricing (SELL)
 * 3. Dedicated Farmgate Transport Booking & Tracking (TRANSPORT)
 * 4. Aadhaar DBT Passbook & Settlement Ledger (DBT)
 * 5. Kisan Vani Voice Studio (VOICE)
 */

(function () {
  'use strict';

  window.FF_FARMER_WORKFLOW = {
    // Current state of guided selling pipeline
    sellingState: {
      currentStep: 1, // 1: Produce Input, 2: AI Price & Mandi, 3: Logistics Transport, 4: DBT & Success
      crop: 'tomato',
      variety: 'Sivam Hybrid (Grade A+)',
      qtyKg: 650,
      harvestDate: '2026-09-15',
      spokeVillage: 'Vokkaleri e-NAM Sub-Spoke (2.8 km)',
      selectedBuyerId: 'BUYER-01',
      selectedVehicle: 'E_LOADER',
      aiPrediction: null,
      lastExecutedSale: null
    },

    // ========================================================================
    // 1. PRIMARY: FARMER WORKBENCH (मुख्य पृष्ठ)
    // ========================================================================
    renderWorkbench(container) {
      const activeAcc = window.FF_KYC ? window.FF_KYC.getActiveAccount() : null;
      const isFarmerAcc = activeAcc && activeAcc.actorType === 'FARMER';
      const farmer = isFarmerAcc ? {
        ...window.FF_DATA.currentFarmer,
        name: activeAcc.name,
        phone: activeAcc.phone,
        trustScore: activeAcc.trustScore,
        acres: activeAcc.acres || 2.5,
        location: activeAcc.farmLocation || window.FF_DATA.currentFarmer.location,
        dbtStatus: activeAcc.kycStatus === 'VERIFIED' ? 'VERIFIED_AADHAAR_LINKED' : 'PENDING_VERIFICATION'
      } : window.FF_DATA.currentFarmer;

      const weather = window.FF_DATA.weatherFeed;
      const i18n = window.FF_I18N;
      const isHi = i18n.currentLang === 'hi';
      const activeLots = window.FF_BRIDGE ? window.FF_BRIDGE.smallholderListings.filter(l => l.farmerId === farmer.id) : farmer.activeListings;

      container.innerHTML = `
        <!-- Profile & Verified DBT Status Banner -->
        <div class="farmer-profile-card">
          <div class="farmer-profile-main">
            <div class="farmer-avatar-ring">👨‍🌾</div>
            <div class="farmer-details">
              <div class="farmer-name-row">
                <h1 class="farmer-name">${farmer.name}</h1>
                <span class="kyc-status-pill kyc-verified">✓ Verhoeff Aadhaar Linked</span>
                <span class="badge badge-success">Trust: ${farmer.trustScore}/100</span>
              </div>
              <div class="farmer-meta-text">
                📍 ${farmer.location} • 🌾 ${farmer.acres} Acres • 🏦 ${farmer.bankName} (A/c ${farmer.accountMasked})
              </div>
            </div>
          </div>
          <div class="farmer-wallet-badge">
            <div class="wallet-sub">${isHi ? 'उपलब्ध बैंक DBT बैलेंस' : 'Available Bank DBT Balance'}</div>
            <div class="wallet-amount">₹ ${(farmer.walletBalanceRs || 42350).toLocaleString()}</div>
            <div style="font-size: 0.75rem; color: #15803d; font-weight: 700; margin-top: 2px;">
              ✓ 100% बिचौलिया-मुक्त सीधी बैंक जमा
            </div>
          </div>
        </div>

        <!-- 5 BIG ILLITERATE-FRIENDLY ACTION TILES (Routes directly to sub-tabs) -->
        <div class="kisan-big-grid">
          <!-- Tile 1: 🟢 फसल बेचें -->
          <div class="kisan-tile tile-sell" onclick="window.FF_AUTH.handleSubnavClick('SELL')">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">🌾</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('sell')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">१. ${isHi ? 'फसल बेचें' : 'Sell Produce'}</div>
              <div class="kisan-tile-sub">${isHi ? 'एआई मूल्य जांचें और सीधे बेचें' : 'AI Price Predictor & Direct Institutional Forward Deal'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">₹ 24.50 / kg</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'शुरू करें 👉' : 'Start Flow 👉'}</span>
            </div>
          </div>

          <!-- Tile 2: 🚚 खेत से गाड़ी बुलाएं -->
          <div class="kisan-tile tile-transport" onclick="window.FF_AUTH.handleSubnavClick('TRANSPORT')">
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
              <span class="kisan-tile-tap-hint">${isHi ? 'गाड़ी देखें 👉' : 'View Fleet 👉'}</span>
            </div>
          </div>

          <!-- Tile 3: 💰 डिजिटल DBT पासबुक -->
          <div class="kisan-tile tile-weigh" onclick="window.FF_AUTH.handleSubnavClick('DBT')">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">💰</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.narrateCard('weighbridge')" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">३. ${isHi ? 'बैंक DBT पासबुक' : 'Bank DBT Passbook'}</div>
              <div class="kisan-tile-sub">${isHi ? 'कंप्यूटरीकृत तौल पर्ची व 2 घंटे में DBT' : 'IoT Load-Cell Slip & Direct Bank Payout'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">${isHi ? 'UTR रसीदें' : 'Verified Receipts'}</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'पासबुक खोलें 👉' : 'Open Ledger 👉'}</span>
            </div>
          </div>

          <!-- Tile 4: 🎙️ किसान वाणी -->
          <div class="kisan-tile tile-storage" onclick="window.FF_AUTH.handleSubnavClick('VOICE')">
            <div class="kisan-tile-top">
              <div class="kisan-tile-icon">🎙️</div>
              <button class="btn-listen-card" onclick="event.stopPropagation(); window.FF_VOICE.playAdvisory()" title="सुनें">
                🔊 ${isHi ? 'सुनें' : 'Listen'}
              </button>
            </div>
            <div class="kisan-tile-body">
              <div class="kisan-tile-title">४. ${isHi ? 'किसान वाणी' : 'Kisan Vani Audio'}</div>
              <div class="kisan-tile-sub">${isHi ? 'आज का मंडी भाव व मौसम आवाज में सुनें' : 'Vernacular Mandi Intelligence & AI Audio Assistant'}</div>
            </div>
            <div class="kisan-tile-bottom">
              <span class="kisan-tile-badge">${isHi ? 'लाइव ऑडियो' : 'Live Voice'}</span>
              <span class="kisan-tile-tap-hint">${isHi ? 'सुनें 👉' : 'Listen 👉'}</span>
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
              <span class="kisan-tile-tap-hint">${isHi ? 'जांचें 👉' : 'Scan Leaf 👉'}</span>
            </div>
          </div>
        </div>

        <!-- ACTIVE PRODUCE CONTRACTS & MARKET STATUS OVERVIEW -->
        <div class="ff-card" style="margin-bottom: 24px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>📋</span>
                <span>${isHi ? 'आपके सक्रिय लॉट व अग्रिम सौदे' : 'Your Active Produce Lots & Forward Contracts'}</span>
              </div>
              <div class="ff-card-subtitle">
                ${isHi ? 'ये फसलें खरीदारों और सोसायटियों के लिए उपलब्ध हैं।' : 'These harvest batches are actively synced with B2B Wholesale buyers & Consumer clusters.'}
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.FF_AUTH.handleSubnavClick('SELL')">
              + ${isHi ? 'नया लॉट बेचें' : 'Sell New Produce Lot'}
            </button>
          </div>

          <div class="orders-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>लॉट आईडी / फसल</th>
                  <th>मात्रा</th>
                  <th>सीधा भाव (Net Rate)</th>
                  <th>कुल अनुमानित आय</th>
                  <th>स्थिति (Status)</th>
                  <th>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                ${activeLots.map(lot => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #1e293b;">${lot.icon || '🌾'} ${lot.crop}</div>
                      <div style="font-size: 0.76rem; color: #64748b;">${lot.id || lot.variety} • ${lot.spokeName || lot.spoke}</div>
                    </td>
                    <td><strong style="font-size: 0.95rem;">${lot.qtyKg} kg</strong></td>
                    <td><strong style="color: #166534; font-size: 1rem;">₹ ${(lot.farmerRatePerKg || lot.netExpected || 23.50).toFixed(2)} /kg</strong></td>
                    <td><strong style="color: #0f172a;">₹ ${(Math.round((lot.qtyKg) * (lot.farmerRatePerKg || lot.netExpected || 23.50))).toLocaleString()}</strong></td>
                    <td>
                      <span class="badge ${lot.status === 'IN_TRANSIT' ? 'badge-primary' : (lot.status === 'MATCHED_ORDER' ? 'badge-success' : 'badge-warning')}">
                        ${lot.status || 'AVAILABLE_FOR_SOURCING'}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.FF_AUTH.handleSubnavClick('TRANSPORT')">
                        🚚 वाहन देखें
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Weather & Spray Advice -->
        <div class="weather-advisory-strip" style="margin-bottom: 24px;">
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
            <div class="spray-title">🌱 ${isHi ? 'कृषि सलाह' : 'Agro Spray Advice'}</div>
            <div class="spray-msg">${weather.sprayAdvisory.recommendation}</div>
          </div>
        </div>

        <!-- AI Crop Doctor Leaf Diagnosis -->
        <div id="crop-doctor-section" class="crop-doctor-box">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>🩺</span>
                <span>${isHi ? 'एआई फसल डॉक्टर (Kisan Leaf Diagnostic)' : 'AI Crop Doctor'}</span>
              </div>
              <div class="ff-card-subtitle">${isHi ? 'पत्ती की फोटो खींचें और 2 सेकंड में बीमारी की पहचान व उपचार पाएं।' : 'Upload or capture diseased crop foliage for instant ICAR compliant remedies.'}</div>
            </div>
            <span class="badge badge-success">ICAR Validated Model</span>
          </div>
          <div class="crop-doctor-grid">
            <div class="doctor-upload-zone" onclick="window.FF_CROP_DOCTOR && window.FF_CROP_DOCTOR.triggerUpload()">
              <div class="upload-icon">📷</div>
              <div class="upload-prompt">${isHi ? 'पत्ती की फोटो यहां अपलोड करें' : 'Tap to Capture or Upload Foliage Photo'}</div>
              <div class="upload-sub">${isHi ? 'टमाटर, प्याज, मिर्च, आलू इत्यादि की पत्तियों को स्कैन करें' : 'Instant AI computer vision leaf scan'}</div>
            </div>
            <div id="crop-doctor-result-pane" class="doctor-result-card">
              <div class="sample-diagnosis-badge">Sample Scan Ready: Early Blight in Tomato</div>
              <div class="diagnosis-title">Alternaria solani (Early Blight) detected with 94.8% confidence.</div>
              <div class="rx-pill-tray">
                <span class="rx-pill organic">🌱 Organic: Neem Seed Kernel Extract (5%)</span>
                <span class="rx-pill chemical">🧪 Chemical: Mancozeb 75% WP @ 2g/L</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // ========================================================================
    // 2. SELL: 5-STEP GUIDED SELLING PIPELINE (अपनी फसल बेचें - पूरा यूजर फ्लो)
    // ========================================================================
    renderSellProducePipeline(container) {
      const isHi = window.FF_I18N.currentLang === 'hi';
      const step = this.sellingState.currentStep;

      // Calculate AI Price if not already present
      if (!this.sellingState.aiPrediction) {
        this.sellingState.aiPrediction = window.FF_BRIDGE.calculateAIPrice(
          this.sellingState.crop,
          this.sellingState.qtyKg,
          this.sellingState.variety
        );
      }

      const ai = this.sellingState.aiPrediction;

      container.innerHTML = `
        <!-- Pipeline Header & Stepper -->
        <div class="sell-pipeline-header">
          <div class="sell-header-top">
            <div>
              <span class="pipeline-kicker">🌾 SIH PS-33 FARMER TO BUYER FLOW</span>
              <h1 class="pipeline-title">${isHi ? 'फसल बिक्री व सीधी बैंक DBT प्रक्रिया' : 'Produce Selling & Instant Bank DBT Pipeline'}</h1>
              <p class="pipeline-sub">
                ${isHi ?
          'अपनी फसल का विवरण दर्ज करें ➔ एआई मंडी तुलना देखें ➔ सर्वोत्तम खरीदार चुनें ➔ खेत पर गाड़ी मंगाएं ➔ 2 घंटे में DBT पाएं।' :
          'Enter produce details ➔ Run AI price & Mandi benchmark ➔ Lock best buyer ➔ Farmgate EV dispatch ➔ Direct Aadhaar DBT.'}
              </p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.FF_FARMER_WORKFLOW.resetSellFlow()">
              🔄 ${isHi ? 'नया फॉर्म भरें' : 'Start Fresh'}
            </button>
          </div>

          <!-- Step Progress Bar -->
          <div class="sell-stepper-bar">
            <div class="stepper-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(1)">
              <div class="step-num">${step > 1 ? '✓' : '१'}</div>
              <div class="step-text">
                <span class="step-heading">${isHi ? '१. फसल विवरण' : '1. Produce Info'}</span>
                <span class="step-subheading">${isHi ? 'मात्रा व प्रकार' : 'Crop & Volume'}</span>
              </div>
            </div>
            <div class="stepper-line ${step >= 2 ? 'active' : ''}"></div>
            <div class="stepper-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(2)">
              <div class="step-num">${step > 2 ? '✓' : '२'}</div>
              <div class="step-text">
                <span class="step-heading">${isHi ? '२. एआई भाव व मंडी' : '2. AI & Mandi Comparison'}</span>
                <span class="step-subheading">${isHi ? '+122% मुनाफा' : 'Fair Price Engine'}</span>
              </div>
            </div>
            <div class="stepper-line ${step >= 3 ? 'active' : ''}"></div>
            <div class="stepper-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(3)">
              <div class="step-num">${step > 3 ? '✓' : '३'}</div>
              <div class="step-text">
                <span class="step-heading">${isHi ? '३. खरीदार चयन' : '3. Choose Buyer'}</span>
                <span class="step-subheading">${isHi ? '100% बैंक एस्क्रो' : 'Locked Demand'}</span>
              </div>
            </div>
            <div class="stepper-line ${step >= 4 ? 'active' : ''}"></div>
            <div class="stepper-step ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(4)">
              <div class="step-num">${step > 4 ? '✓' : '४'}</div>
              <div class="step-text">
                <span class="step-heading">${isHi ? '४. खेत से गाड़ी' : '4. Book Transport'}</span>
                <span class="step-subheading">${isHi ? 'ई-लोडर पिकअप' : 'Farmgate Logistics'}</span>
              </div>
            </div>
            <div class="stepper-line ${step >= 5 ? 'active' : ''}"></div>
            <div class="stepper-step ${step === 5 ? 'active completed' : ''}">
              <div class="step-num">५</div>
              <div class="step-text">
                <span class="step-heading">${isHi ? '५. तुलाई व DBT' : '5. Assaying & DBT'}</span>
                <span class="step-subheading">${isHi ? 'बैंक जमा रसीद' : 'Direct Bank Payout'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step Content View -->
        <div class="sell-step-workspace">
          ${this.renderSellStepContent(step, ai, isHi)}
        </div>
      `;
    },

    renderSellStepContent(step, ai, isHi) {
      if (step === 1) {
        return `
          <!-- STAGE 1: PRODUCE INPUT -->
          <div class="sell-stage-card">
            <div class="stage-card-header">
              <div class="stage-badge">चरण १ / ५</div>
              <h2 class="stage-title">${isHi ? 'अपनी फसल का विवरण दर्ज करें' : 'Step 1: Enter Harvest Lot Details'}</h2>
              <p class="stage-desc">${isHi ? 'फसल, अनुमानित वजन और स्पोक केंद्र चुनें ताकि एआई सटीक भाव निकाल सके।' : 'Select your crop, volume in kilograms/quintals, and local spoke aggregation center.'}</p>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">${isHi ? 'फसल चुनें (Crop):' : 'Select Crop:'}</label>
                <select class="form-control" id="sell-input-crop" onchange="window.FF_FARMER_WORKFLOW.updateCropSelection(this.value)">
                  <option value="tomato" ${this.sellingState.crop === 'tomato' ? 'selected' : ''}>🍅 देशी/हाइब्रिड टमाटर (Tomato)</option>
                  <option value="onion" ${this.sellingState.crop === 'onion' ? 'selected' : ''}>🧅 लाल प्याज (Red Onion)</option>
                  <option value="capsicum" ${this.sellingState.crop === 'capsicum' ? 'selected' : ''}>🫑 हरी शिमला मिर्च (Bell Capsicum)</option>
                  <option value="potato" ${this.sellingState.crop === 'potato' ? 'selected' : ''}>🥔 ताजा आलू (Fresh Potato)</option>
                  <option value="chilli" ${this.sellingState.crop === 'chilli' ? 'selected' : ''}>🌶️ तीखी हरी मिर्च (Green Chilli)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">${isHi ? 'किस्म / ग्रेड (Variety & Quality):' : 'Crop Variety & Quality Grade:'}</label>
                <select class="form-control" id="sell-input-variety">
                  <option value="Sivam Hybrid (Grade A+)" selected>Grade A+ Premium (निर्यात व सुपरमार्केट ग्रेड)</option>
                  <option value="Grade A Standard">Grade A Standard (नियमित मंडी से बेहतर)</option>
                  <option value="Grade B Processing">Grade B (सॉस व प्यूरी प्रोसेसिंग यूनिट्स के लिए)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">${isHi ? 'कुल वजन (Kilograms):' : 'Harvest Volume (kg):'}</label>
                <div class="qty-input-wrap">
                  <input type="number" id="sell-input-qty" class="form-control" value="${this.sellingState.qtyKg}" min="50" max="25000" oninput="window.FF_FARMER_WORKFLOW.updateVolume(this.value)">
                  <span class="qty-unit-tag">kg</span>
                </div>
                <div class="quick-qty-chips">
                  <button type="button" class="quick-chip" onclick="window.FF_FARMER_WORKFLOW.setQuickVolume(250)">250 kg (10 क्रेट)</button>
                  <button type="button" class="quick-chip" onclick="window.FF_FARMER_WORKFLOW.setQuickVolume(650)">650 kg (26 क्रेट)</button>
                  <button type="button" class="quick-chip" onclick="window.FF_FARMER_WORKFLOW.setQuickVolume(1200)">1,200 kg (1.2 टन)</button>
                  <button type="button" class="quick-chip" onclick="window.FF_FARMER_WORKFLOW.setQuickVolume(2500)">2,500 kg (2.5 टन)</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">${isHi ? 'कटाई की तारीख:' : 'Harvest Date:'}</label>
                <input type="date" id="sell-input-date" class="form-control" value="${this.sellingState.harvestDate}">
              </div>

              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label">${isHi ? 'निकटतम विलेज स्पोक केंद्र (Village Spoke Aggregator):' : 'Nearest Village Spoke Hub:'}</label>
                <select class="form-control" id="sell-input-spoke">
                  <option value="Vokkaleri e-NAM Sub-Spoke (2.8 km)" selected>🏛️ Vokkaleri e-NAM Sub-Spoke #KA-04 (2.8 km away • 0 ग्राम वजन चोरी)</option>
                  <option value="Malur Solar Cold Spoke (4.5 km)">❄️ Malur Solar Cold Hub (4.5 km away • 70% लोन उपलब्ध)</option>
                  <option value="Kolar Central FPO Depot (8.2 km)">🏢 Kolar Central Agro Spoke (8.2 km away)</option>
                </select>
              </div>
            </div>

            <div class="stage-footer">
              <button class="btn btn-secondary" onclick="window.FF_VOICE.narrateCard('sell')">
                🔊 ${isHi ? 'आवाज में निर्देश सुनें' : 'Listen Instructions'}
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.FF_FARMER_WORKFLOW.proceedToAIPrice()">
                <span>🤖</span>
                <span>${isHi ? 'एआई मूल्य भविष्यवाणी चलाएं 👉' : 'Run AI Price Engine 👉'}</span>
              </button>
            </div>
          </div>
        `;
      } else if (step === 2) {
        const holding = ai.holdingAdvisor || {};
        const forecast = ai.forecast7Days || [];
        const waterfall = ai.priceWaterfall || null;

        return `
          <!-- STAGE 2: AI PRICE ENGINE & MANDI BENCHMARK -->
          <div class="sell-stage-card">
            <div class="stage-card-header">
              <div class="stage-badge">चरण २ / ५ • SIH PS-33 AI PRICE ENGINE</div>
              <h2 class="stage-title">${isHi ? 'एआई मूल्य भविष्यवाणी और मंडी तुलना' : 'Step 2: AI Price Engine & Mandi Deduction Benchmark'}</h2>
              <p class="stage-desc">${isHi ? 'मांग, मौसम, और मंडी आवक के आधार पर आपका शुद्ध बैंक भाव और सर्वोत्तम बिक्री रणनीति।' : 'Algorithmic market intelligence: 7-day predictive curves, solar cold holding advisor, and transparent farm-to-fork waterfall.'}</p>
            </div>

            <!-- 1. AI STRATEGY & HOLDING ADVISOR CARD (CLEAN TYPE, HIGH CONTRAST) -->
            <div class="ai-strategy-card ${holding.recommendedAction === 'HOLD_IN_COLD_ROOM' ? 'hold-strategy' : 'sell-strategy'}">
              <div class="strategy-header">
                <div class="strategy-title-wrap">
                  <span class="strategy-badge-icon">${holding.recommendedAction === 'HOLD_IN_COLD_ROOM' ? '❄️ 💡' : '⚡ 🎯'}</span>
                  <div>
                    <div class="strategy-badge-title">
                      ${isHi
            ? (holding.recommendedAction === 'HOLD_IN_COLD_ROOM' ? 'एआई रणनीति सलाह: 3 दिन सोलर कोल्ड रूम में रखें (Hold in Solar Cold Room)' : 'एआई रणनीति सलाह: आज ही खेत पर बेचें (Sell Today at Farmgate)')
            : (holding.recommendedAction === 'HOLD_IN_COLD_ROOM' ? 'AI Strategy Advisory: Store in Village Solar Cold Room (Hold 3 Days)' : 'AI Strategy Advisory: Sell Today at Farmgate (Peak Immediate Demand)')}
                    </div>
                    <div class="strategy-badge-sub">${holding.rationale}</div>
                  </div>
                </div>
                <span class="badge ${holding.recommendedAction === 'HOLD_IN_COLD_ROOM' ? 'badge-primary' : 'badge-success'}" style="font-size: 0.88rem; padding: 6px 14px;">
                  ${holding.recommendedAction === 'HOLD_IN_COLD_ROOM' ? `+ ₹ ${holding.holdingAdvantageNetRs.toLocaleString()} Net Extra (+${holding.holdingGainPct}%)` : 'Peak Today Rate'}
                </span>
              </div>

              <div class="strategy-metrics-grid">
                <div class="strat-metric-card">
                  <div class="strat-label">${isHi ? 'आज का सीधा भाव (Today Farmgate)' : 'Today Farmgate Direct Rate'}</div>
                  <div class="strat-val">₹ ${holding.todayRate.toFixed(2)} / kg</div>
                  <div class="strat-sub">${isHi ? 'कुल आज का भुगतान:' : 'Today Net Payout:'} <strong>₹ ${holding.todayTakeHome.toLocaleString()}</strong></div>
                </div>

                <div class="strat-metric-card highlight">
                  <div class="strat-label">${isHi ? '3 दिन बाद अनुमानित भाव (Day +3 Peak)' : 'Projected Rate in 3 Days (Day +3)'}</div>
                  <div class="strat-val text-success">₹ ${holding.peakRate.toFixed(2)} / kg</div>
                  <div class="strat-sub">${isHi ? 'मंडी आवक 38% घटने से तेजी' : 'Mandi supply taper lifts price'}</div>
                </div>

                <div class="strat-metric-card">
                  <div class="strat-label">${isHi ? 'सोलर कोल्ड स्टोरेज शुल्क (3 दिन)' : 'Solar Cold Rental (3 Days)'}</div>
                  <div class="strat-val" style="color: #64748b;">- ₹ ${holding.totalStorageFeeRs}</div>
                  <div class="strat-sub">केवल ₹0.05 / kg / दिन (₹1.25/क्रेट)</div>
                </div>

                <div class="strat-metric-card gain">
                  <div class="strat-label">${isHi ? 'कोल्ड स्टोरेज के बाद शुद्ध बैंक लाभ' : 'Net Take-Home after Cold Rental'}</div>
                  <div class="strat-val text-success" style="font-size: 1.35rem;">₹ ${holding.netHoldTakeHome.toLocaleString()}</div>
                  <div class="strat-sub"><strong>+ ₹ ${holding.holdingAdvantageNetRs.toLocaleString()} अतिरिक्त नकद!</strong></div>
                </div>
              </div>

              <!-- Instant Pledge Credit Callout -->
              <div class="pledge-credit-strip">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.3rem;">🏦</span>
                  <div>
                    <strong>${isHi ? 'तुरंत नकद की जरूरत है?' : 'Need Immediate Cash Flow?'}</strong>
                    <span style="font-size: 0.82rem; color: #475569;">${isHi ? 'एफपीओ कोल्ड रूम रसीद पर 70% अग्रिम लोन तुरंत एसबीआई खाते में उपलब्ध:' : '70% Warehouse Pledge Loan credited to your SBI account in 1 hour:'}</span>
                  </div>
                </div>
                <div class="pledge-amount-badge">₹ ${holding.instantPledgeCreditRs.toLocaleString()} ${isHi ? 'अग्रिम लोन स्वीकृत' : 'Instant Advance'}</div>
              </div>
            </div>

            <!-- 2. DYNAMIC 7-DAY PREDICTIVE PRICE CURVE (CLEAN HORIZONTAL STRIP) -->
            <div class="price-forecast-strip-box">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <strong style="font-size: 1rem; color: #0f172a;">📈 ${isHi ? '7-दिवसीय मूल्य भविष्यवाणी व रुझान (7-Day Price Forecast Curve)' : '7-Day Machine Learning Price Trajectory'}</strong>
                  <div style="font-size: 0.78rem; color: #64748b;">${isHi ? 'उपग्रह मौसम डेटा और बेंगलुरु/कोलार मंडी आवक पर आधारित' : 'Calibrated on Bangalore APMC arrival velocity, weather radar & retail demand'}</div>
                </div>
                <span class="badge badge-success">✓ 94.2% Prediction Accuracy</span>
              </div>

              <div class="forecast-days-container">
                ${forecast.map(f => `
                  <div class="forecast-day-chip ${f.isPeak ? 'peak-day' : ''} ${f.dayIndex === 0 ? 'today-day' : ''}">
                    <div class="forecast-chip-header">
                      <span class="forecast-day-title">${f.dayLabel}</span>
                      ${f.isPeak ? '<span class="peak-star-badge">PEAK 🌟</span>' : ''}
                      ${f.dayIndex === 0 ? '<span class="today-tag">TODAY</span>' : ''}
                    </div>
                    <div class="forecast-chip-rate">₹ ${f.rateFarmgate.toFixed(2)}</div>
                    <div class="forecast-chip-mandi">Mandi: ₹${f.rateMandi.toFixed(2)}</div>
                    <div class="forecast-chip-delta ${f.deltaVsToday > 0 ? 'text-success' : ''}">
                      ${f.deltaVsToday === 0 ? 'Baseline' : `+₹${f.deltaVsToday.toFixed(1)}/kg`}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 3. SIDE-BY-SIDE MANDI VS FARMFLOW COMPARATIVE BOX -->
            <div class="comparative-price-grid">
              <!-- Left: Traditional APMC Mandi (Exploitative) -->
              <div class="price-box mandi-loss-box">
                <div class="price-box-tag text-danger">❌ पारंपरिक एपीएमसी मंडी (APMC Mandi)</div>
                <div class="headline-mandi-rate">₹ ${ai.mandiDeductions.headlineRate.toFixed(2)} / kg <span class="rate-note">(दिखावटी बोर्ड भाव)</span></div>
                
                <div class="mandi-deduction-list">
                  <div class="deduction-row">
                    <span>आढ़तिया दलाली (8% Arhatiya Cut):</span>
                    <strong class="text-danger">- ₹ ${ai.mandiDeductions.commissionAgentFee.toFixed(2)}</strong>
                  </div>
                  <div class="deduction-row">
                    <span>कांटा हेराफेरी (2.5 kg/क्रेट चोरी):</span>
                    <strong class="text-danger">- ₹ ${ai.mandiDeductions.weighbridgeLoss.toFixed(2)}</strong>
                  </div>
                  <div class="deduction-row">
                    <span>मंडी पल्लेदारी व उतराई (Hamaali):</span>
                    <strong class="text-danger">- ₹ ${ai.mandiDeductions.unloadingHamaali.toFixed(2)}</strong>
                  </div>
                  <div class="deduction-row">
                    <span>दूर मंडी का ट्रैक्टर भाड़ा (Freight):</span>
                    <strong class="text-danger">- ₹ ${ai.mandiDeductions.transportTractor.toFixed(2)}</strong>
                  </div>
                </div>

                <div class="net-in-hand-row mandi-net">
                  <span>हाथ में शुद्ध भाव (Net In Hand):</span>
                  <strong class="text-danger">₹ ${ai.mandiDeductions.netMandiInHand.toFixed(2)} / kg</strong>
                </div>
                <div class="total-payout-box mandi-total">
                  <span>${ai.quantityKg} kg पर मंडी से कुल मिलेगा:</span>
                  <strong>₹ ${ai.mandiTotalTakeHome.toLocaleString()}.00</strong>
                </div>
              </div>

              <!-- Right: FarmFlow e-NAM Direct Realization (Fair) -->
              <div class="price-box farmflow-win-box">
                <div class="price-box-tag text-success">✅ FarmFlow e-NAM सीधा बैंक भाव</div>
                <div class="headline-farmflow-rate">₹ ${ai.fairFarmgateRate.toFixed(2)} / kg <span class="rate-note">(100% शुद्ध बैंक जमा)</span></div>
                
                <div class="farmflow-perks-list">
                  <div class="perk-row"><span>✓ बिचौलिया कमीशन:</span> <strong class="text-success">0% शून्य (Zero Commission)</strong></div>
                  <div class="perk-row"><span>✓ डिजिटल कांटा वजन चोरी:</span> <strong class="text-success">0 ग्राम (IoT Load-Cell Verified)</strong></div>
                  <div class="perk-row"><span>✓ खेत पर गाड़ी पिकअप:</span> <strong class="text-success">खरीदार पूल द्वारा मुफ्त</strong></div>
                  <div class="perk-row"><span>✓ भुगतान गारंटी:</span> <strong class="text-success">100% बैंक एस्क्रो से 2 घंटे में DBT</strong></div>
                </div>

                <div class="net-in-hand-row farmflow-net">
                  <span>हाथ में शुद्ध भाव (Direct Realization):</span>
                  <strong class="text-success">₹ ${ai.fairFarmgateRate.toFixed(2)} / kg</strong>
                </div>
                <div class="total-payout-box farmflow-total">
                  <span>${ai.quantityKg} kg पर आपके खाते में आएंगे:</span>
                  <strong style="color: #166534; font-size: 1.4rem;">₹ ${ai.totalFarmerTakeHome.toLocaleString()}.00</strong>
                </div>
              </div>
            </div>

            <!-- 4. TRANSPARENT 5-TIER FARM-TO-FORK PRICE WATERFALL -->
            ${waterfall ? `
              <div class="waterfall-container-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <strong style="font-size: 1rem; color: #0f172a;">📊 ${isHi ? 'उपभोक्ता रुपये का पारदर्शी वितरण (Farm-to-Fork Rupee Breakdown)' : 'Transparent Farm-to-Fork Consumer Rupee Balance'}</strong>
                    <div style="font-size: 0.78rem; color: #64748b;">${isHi ? 'उपभोक्ता द्वारा चुकाए गए प्रत्येक रुपये का 100% सटीक गणितीय हिसाब:' : 'Every rupee paid by the consumer is balanced cleanly with zero hidden middleman leakages:'}</div>
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #166534;">
                    ${isHi ? 'उपभोक्ता मूल्य:' : 'Consumer Price:'} <strong>₹ ${waterfall.consumerPricePerKg.toFixed(2)} / kg</strong> (सुपरमार्केट से ₹${waterfall.consumerSavingsPerKg.toFixed(2)} सस्ता)
                  </div>
                </div>

                <!-- Color Progress Segments -->
                <div class="waterfall-progress-bar">
                  ${waterfall.breakdown.map(b => `
                    <div style="width: ${b.pct}%; background: ${b.color};" class="waterfall-seg" title="${b.label}: ₹${b.amount.toFixed(2)} (${b.pct}%)">
                      <span>${b.pct}%</span>
                    </div>
                  `).join('')}
                </div>

                <div class="waterfall-breakdown-tiles">
                  ${waterfall.breakdown.map(b => `
                    <div class="waterfall-tile" style="border-left: 3.5px solid ${b.color};">
                      <div class="w-tile-top">
                        <span class="w-tile-icon">${b.icon}</span>
                        <span class="w-tile-pct" style="color: ${b.color};">${b.pct}%</span>
                      </div>
                      <div class="w-tile-amount">₹ ${b.amount.toFixed(2)} / kg</div>
                      <div class="w-tile-label">${b.label}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Profit Summary Banner -->
            <div class="extra-profit-banner" style="margin-top: 20px;">
              <div class="profit-banner-left">
                <span class="profit-spark">🎉</span>
                <div>
                  <div class="profit-title">${isHi ? 'सीधा अतिरिक्त नकद लाभ:' : 'Your Direct Additional Net Gain:'} <strong>+ ₹ ${ai.extraCashInHand.toLocaleString()}.00</strong></div>
                  <div class="profit-sub">${isHi ? `पारंपरिक मंडी से पूरे ${ai.percentageGain}% अधिक पैसे सीधे आपके बैंक खाते में जमा होंगे!` : `You pocket +${ai.percentageGain}% more profit with zero middleman deductions.`}</div>
                </div>
              </div>
              <span class="badge badge-success" style="font-size: 1rem; padding: 8px 16px;">+ ${ai.percentageGain}% Net Gain</span>
            </div>

            <div class="stage-footer">
              <button class="btn btn-secondary" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(1)">
                ← ${isHi ? 'विवरण बदलें' : 'Back to Details'}
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(3)">
                <span>🏬</span>
                <span>${isHi ? 'सर्वोत्तम खरीदार चुनें व सौदा करें 👉' : 'Select Buyer & Confirm Sale 👉'}</span>
              </button>
            </div>
          </div>
        `;
      } else if (step === 3) {
        return `
          <!-- STAGE 3: SELECT BEST BUYER & CONFIRM SALE -->
          <div class="sell-stage-card">
            <div class="stage-card-header">
              <div class="stage-badge">चरण ३ / ५</div>
              <h2 class="stage-title">${isHi ? 'सर्वोत्तम सत्यापित खरीदार चुनें' : 'Step 3: Select Matched Institutional Buyer'}</h2>
              <p class="stage-desc">${isHi ? 'सभी खरीदारों ने 100% अग्रिम धनराशि बैंक एस्क्रो में जमा कर रखी है। अपनी पसंद का खरीदार चुनें।' : 'Verified institutional buyers with 100% upfront escrow deposits in bank. Pick your preferred contract.'}</p>
            </div>

            <!-- Matched Buyer Demands Tray -->
            <div class="buyers-selection-tray">
              ${ai.matchedBuyers.map(b => `
                <div class="buyer-deal-card ${this.sellingState.selectedBuyerId === b.id ? 'selected' : ''}" onclick="window.FF_FARMER_WORKFLOW.selectBuyer('${b.id}')">
                  <div class="deal-card-top">
                    <div class="buyer-brand">
                      <span class="buyer-icon">${b.icon}</span>
                      <div>
                        <div class="buyer-name">${b.name}</div>
                        <div class="buyer-type">${b.type}</div>
                      </div>
                    </div>
                    <span class="badge badge-success">${b.escrowStatus}</span>
                  </div>

                  <div class="deal-metrics-grid">
                    <div class="deal-metric">
                      <div class="deal-metric-label">${isHi ? 'सीधा बैंक भाव' : 'Net Farmer Rate'}</div>
                      <div class="deal-metric-val text-success">₹ ${b.netFarmerTakeHome.toFixed(2)} / kg</div>
                    </div>
                    <div class="deal-metric">
                      <div class="deal-metric-label">${isHi ? 'कुल भुगतान (DBT)' : 'Total Take-Home'}</div>
                      <div class="deal-metric-val">₹ ${(Math.round(b.netFarmerTakeHome * ai.quantityKg)).toLocaleString()}</div>
                    </div>
                    <div class="deal-metric">
                      <div class="deal-metric-label">${isHi ? 'खेत से पिकअप समय' : 'Farmgate Pickup'}</div>
                      <div class="deal-metric-val" style="font-size: 0.85rem; color: #1e3a8a;">${b.pickupTime}</div>
                    </div>
                  </div>

                  <div class="deal-card-bottom">
                    <span class="deal-status-pill">${this.sellingState.selectedBuyerId === b.id ? '✓ यह खरीदार चुना गया' : 'टैप करके चुनें'}</span>
                    <span class="deal-escrow-amount">एस्क्रो जमा: ₹ ${b.escrowDeposit.toLocaleString()}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="stage-footer">
              <button class="btn btn-secondary" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(2)">
                ← ${isHi ? 'मंडी तुलना देखें' : 'Back to AI Benchmark'}
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(4)">
                <span>🚚</span>
                <span>${isHi ? 'सौदा पक्का करें व गाड़ी चुनें 👉' : 'Lock Deal & Choose Transport 👉'}</span>
              </button>
            </div>
          </div>
        `;
      } else if (step === 4) {
        const trans = ai.transporterParity || {};

        return `
          <!-- STAGE 4: FARMGATE LOGISTICS & TRANSPORT DISPATCH (LOGISTICS PARITY) -->
          <div class="sell-stage-card">
            <div class="stage-card-header">
              <div class="stage-badge">चरण ४ / ५ • LOGISTICS PARITY</div>
              <h2 class="stage-title">${isHi ? 'खेत से गाड़ी व पारदर्शी लॉजिस्टिक्स' : 'Step 4: Farmgate On-Demand Logistics & Transporter Parity'}</h2>
              <p class="stage-desc">${isHi ? 'सौदा पक्का हो गया है! अब खेत पर पिकअप के लिए उपलब्ध वाहन चुनें। ट्रांसपोर्टर को भी सुरक्षित और उचित भाड़ा मिलता है।' : 'Contract terms locked! Local drivers earn guaranteed freight, matched backhaul cargo, and instant bank DBT.'}</p>
            </div>

            <!-- Logistics Parity Highlights Banner -->
            <div class="logistics-fairness-banner">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.8rem;">🚚</span>
                <div>
                  <strong style="font-size: 0.95rem; color: #0284c7;">${isHi ? 'ट्रांसपोर्टर समानता: किसान और ड्राइवर दोनों के लिए सर्वोत्तम' : 'Best for Transporters & Rural Drivers Like Farmers'}</strong>
                  <div style="font-size: 0.78rem; color: #64748b;">${isHi ? 'गारंटीड भाड़ा ₹4.50/kg • वापसी में खाद व क्रेट्स का रिटर्न कार्गो (+₹750) • 2 घंटे में DBT भुगतान' : 'Guaranteed ₹4.50/kg freight • Matched return cargo (+₹750) • Zero empty deadhead miles • 2-hour DBT settlement.'}</div>
                </div>
              </div>
              <span class="badge badge-success">✓ Zero Middlemen Extortion</span>
            </div>

            <!-- Transport Selection Tray -->
            <div class="vehicle-selection-grid">
              <!-- Vehicle 1: E-Loader -->
              <div class="vehicle-card ${this.sellingState.selectedVehicle === 'E_LOADER' ? 'selected' : ''}" onclick="window.FF_FARMER_WORKFLOW.selectVehicle('E_LOADER')">
                <div class="vehicle-icon-header">⚡ 🚚</div>
                <div class="vehicle-title">महिंद्रा जोरावर ई-लोडर (Mahindra EV Loader)</div>
                <div class="vehicle-sub">वाहन नंबर: KA-03-D-9912 • ड्राइवर: किरण कुमार (4.9★)</div>
                <div class="vehicle-perks">
                  <div>⚡ <strong>15 मिनट में खेत पर</strong> (15 min farmgate arrival)</div>
                  <div>🔋 100% शून्य उत्सर्जन इलेक्ट्रिक वाहन (डीजल खर्च ₹0)</div>
                  <div>📦 क्षमता: 750 kg तक की क्रेट्स</div>
                  <div>💰 ड्राइवर भाड़ा: <strong>₹ ${(Math.round(ai.quantityKg * 4.50)).toLocaleString()}</strong> (खरीदार एस्क्रो द्वारा देय)</div>
                  <div style="color: #0284c7; font-weight: 700;">🔄 वापसी कार्गो: 40 बैग जैविक खाद (+₹750)</div>
                </div>
                <div class="vehicle-select-badge">${this.sellingState.selectedVehicle === 'E_LOADER' ? '✓ चुना गया (Recommended)' : 'चुनने के लिए टैप करें'}</div>
              </div>

              <!-- Vehicle 2: Solar Reefer Van -->
              <div class="vehicle-card ${this.sellingState.selectedVehicle === 'REEFER' ? 'selected' : ''}" onclick="window.FF_FARMER_WORKFLOW.selectVehicle('REEFER')">
                <div class="vehicle-icon-header">❄️ 🚛</div>
                <div class="vehicle-title">टाटा ऐस सोलर रीफर (Solar Chilled 4°C)</div>
                <div class="vehicle-sub">वाहन नंबर: KA-04-E-1029 • ड्राइवर: मंजूनाथ गौड़ा (4.8★)</div>
                <div class="vehicle-perks">
                  <div>❄️ <strong>सोलर चिल्ड तापमान 4-6°C</strong> (शून्य सड़ाव)</div>
                  <div>⏱️ 20 मिनट में खेत पर आगमन</div>
                  <div>📦 क्षमता: 1,500 kg तक</div>
                  <div>💰 ड्राइवर भाड़ा: <strong>₹ ${(Math.round(ai.quantityKg * 4.50)).toLocaleString()}</strong> (कवर्ड)</div>
                  <div style="color: #0284c7; font-weight: 700;">🔄 वापसी कार्गो: 50 खाली सुरक्षित क्रेट्स</div>
                </div>
                <div class="vehicle-select-badge">${this.sellingState.selectedVehicle === 'REEFER' ? '✓ चुना गया' : 'चुनने के लिए टैप करें'}</div>
              </div>

              <!-- Vehicle 3: Spoke Tractor Trolley -->
              <div class="vehicle-card ${this.sellingState.selectedVehicle === 'TRACTOR' ? 'selected' : ''}" onclick="window.FF_FARMER_WORKFLOW.selectVehicle('TRACTOR')">
                <div class="vehicle-icon-header">🚜</div>
                <div class="vehicle-title">विलेज स्पोक ट्रैक्टर ट्रॉली (Heavy Batch)</div>
                <div class="vehicle-sub">वाहन नंबर: KA-03-TR-881 • ड्राइवर: राजू नाईक (4.7★)</div>
                <div class="vehicle-perks">
                  <div>🚜 <strong>बड़े लॉट हेतु (Heavy Tonnage)</strong></div>
                  <div>⏱️ 30 मिनट में आगमन</div>
                  <div>📦 क्षमता: 4,000 kg तक</div>
                  <div>💰 ड्राइवर भाड़ा: <strong>₹ ${(Math.round(ai.quantityKg * 4.50)).toLocaleString()}</strong> (कवर्ड)</div>
                  <div style="color: #0284c7; font-weight: 700;">🔄 वापसी कार्गो: बीज व कृषि उपकरण</div>
                </div>
                <div class="vehicle-select-badge">${this.sellingState.selectedVehicle === 'TRACTOR' ? '✓ चुना गया' : 'चुनने के लिए टैप करें'}</div>
              </div>
            </div>

            <!-- Route & Live Dispatch Preview -->
            <div class="dispatch-summary-box">
              <div class="dispatch-row">
                <span>📍 पिकअप स्थान (Farmgate):</span>
                <strong>रमेश पटेल का खेत, वोक्कलेरी गाँव, कोलार</strong>
              </div>
              <div class="dispatch-row">
                <span>🏛️ गंतव्य विलेज स्पोक:</span>
                <strong>वोक्कलेरी ई-नाम विलेज स्पोक #04 (दूरी: 2.8 किमी)</strong>
              </div>
              <div class="dispatch-row">
                <span>⚖️ तुलाई व परीक्षण:</span>
                <strong>डिजिटल लोड-सेल कांटा (0 ग्राम चोरी) + ब्रिक्स मिठास जांच</strong>
              </div>
              <div class="dispatch-row">
                <span>🔄 रिटर्न कार्गो (Backhaul Load):</span>
                <strong style="color: #0284c7;">40 बैग जैविक खाद (शहर डिपो ➔ कोलार FPO स्पोक) • ड्राइवर को +₹750 अतिरिक्त आय</strong>
              </div>
            </div>

            <div class="stage-footer">
              <button class="btn btn-secondary" onclick="window.FF_FARMER_WORKFLOW.jumpToStep(3)">
                ← ${isHi ? 'खरीदार बदलें' : 'Back to Buyer'}
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.FF_FARMER_WORKFLOW.confirmAndDispatch()">
                <span>🚚</span>
                <span>${isHi ? 'गाड़ी भेजें व सौदा पक्का करें 👉' : 'Dispatch Vehicle & Execute Sale 👉'}</span>
              </button>
            </div>
          </div>
        `;
      } else if (step === 5) {
        const sale = this.sellingState.lastExecutedSale || {};
        const netRs = sale.netTotal || Math.round(ai.quantityKg * ai.fairFarmgateRate);
        const utr = sale.utr || 'SBIN90214892';

        return `
          <!-- STAGE 5: SUCCESSFUL SPOKE INTAKE & AADHAAR DBT RECEIPT -->
          <div class="sell-stage-card success-card">
            <div class="success-header">
              <div class="success-tick-icon">✓</div>
              <h2 class="stage-title text-success">${isHi ? 'बधाई हो! सौदा सफल व DBT स्वीकृत' : 'Deal Confirmed & Bank DBT Processed!'}</h2>
              <p class="stage-desc">
                ${isHi ?
            `गाड़ी खेत पर रवाना हो चुकी है। स्पोक तुलाई पर्ची कटते ही ₹ ${netRs.toLocaleString()} आपके भारतीय स्टेट बैंक खाते में DBT द्वारा जमा हो जाएंगे।` :
            `Transport vehicle en-route to farmgate. ₹ ${netRs.toLocaleString()} direct bank DBT generated.`}
              </p>
            </div>

            <!-- Digital Transaction Receipt Slip -->
            <div class="dbt-receipt-slip">
              <div class="slip-header">
                <div>
                  <div class="slip-title">🏛️ भारत सरकार e-NAM विलेज स्पोक रसीद</div>
                  <div class="slip-sub">डिजिटल तौल पर्ची व बैंक DBT क्रेडिट मेमो</div>
                </div>
                <span class="kyc-status-pill kyc-verified">✓ 100% Escrow Cleared</span>
              </div>

              <div class="slip-grid">
                <div class="slip-item">
                  <div class="slip-label">किसान का नाम</div>
                  <div class="slip-val">रमेश पटेल (Ramesh Patel)</div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">आधार टोकन (DPDP 2023)</div>
                  <div class="slip-val"><code>aadhaar_tok_9841</code></div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">फसल व किस्म</div>
                  <div class="slip-val">${ai.meta.name} (Grade A+ Certified)</div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">सत्यापित वजन</div>
                  <div class="slip-val">${ai.quantityKg} kg (IoT Load-Cell)</div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">तयशुदा सीधा भाव</div>
                  <div class="slip-val text-success">₹ ${ai.fairFarmgateRate.toFixed(2)} / kg</div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">पारंपरिक मंडी में मिलता</div>
                  <div class="slip-val text-danger" style="text-decoration: line-through;">₹ ${ai.mandiTotalTakeHome.toLocaleString()}</div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">खरीदार संस्थान</div>
                  <div class="slip-val">FreshMart Hypermarket Pvt. Ltd.</div>
                </div>
                <div class="slip-item">
                  <div class="slip-label">वाहन व ड्राइवर</div>
                  <div class="slip-val">KA-03-D-9912 (ड्राइवर किरण)</div>
                </div>
              </div>

              <div class="slip-total-banner">
                <div>
                  <div style="font-size: 0.85rem; color: #166534;">सीधा बैंक खाता जमा (Aadhaar DBT):</div>
                  <div style="font-size: 1.6rem; font-weight: 800; color: #14532d;">₹ ${netRs.toLocaleString()}.00</div>
                  <div style="font-size: 0.76rem; color: #15803d;">SBI खाता संख्या: •••• •••• 8842 (IFSC: SBIN0004120)</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.78rem; color: #64748b;">बैंक UTR संदर्भ संख्या:</div>
                  <code style="font-size: 0.95rem; font-weight: 700; color: #1e3a8a;">${utr}</code>
                  <div style="margin-top: 4px;"><span class="badge badge-success">✓ Zero Theft Verified</span></div>
                </div>
              </div>
            </div>

            <!-- Dynamic Cross-Portal Linkage Note -->
            <div class="cross-link-notice">
              <span class="notice-icon">🔗</span>
              <div class="notice-text">
                <strong>प्लेटफॉर्म सिंक्रोनाइज़ेशन पूर्ण:</strong> यह फसल लॉट अब <strong>थोक खरीदार पोर्टल (B2B Wholesale)</strong> और <strong>कंज्यूमर स्टोर (Farm-Fresh Direct Store)</strong> में लाइव दिखाई दे रहा है। लॉजिस्टिक्स पोर्टल में खेत पर पिकअप का ऑर्डर असाइन हो गया है!
              </div>
            </div>

            <div class="stage-footer" style="justify-content: center; gap: 16px;">
              <button class="btn btn-secondary btn-lg" onclick="window.FF_AUTH.handleSubnavClick('DBT')">
                💰 ${isHi ? 'पासबुक में देखें' : 'View in DBT Passbook'}
              </button>
              <button class="btn btn-primary btn-lg" onclick="window.FF_FARMER_WORKFLOW.resetSellFlow(); window.FF_AUTH.handleSubnavClick('PRIMARY');">
                🌾 ${isHi ? 'किसान मुख्य पृष्ठ पर लौटें' : 'Return to Farmer Workbench'}
              </button>
            </div>
          </div>
        `;
      }
    },

    // Step navigation actions
    jumpToStep(stepNum) {
      this.sellingState.currentStep = stepNum;
      if (window.FF_APP) window.FF_APP.renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    proceedToAIPrice() {
      const crop = document.getElementById('sell-input-crop')?.value || this.sellingState.crop;
      const qty = Number(document.getElementById('sell-input-qty')?.value) || this.sellingState.qtyKg;
      const variety = document.getElementById('sell-input-variety')?.value || this.sellingState.variety;
      const date = document.getElementById('sell-input-date')?.value || this.sellingState.harvestDate;

      this.sellingState.crop = crop;
      this.sellingState.qtyKg = qty;
      this.sellingState.variety = variety;
      this.sellingState.harvestDate = date;

      this.sellingState.aiPrediction = window.FF_BRIDGE.calculateAIPrice(crop, qty, variety);
      this.jumpToStep(2);

      if (window.FF_APP) {
        window.FF_APP.showToast('🤖 AI Price & Mandi Comparison Engine calculated live rates!', 'success');
      }
    },

    selectBuyer(buyerId) {
      this.sellingState.selectedBuyerId = buyerId;
      if (window.FF_APP) window.FF_APP.renderCurrentView();
    },

    selectVehicle(vehKey) {
      this.sellingState.selectedVehicle = vehKey;
      if (window.FF_APP) window.FF_APP.renderCurrentView();
    },

    setQuickVolume(vol) {
      this.sellingState.qtyKg = vol;
      const el = document.getElementById('sell-input-qty');
      if (el) el.value = vol;
    },

    updateVolume(val) {
      this.sellingState.qtyKg = Math.max(10, Number(val) || 100);
    },

    updateCropSelection(crop) {
      this.sellingState.crop = crop;
      this.sellingState.aiPrediction = null;
    },

    confirmAndDispatch() {
      // 1. Create produce listing in shared registry
      const newLot = window.FF_BRIDGE.createFarmerListing({
        crop: this.sellingState.crop,
        variety: this.sellingState.variety,
        qtyKg: this.sellingState.qtyKg,
        harvestDate: this.sellingState.harvestDate
      });

      // 2. Execute sale & transport dispatch
      const saleResult = window.FF_BRIDGE.executeSaleWithTransport(
        newLot.id,
        this.sellingState.selectedBuyerId,
        this.sellingState.selectedVehicle,
        this.sellingState.qtyKg
      );

      this.sellingState.lastExecutedSale = saleResult;
      this.jumpToStep(5);

      if (window.FF_APP) {
        window.FF_APP.showToast('🎉 Forward contract locked! EV Loader dispatched to your farmgate.', 'success');
      }
    },

    resetSellFlow() {
      this.sellingState = {
        currentStep: 1,
        crop: 'tomato',
        variety: 'Sivam Hybrid (Grade A+)',
        qtyKg: 650,
        harvestDate: new Date().toISOString().split('T')[0],
        spokeVillage: 'Vokkaleri e-NAM Sub-Spoke (2.8 km)',
        selectedBuyerId: 'BUYER-01',
        selectedVehicle: 'E_LOADER',
        aiPrediction: null,
        lastExecutedSale: null
      };
      if (window.FF_APP) window.FF_APP.renderCurrentView();
    },

    // ========================================================================
    // 3. TRANSPORT: DEDICATED FARMGATE LOGISTICS & VEHICLE TRACKER
    // ========================================================================
    renderTransportBooking(container) {
      const isHi = window.FF_I18N.currentLang === 'hi';
      const activeRoutes = (window.FF_DATA && window.FF_DATA.activeFleetRoutes) || [];
      const primaryRoute = activeRoutes[0] || {
        vehicleId: 'KA-03-D-9912',
        type: 'Mahindra Zor Grand EV Loader',
        driver: 'Kiran Kumar',
        currentTempC: 6.2,
        batteryPct: 88,
        status: 'EN_ROUTE_FARMGATE'
      };

      container.innerHTML = `
        <div class="store-hero-banner" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0284c7 100%); margin-bottom: 24px;">
          <div class="store-hero-tag">
            <span>🚚</span>
            <span>${isHi ? 'खेत के दरवाजे पर वाहन सुविधा' : 'On-Demand Farmgate EV & Reefer Logistics'}</span>
          </div>
          <h1 class="store-hero-title">${isHi ? 'खेत से विलेज स्पोक तक सुरक्षित परिवहन' : 'Direct Farmgate Pickup & Cold-Chain Fleet'}</h1>
          <p class="store-hero-desc">
            ${isHi ?
          'पारंपरिक मंडियों के महंगे ट्रैक्टर भाड़े (₹350/क्विंटल) से मुक्ति। 15 मिनट में आपके खेत पर इलेक्ट्रिक लोडर या सोलर चिल्ड गाड़ी उपलब्ध।' :
          'Eliminate ₹350/quintal tractor line-haul extortion. 15-minute farmgate EV dispatch with zero in-transit damage.'}
          </p>
        </div>

        <!-- Live Vehicle In-Transit Telematics Card -->
        <div class="ff-card" style="margin-bottom: 24px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>⚡</span>
                <span>${isHi ? 'सक्रिय वाहन स्थिति (Live Vehicle Telematics)' : 'Live Farmgate Vehicle Telematics'}</span>
              </div>
              <div class="ff-card-subtitle">
                वाहन: <strong>${primaryRoute.vehicleId}</strong> (${primaryRoute.type}) • ड्राइवर: <strong>${primaryRoute.driver}</strong>
              </div>
            </div>
            <span class="badge badge-success">● LIVE GPS & IOT LINK</span>
          </div>

          <div class="grid-3" style="margin-bottom: 20px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">⚡</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">${primaryRoute.batteryPct || 88}%</div>
                <div class="farmer-stat-label">EV Battery State of Charge</div>
                <div class="farmer-stat-tag">Range: 72 km remaining</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">❄️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">${primaryRoute.currentTempC || 6.2}°C</div>
                <div class="farmer-stat-label">Solar Cold Chamber Temp</div>
                <div class="farmer-stat-tag">Target: 4.0 - 8.0°C (Stable)</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">⏱️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">12 Mins</div>
                <div class="farmer-stat-label">ETA to Farmgate</div>
                <div class="farmer-stat-tag">Vokkaleri Approach Road</div>
              </div>
            </div>
          </div>

          <!-- Driver Action Bar -->
          <div class="dispatch-summary-box" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="font-weight: 700; color: #1e293b;">📞 ड्राइवर से सीधे संपर्क करें:</div>
              <div style="font-size: 0.85rem; color: #64748b;">किरण कुमार • +91 88612 99014 (भाषा: हिन्दी, कन्नड़)</div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-secondary" onclick="window.FF_APP.showToast('📞 Dialing Driver Kiran (+91 88612 99014)...', 'info')">
                📞 कॉल करें (Call Driver)
              </button>
              <button class="btn btn-primary" onclick="window.FF_LOGISTICS.showVehicleTelemetry('${primaryRoute.vehicleId}')">
                🗺️ लाइव रूट मैप देखें
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Transport Booking Form -->
        <div class="ff-card">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>➕</span>
                <span>${isHi ? 'नई गाड़ी की मांग दर्ज करें (On-Demand Booking)' : 'Book On-Demand Farmgate Loader'}</span>
              </div>
              <div class="ff-card-subtitle">${isHi ? 'यदि आपने अलग से तुलाई के लिए गाड़ी बुलानी हो:' : 'Schedule direct farmgate pickup for unlisted lots'}</div>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">${isHi ? 'वाहन का प्रकार चुनें:' : 'Select Vehicle:'}</label>
              <select class="form-control" id="custom-trans-veh">
                <option value="E_LOADER">⚡ महिंद्रा ई-लोडर (750 kg तक • 15 मिनट)</option>
                <option value="REEFER">❄️ टाटा ऐस सोलर चिल्ड रीफर (1,500 kg तक)</option>
                <option value="TRACTOR">🚜 विलेज स्पोक ई-ट्रैक्टर ट्रॉली (4 टन तक)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">${isHi ? 'अनुमानित क्रेट्स संख्या / वजन:' : 'Estimated Load:'}</label>
              <input type="text" class="form-control" value="25 क्रेट्स (625 kg)">
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">${isHi ? 'पिकअप समय:' : 'Pickup Slot:'}</label>
              <select class="form-control">
                <option>तुरंत (Immediate - Next Available in 15 mins)</option>
                <option>आज दोपहर 02:00 PM</option>
                <option>कल सुबह 06:30 AM (ताजा सुबह कटाई)</option>
              </select>
            </div>
          </div>

          <div style="text-align: right; margin-top: 16px;">
            <button class="btn btn-primary" onclick="window.FF_APP.showToast('🚚 On-Demand EV Loader booked! Driver Kiran assigned.', 'success')">
              🚚 गाड़ी बुक करें (Book Vehicle)
            </button>
          </div>
        </div>
      `;
    },

    // ========================================================================
    // 4. DBT: DEDICATED BANK DBT PASSBOOK & DIGITAL RECEIPTS LEDGER
    // ========================================================================
    renderBankDBT(container) {
      const isHi = window.FF_I18N.currentLang === 'hi';
      const farmer = window.FF_DATA.currentFarmer;
      const records = window.FF_BRIDGE ? window.FF_BRIDGE.dbtPassbookRecords : [];
      const totalDisbursed = records.reduce((sum, r) => sum + r.totalCreditedRs, 0);

      container.innerHTML = `
        <div class="store-hero-banner" style="background: linear-gradient(135deg, #14532d 0%, #15803d 50%, #047857 100%); margin-bottom: 24px;">
          <div class="store-hero-tag">
            <span>💰</span>
            <span>${isHi ? 'प्रत्यक्ष लाभ अंतरण (Aadhaar DBT Direct Passbook)' : 'Aadhaar-Linked Direct Bank Transfer Passbook'}</span>
          </div>
          <h1 class="store-hero-title">${isHi ? 'शून्य आढ़तिया कमीशन • 100% बैंक जमा' : 'Verified Digital DBT Bank Passbook'}</h1>
          <p class="store-hero-desc">
            ${isHi ?
          'मंडी की तरह 4-7 दिन का उधारी चक्कर खत्म। डिजिटल तौल पर्ची कटने के 2 घंटे के भीतर भारतीय स्टेट बैंक खाते में पूरी राशि जमा।' :
          'Zero payment credit delay. Direct DBT transfer within 2 hours of tamper-proof spoke weighbridge intake.'}
          </p>
        </div>

        <!-- Bank Account Verification Card -->
        <div class="farmer-stat-card" style="background: #ffffff; padding: 22px; margin-bottom: 24px; border: 1.5px solid #86efac;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; width: 100%;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <span style="font-size: 2.2rem;">🏦</span>
              <div>
                <div style="font-size: 1.15rem; font-weight: 800; color: #065f46;">
                  ${farmer.bankName} • खाता संख्या: ${farmer.accountMasked}
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 3px;">
                  IFSC: <strong>${farmer.ifsc}</strong> • लाभार्थी: <strong>${farmer.name}</strong> • आधार लिंकिंग: <strong>सत्यापित (Verhoeff Checksum OK)</strong>
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="kyc-status-pill kyc-verified">✓ 100% DBT ACTIVATED</span>
              <div style="font-size: 1.4rem; font-weight: 800; color: #166534; margin-top: 6px;">₹ ${(farmer.walletBalanceRs || 42350).toLocaleString()}</div>
              <div style="font-size: 0.75rem; color: #64748b;">उपलब्ध जमा बैलेंस</div>
            </div>
          </div>
        </div>

        <!-- Lifetime DBT Payouts Summary Metrics -->
        <div class="grid-3" style="margin-bottom: 24px;">
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-green">💰</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">₹ ${(totalDisbursed || 38075).toLocaleString()}</div>
              <div class="farmer-stat-label">${isHi ? 'कुल DBT क्रेडिट (इस माह)' : 'Monthly Disbursed DBT'}</div>
              <div class="farmer-stat-tag">Zero Arhatiya Commission</div>
            </div>
          </div>
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-sky">⚖️</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">${records.length} लॉट</div>
              <div class="farmer-stat-label">${isHi ? 'डिजिटल तौल पर्चियां' : 'Certified Scale Slips'}</div>
              <div class="farmer-stat-tag">0 ग्राम वजन हेराफेरी</div>
            </div>
          </div>
          <div class="farmer-stat-card">
            <div class="farmer-stat-icon stat-icon-amber">⚡</div>
            <div class="farmer-stat-info">
              <div class="farmer-stat-val">1.8 घंटे</div>
              <div class="farmer-stat-label">${isHi ? 'औसत भुगतान समय' : 'Avg. Settlement Time'}</div>
              <div class="farmer-stat-tag">Govt. Target: < 2 Hours</div>
            </div>
          </div>
        </div>

        <!-- Ledger Table of Direct Benefit Transfers -->
        <div class="ff-card">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>📑</span>
                <span>${isHi ? 'बैंक अंतरण लेजर व तौल रसीदें' : 'DBT Transaction Ledger & Digital Weighbridge Receipts'}</span>
              </div>
              <div class="ff-card-subtitle">
                प्रत्येक लेनदेन का UTR नंबर और डिजिटल धर्मकांटा पर्ची उपलब्ध है।
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.print()">
              🖨️ ${isHi ? 'पासबुक प्रिंट करें' : 'Print Statement'}
            </button>
          </div>

          <div class="orders-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>दिनांक व समय</th>
                  <th>फसल विवरण</th>
                  <th>वजन व मिठास</th>
                  <th>भाव / kg</th>
                  <th>खाता जमा राशि (DBT)</th>
                  <th>खरीदार व UTR</th>
                  <th>रसीद</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(rec => `
                  <tr>
                    <td style="font-size: 0.85rem; color: #64748b;">${rec.date}</td>
                    <td>
                      <div style="font-weight: 700; color: #1e293b;">${rec.crop}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">${rec.id}</div>
                    </td>
                    <td>
                      <div><strong>${rec.qtyKg} kg</strong></div>
                      <span class="badge badge-success" style="font-size: 0.72rem;">${rec.brixAssay}</span>
                    </td>
                    <td><strong style="color: #166534;">₹ ${rec.netRate.toFixed(2)}</strong></td>
                    <td><strong style="font-size: 1.05rem; color: #15803d;">₹ ${rec.totalCreditedRs.toLocaleString()}.00</strong></td>
                    <td>
                      <div style="font-weight: 600; font-size: 0.82rem; color: #1e293b;">${rec.buyer}</div>
                      <code style="font-size: 0.75rem; color: #1e3a8a;">UTR: ${rec.utr}</code>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.FF_APP.openWeighbridgeModal('Ramesh Patel', ${rec.qtyKg})">
                        🔍 रसीद देखें
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    // ========================================================================
    // 5. VOICE: DEDICATED KISAN VANI VOICE STUDIO
    // ========================================================================
    renderKisanVani(container) {
      const isHi = window.FF_I18N.currentLang === 'hi';
      const advisories = window.FF_DATA.kisanVoiceAdvisories[isHi ? 'hi' : 'en'] || window.FF_DATA.kisanVoiceAdvisories.hi;

      container.innerHTML = `
        <div class="store-hero-banner" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0369a1 100%); margin-bottom: 24px;">
          <div class="store-hero-tag">
            <span>🎙️</span>
            <span>${isHi ? 'किसान वाणी • आवाज में कृषि व मंडी समाचार' : 'Kisan Vani Audio Intelligence Studio'}</span>
          </div>
          <h1 class="store-hero-title">${isHi ? 'सुनिए आज का मंडी भाव और खेत की सलाह' : 'Multilingual Vernacular Audio Intelligence'}</h1>
          <p class="store-hero-desc">
            ${isHi ?
          'अनपढ़ या कम पढ़े-लिखे किसान भाइयों के लिए विशेष सुविधा: फोन छूने की जरूरत नहीं, बस पीला बटन दबाएं और साफ हिन्दी/कन्नड़ में अपनी भाषा में पूरी जानकारी सुनें।' :
          'Accessibility for rural smallholders: Natural speech audio narration for market prices, cold storage distress shield, and spray alerts.'}
          </p>
        </div>

        <!-- Big Voice Player Hero -->
        <div class="kisan-voice-hero" style="margin-bottom: 24px; padding: 28px;">
          <div class="kisan-voice-left">
            <div class="voice-mic-icon-wrap" style="width: 80px; height: 80px; font-size: 2.5rem;" onclick="window.FF_VOICE.playAdvisory()" title="Tap to Listen">
              🎙️
            </div>
            <div>
              <div class="kisan-voice-title" style="font-size: 1.4rem;">
                <span>🎙️ ${isHi ? 'आज का मुख्य समाचार बुलेटिन' : 'Today\'s Market Audio Bulletin'}</span>
                <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff;">14 Sept 2026</span>
              </div>
              <div class="kisan-voice-sub" style="font-size: 1rem; margin-top: 6px;">
                "${advisories.welcome}"
              </div>
            </div>
          </div>
          <div class="kisan-voice-actions">
            <button class="btn-kisan-listen-main" style="padding: 14px 24px; font-size: 1.05rem;" onclick="window.FF_VOICE.playAdvisory()">
              <span>🔊</span>
              <span>${isHi ? 'पूरा बुलेटिन सुनें (Play Audio)' : 'Play Audio Bulletin'}</span>
            </button>
            <button class="btn-kisan-stop" style="padding: 14px 20px;" onclick="window.FF_VOICE.stop()">
              <span>⏹️</span>
              <span>${isHi ? 'रोकें' : 'Stop'}</span>
            </button>
          </div>
        </div>

        <!-- Topic Wise Audio Clips -->
        <div class="ff-card">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>📻</span>
                <span>${isHi ? 'विषयवार ऑडियो क्लिप्स (Topic-Wise Clips)' : 'On-Demand Audio Advisory Topics'}</span>
              </div>
              <div class="ff-card-subtitle">${isHi ? 'जिस विषय पर जानकारी चाहिए, उसके सामने का स्पीकर बटन दबाएं:' : 'Select any topic to hear speech narration:'}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="voice-topic-card" onclick="window.FF_VOICE.narrateCard('sell')">
              <div class="topic-icon">🌾</div>
              <div class="topic-body">
                <div class="topic-title">१. फसल बिक्री प्रक्रिया (Selling Guide)</div>
                <div class="topic-desc">बिना आढ़तिया कमीशन सीधे 100% बैंक भाव कैसे प्राप्त करें।</div>
              </div>
              <button class="btn-listen-card">🔊 सुनें</button>
            </div>

            <div class="voice-topic-card" onclick="window.FF_VOICE.narrateCard('transport')">
              <div class="topic-icon">🚚</div>
              <div class="topic-body">
                <div class="topic-title">२. खेत से गाड़ी बुलाना (Transport Booking)</div>
                <div class="topic-desc">15 मिनट में ई-लोडर या सोलर रीफर गाड़ी खेत पर बुलाने की विधि।</div>
              </div>
              <button class="btn-listen-card">🔊 सुनें</button>
            </div>

            <div class="voice-topic-card" onclick="window.FF_VOICE.narrateCard('weighbridge')">
              <div class="topic-icon">⚖️</div>
              <div class="topic-body">
                <div class="topic-title">३. डिजिटल धर्मकांटा व तुलाई (Weighbridge Slip)</div>
                <div class="topic-desc">कंप्यूटर कांटा से 0 ग्राम चोरी और 2 घंटे में DBT का नियम।</div>
              </div>
              <button class="btn-listen-card">🔊 सुनें</button>
            </div>

            <div class="voice-topic-card" onclick="window.FF_VOICE.narrateCard('distress')">
              <div class="topic-icon">❄️</div>
              <div class="topic-body">
                <div class="topic-title">४. संकट बिक्री से बचाव (Distress Shield)</div>
                <div class="topic-desc">मंडी भाव गिरने पर सोलर कोल्ड रूम में फसल रखें व 70% अग्रिम पैसा पाएं।</div>
              </div>
              <button class="btn-listen-card">🔊 सुनें</button>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
