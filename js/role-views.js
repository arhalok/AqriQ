/**
 * FarmFlow Kisan - Role-Isolated Sub-Nav Views Engine
 * Implements dedicated sub-view switching for:
 * 1. Consumer (PRIMARY: Store, CART: Basket, ORDERS: Track & Quality)
 * 2. Buyer (PRIMARY: Wholesale Catalog, ESCROW: Bank Escrow, DOCK: Deliveries)
 * 3. Logistics (PRIMARY: Dispatches, TELEMATICS: Cold-Chain, EARNINGS: Driver DBT)
 * 4. FPO (PRIMARY: Operations, MEMBERS: Smallholders, MANDI_DEMANDS: Demands)
 * 5. Admin (PRIMARY: Control Tower, KYC_DESK: Compliance, SPOKES: Spokes Map)
 */

(function () {
  'use strict';

  window.FF_ROLE_VIEWS = {
    // ========================================================================
    // 1. CONSUMER SUB-VIEWS
    // ========================================================================
    renderConsumer(subTab, container) {
      const isHi = window.FF_I18N.currentLang === 'hi';

      if (subTab === 'ORDERS') {
        const orders = (window.FF_BRIDGE && window.FF_BRIDGE.ordersLedger) || [];
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #0f766e 0%, #115e59 50%, #0369a1 100%); margin-bottom: 24px;">
            <div class="store-hero-tag">
              <span>📦</span>
              <span>${isHi ? 'ऑर्डर ट्रैकिंग व गुणवत्ता प्रमाणपत्र' : 'Live Order Tracking & Certified Farm Provenance'}</span>
            </div>
            <h1 class="store-hero-title">${isHi ? 'खेत से आपकी रसोई तक का सफर' : 'Farm-to-Fork Batch Traceability & Orders'}</h1>
            <p class="store-hero-desc">
              ${isHi ?
            'प्रत्येक क्रेट पर विलेज स्पोक का डिजिटल क्यूआर कोड है, जिसमें कटाई का समय, गाड़ी का तापमान और किसान का नाम दर्ज है।' :
            'Track cold-chain GPS status, spoke Brix assay verification, and direct farmer payout confirmation.'}
            </p>
          </div>

          <!-- Active Consumer Deliveries -->
          <div class="ff-card" style="margin-bottom: 24px;">
            <div class="ff-card-header">
              <div>
                <div class="ff-card-title">
                  <span>🚚</span>
                  <span>${isHi ? 'सक्रिय डिलीवरी व कोल्ड-चेन स्थिति' : 'Active Produce Deliveries to Your Society Hub'}</span>
                </div>
                <div class="ff-card-subtitle">Hub: Whitefield Hub • Drop: Sobha Rose Apartment Club House</div>
              </div>
              <span class="badge badge-success">● IN COLD TRANSIT</span>
            </div>

            <div class="orders-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ऑर्डर आईडी / फसल</th>
                    <th>किसान व खेत स्थान</th>
                    <th>मात्रा / वजन</th>
                    <th>ताजा तापमान</th>
                    <th>डिलीवरी स्थिति</th>
                    <th>प्रमाणपत्र</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(ord => `
                    <tr>
                      <td>
                        <div style="font-weight: 700; color: #1e293b;">${ord.crop}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">${ord.orderId}</div>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: #1e293b;">👨‍🌾 ${ord.farmerName}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">📍 ${ord.pickupLocation}</div>
                      </td>
                      <td><strong>${ord.qtyKg} kg</strong></td>
                      <td>
                        <span class="badge badge-success" style="font-family: 'JetBrains Mono', monospace;">❄️ 6.2°C (Optimal)</span>
                      </td>
                      <td>
                        <span class="badge badge-primary">${ord.status}</span>
                        <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">वाहन: ${ord.vehicleAssigned}</div>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="window.FF_APP.openReceiptModal('${ord.farmerName}', ${ord.qtyKg})">
                          📱 QR प्रमाण
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Provenance QR Scanner -->
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
        return;
      }

      if (subTab === 'CART') {
        const cartItems = window.FF_STORE.cart || [];
        const products = window.FF_DATA.products || [];
        let total = 0;
        let farmerTotal = 0;

        const detailedItems = cartItems.map(item => {
          const prod = products.find(p => p.id === item.productId) || { name: 'Farm Produce', pricePerKg: 30, farmerPayout: 23.50, unit: 'kg' };
          const itemTotal = prod.pricePerKg * item.qty;
          const itemFarmer = (prod.farmerPayout || 20) * item.qty;
          total += itemTotal;
          farmerTotal += itemFarmer;
          return { ...item, prod, itemTotal, itemFarmer };
        });

        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #166534 0%, #15803d 50%, #047857 100%); margin-bottom: 24px;">
            <div class="store-hero-tag">
              <span>🧺</span>
              <span>${isHi ? 'आपकी ताजी खेत टोकरी' : 'Your Farm-Fresh Basket & Group-Buy Pool'}</span>
            </div>
            <h1 class="store-hero-title">${isHi ? 'सोसायटी सामूहिक खरीद • 15% अतिरिक्त बचत' : 'Direct Farm Basket Review'}</h1>
            <p class="store-hero-desc">
              ${isHi ?
            'सीधे किसान से घर तक। शून्य बिचौलिया कटौती। आपका 78% पैसा सीधे किसान के खाते में जाता है।' :
            'Zero middlemen markups. 78% of your spend is disbursed directly to smallholder farmer bank accounts.'}
            </p>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card" style="grid-column: span 2;">
              <div class="ff-card-header" style="padding: 0 0 16px 0;">
                <div class="ff-card-title"><span>🧺</span> <span>टोकरी में आइटम (${cartItems.length})</span></div>
                <button class="btn btn-secondary btn-sm" onclick="window.FF_AUTH.handleSubnavClick('PRIMARY')">+ और फल/सब्जी जोड़ें</button>
              </div>
              <div class="orders-table-wrapper">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>फसल विवरण</th>
                      <th>किसान व गाँव</th>
                      <th>मात्रा</th>
                      <th>भाव / kg</th>
                      <th>कुल</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${detailedItems.map(i => `
                      <tr>
                        <td>
                          <div style="font-weight: 700;">${i.prod.icon || '🌱'} ${i.prod.name}</div>
                          <div style="font-size: 0.75rem; color: #64748b;">${i.prod.grade || 'Grade A'}</div>
                        </td>
                        <td>
                          <div style="font-size: 0.85rem; font-weight: 600;">👨‍🌾 ${i.prod.farmerName}</div>
                          <div style="font-size: 0.75rem; color: #64748b;">${i.prod.farmerVillage}</div>
                        </td>
                        <td><strong>${i.qty} ${i.prod.unit}</strong></td>
                        <td>₹ ${i.prod.pricePerKg.toFixed(2)}</td>
                        <td><strong style="color: #166534;">₹ ${i.itemTotal.toFixed(2)}</strong></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Price Breakdown Summary -->
            <div class="farmer-stat-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 14px;">मूल्य पारदर्शिता विवरण</h3>
                <div class="dest-rates-box" style="margin-bottom: 16px;">
                  <div class="dest-metric-row">
                    <span>किसान को सीधा भुगतान:</span>
                    <strong style="color: #166534;">₹ ${farmerTotal.toFixed(2)} (78%)</strong>
                  </div>
                  <div class="dest-metric-row">
                    <span>कोल्ड-चेन ई-वाहन भाड़ा:</span>
                    <strong>₹ ${(total * 0.15).toFixed(2)} (15%)</strong>
                  </div>
                  <div class="dest-metric-row">
                    <span>विलेज स्पोक संचालन:</span>
                    <strong>₹ ${(total * 0.07).toFixed(2)} (7%)</strong>
                  </div>
                  <div class="dest-metric-row" style="font-weight: 800; font-size: 1.05rem; padding-top: 8px;">
                    <span>कुल राशि (Total):</span>
                    <strong style="color: #166534;">₹ ${total.toFixed(2)}</strong>
                  </div>
                </div>
                <div class="badge badge-success" style="width: 100%; text-align: center; padding: 8px; margin-bottom: 12px;">
                  🎉 सुपरमार्केट से ₹ ${(total * 0.35).toFixed(2)} की शुद्ध बचत!
                </div>
              </div>
              <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="window.FF_STORE.openCartDrawer()">
                🛍️ चेकआउट व भुगतान करें (Checkout)
              </button>
            </div>
          </div>
        `;
        return;
      }

      // Default: PRIMARY (Farm Fresh Store)
      window.FF_APP.renderConsumerStoreCatalog(container);
    },

    // ========================================================================
    // 2. BUYER SUB-VIEWS
    // ========================================================================
    renderBuyer(subTab, container) {
      const isHi = window.FF_I18N.currentLang === 'hi';
      const lots = (window.FF_BRIDGE && window.FF_BRIDGE.getAvailableLots()) || [];
      const demands = window.FF_DATA.buyerDemands || [];
      const totalEscrow = demands.reduce((sum, d) => sum + d.escrowDepositRs, 0);

      if (subTab === 'ESCROW') {
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%); margin-bottom: 24px;">
            <div class="store-hero-tag">
              <span>🔒</span>
              <span>100% Upfront Bank Escrow Clearing Console</span>
            </div>
            <h1 class="store-hero-title">Automated SBI Escrow Trust Framework</h1>
            <p class="store-hero-desc">
              All commercial forward contracts are 100% pre-funded in State Bank of India escrow. 
              Funds are automatically disbursed to smallholder accounts upon digital weighbridge assay sign-off.
            </p>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">🔒</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">₹ ${(totalEscrow || 57200).toLocaleString()}</div>
                <div class="farmer-stat-label">Active Locked Escrow</div>
                <div class="farmer-stat-tag">State Bank of India Escrow A/c</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">📊</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">0 Defaults</div>
                <div class="farmer-stat-label">Dispute / Payment Failure Rate</div>
                <div class="farmer-stat-tag">Zero Counterparty Risk</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">⚡</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">2 Hours</div>
                <div class="farmer-stat-label">Auto-Release Window</div>
                <div class="farmer-stat-tag">Triggered on Spoke Load-Cell</div>
              </div>
            </div>
          </div>

          <div class="ff-card">
            <div class="ff-card-header">
              <div class="ff-card-title"><span>📑</span> <span>Forward Contract Escrow Allocation Ledger</span></div>
              <button class="btn btn-primary btn-sm" onclick="window.FF_APP.showToast('💳 Funding Escrow Pool with ₹50,000 via Corporate Banking NetBanking...', 'info')">+ Top Up Escrow Pool</button>
            </div>
            <div class="orders-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Demand ID</th>
                    <th>Crop / Lot Target</th>
                    <th>Target Volume</th>
                    <th>Offered Rate</th>
                    <th>Escrow Locked</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${demands.map(d => `
                    <tr>
                      <td><code>${d.id}</code></td>
                      <td><strong>${d.crop}</strong></td>
                      <td>${d.volumeNeededKg.toLocaleString()} kg</td>
                      <td>₹ ${d.offeredRateGross.toFixed(2)} / kg</td>
                      <td><strong style="color: #0284c7;">₹ ${d.escrowDepositRs.toLocaleString()}</strong></td>
                      <td><span class="badge badge-success">${d.escrowStatus}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      }

      if (subTab === 'DOCK') {
        const orders = (window.FF_BRIDGE && window.FF_BRIDGE.ordersLedger) || [];
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%); margin-bottom: 24px;">
            <div class="store-hero-tag">
              <span>🚚</span>
              <span>Warehouse Receiving Dock & Telematics Intake</span>
            </div>
            <h1 class="store-hero-title">Incoming Dock Deliveries & Electronic GRN</h1>
            <p class="store-hero-desc">
              Inspect incoming refrigerated vehicles, gate passes, automated digital temperature stamps, and generate instant Goods Receipt Notes.
            </p>
          </div>

          <div class="ff-card">
            <div class="ff-card-header">
              <div class="ff-card-title"><span>🚚</span> <span>Scheduled Receiving Dock Deliveries</span></div>
              <span class="badge badge-primary">Dock Gate 3 Active</span>
            </div>
            <div class="orders-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Order No</th>
                    <th>Farmer & Origin Spoke</th>
                    <th>Produce Lot</th>
                    <th>Vehicle & Plate</th>
                    <th>Chamber Temp</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(ord => `
                    <tr>
                      <td><code>${ord.orderId}</code></td>
                      <td>
                        <div style="font-weight: 700;">👨‍🌾 ${ord.farmerName}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">${ord.pickupLocation}</div>
                      </td>
                      <td><strong>${ord.crop} (${ord.qtyKg} kg)</strong></td>
                      <td>${ord.vehicleAssigned}</td>
                      <td><span class="badge badge-success">❄️ 6.2°C (Optimal)</span></td>
                      <td><span class="badge badge-primary">${ord.status}</span></td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="window.FF_APP.showToast('📋 Electronic GRN signed. ₹${ord.totalGrossRs.toLocaleString()} released from Escrow to Farmer DBT.', 'success')">
                          ✓ Sign GRN & Accept
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      }

      // Default: PRIMARY (Wholesale Produce Catalog)
      container.innerHTML = `
        <div class="store-hero-banner" style="background: linear-gradient(135deg, #091e3a 0%, #0e305e 50%, #0284c7 100%); margin-bottom: 24px;">
          <div class="store-hero-tag">
            <span>🏬</span>
            <span>B2B Commercial Wholesale Sourcing Desk</span>
          </div>
          <h1 class="store-hero-title">Source Smallholder Batches with Zero Middlemen</h1>
          <p class="store-hero-desc">
            Direct institutional sourcing for Supermarkets, Hotels, and Processors. 100% verified NABL Brix quality assays and cold-chain dock delivery.
          </p>
        </div>

        <!-- SMALLHOLDER LOTS AVAILABLE DIRECTLY FROM FARMERS (LINKED DATA) -->
        <div class="ff-card" style="margin-bottom: 24px;">
          <div class="ff-card-header">
            <div>
              <div class="ff-card-title">
                <span>🌾</span>
                <span>Smallholder & FPO Produce Lots Ready for Sourcing</span>
              </div>
              <div class="ff-card-subtitle">
                These lots are listed directly by verified farmers and FPO aggregation spokes.
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.FF_APP.openPostDemandModal()">
              + Post New Procurement Demand
            </button>
          </div>

          <div class="orders-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Produce Lot</th>
                  <th>Farmer / Spoke Hub</th>
                  <th>Available Volume</th>
                  <th>Quality Assay</th>
                  <th>Wholesale Rate</th>
                  <th>Total Lot Value</th>
                  <th>Procure</th>
                </tr>
              </thead>
              <tbody>
                ${lots.map(lot => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; font-size: 0.95rem; color: #1e293b;">${lot.icon} ${lot.crop}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">${lot.variety} • Lot: <code>${lot.id}</code></div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: #0f172a;">👨‍🌾 ${lot.farmerName}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">📍 ${lot.farmerVillage}</div>
                    </td>
                    <td><strong style="font-size: 1rem;">${lot.availableQtyKg} kg</strong></td>
                    <td>
                      <span class="badge badge-success">${lot.brixSugar}</span>
                      <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">${lot.firmness}</div>
                    </td>
                    <td><strong style="color: #166534; font-size: 1.05rem;">₹ ${lot.wholesaleRatePerKg.toFixed(2)} / kg</strong></td>
                    <td><strong style="color: #0f172a;">₹ ${(Math.round(lot.availableQtyKg * lot.wholesaleRatePerKg)).toLocaleString()}</strong></td>
                    <td>
                      <button class="btn btn-primary btn-sm" onclick="window.FF_ROLE_VIEWS.buyLotAsBuyer('${lot.id}')">
                        🔒 Lock Lot (Escrow)
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Active Commercial Demands -->
        <div class="ff-card">
          <div class="ff-card-header">
            <div class="ff-card-title"><span>🛒</span> <span>Your Active Procurement Purchase Contracts</span></div>
          </div>
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
      `;
    },

    buyLotAsBuyer(lotId) {
      const lot = window.FF_BRIDGE.smallholderListings.find(l => l.id === lotId);
      if (!lot) return;

      const sale = window.FF_BRIDGE.executeSaleWithTransport(lotId, 'BUYER-01', 'E_LOADER', lot.availableQtyKg);
      if (window.FF_APP) {
        window.FF_APP.showToast(`🎉 Sourced ${lot.qtyKg} kg of ${lot.crop} from Farmer ${lot.farmerName}! ₹${sale.grossTotal.toLocaleString()} locked in SBI Escrow. Transport dispatched.`, 'success');
        window.FF_APP.renderCurrentView();
      }
    },

    // ========================================================================
    // 3. LOGISTICS SUB-VIEWS
    // ========================================================================
    renderLogistics(subTab, container) {
      if (subTab === 'TELEMATICS') {
        const primaryRoute = (window.FF_DATA.activeFleetRoutes && window.FF_DATA.activeFleetRoutes[0]) || {
          vehicleId: 'KA-03-D-9912', currentTempC: 6.2, batteryPct: 88, status: 'EN_ROUTE_FARMGATE'
        };
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #091a10 0%, #0f2e1c 50%, #0369a1 100%); margin-bottom: 24px;">
            <div class="store-hero-tag">
              <span>🌡️</span>
              <span>IoT Cold-Chain Telematics & Thermal Shield</span>
            </div>
            <h1 class="store-hero-title">Continuous Real-Time Thermal Log</h1>
            <p class="store-hero-desc">
              Every vehicle is equipped with dual BLE digital temperature sensors, door-open alert sensors, and GPS corridor velocity telemetry.
            </p>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">❄️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">${primaryRoute.currentTempC}°C</div>
                <div class="farmer-stat-label">Chamber Temperature</div>
                <div class="farmer-stat-tag">Target: 4.0 - 8.0°C (In Range)</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">🔋</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">${primaryRoute.batteryPct}%</div>
                <div class="farmer-stat-label">Vehicle Battery SoC</div>
                <div class="farmer-stat-tag">Solar Reefer Assist Active</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">🚪</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">0 Breaches</div>
                <div class="farmer-stat-label">Unauthorized Door Openings</div>
                <div class="farmer-stat-tag">Tamper-Proof Seal OK</div>
              </div>
            </div>
          </div>

          <div class="ff-card">
            <div class="ff-card-header">
              <div class="ff-card-title"><span>📡</span> <span>Live Sensor Telemetry Stream (KA-03-D-9912)</span></div>
              <span class="badge badge-success">● BLE 5.0 Synced</span>
            </div>
            <div class="dispatch-summary-box">
              <div class="dispatch-row"><span>Compressor Duty Cycle:</span> <strong>74% (Optimal Variable Speed Inverter)</strong></div>
              <div class="dispatch-row"><span>Refrigerant Pressure:</span> <strong>2.4 bar (R134a Eco-Compliant)</strong></div>
              <div class="dispatch-row"><span>Vibration / Impact Sensor:</span> <strong>0.12g (Smooth Pavement Transit)</strong></div>
              <div class="dispatch-row"><span>Last Heartbeat:</span> <strong>Just now (Cellular 4G IoT Gateway)</strong></div>
            </div>
          </div>
        `;
        return;
      }

      if (subTab === 'EARNINGS') {
        const routes = (window.FF_DATA.activeFleetRoutes) || [];
        const primaryRoute = routes[0] || {};
        const freightEarned = primaryRoute.freightEarnedRs || 2925;
        const backhaulBonus = primaryRoute.backhaulBonusRs || 750;

        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0284c7 100%); margin-bottom: 24px;">
            <div class="store-hero-tag">
              <span>💰</span>
              <span>Transporter Partner Parity & Direct DBT Ledger (SIH PS-33)</span>
            </div>
            <h1 class="store-hero-title">Guaranteed Carrier Freight & Backhaul Earnings</h1>
            <p class="store-hero-desc">
              No 30-day broker payment lag. Guaranteed ₹4.50/kg freight, automated return load matching (+₹750 per trip), and 2-hour Aadhaar DBT payout.
            </p>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">💰</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">₹ 18,520</div>
                <div class="farmer-stat-label">This Week's Net DBT Payout</div>
                <div class="farmer-stat-tag">Guaranteed ₹4.50/kg Freight Rate</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">🔄</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">+ ₹ 5,250</div>
                <div class="farmer-stat-label">Backhaul Return Trip Earnings</div>
                <div class="farmer-stat-tag">7 Matched Bio-Fertilizer Runs</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">⚡</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">₹ 3,850</div>
                <div class="farmer-stat-label">Mahindra EV Fuel Savings</div>
                <div class="farmer-stat-tag">Zero Diesel Waste vs Mandi Idle</div>
              </div>
            </div>
          </div>

          <!-- Driver Freight Ledger Table -->
          <div class="ff-card">
            <div class="ff-card-header">
              <div>
                <div class="ff-card-title">
                  <span>📑</span>
                  <span>Trip Ledger & Instant Bank DBT Settlements (Driver: Kiran Kumar)</span>
                </div>
                <div class="ff-card-subtitle">Vehicle: KA-03-D-9912 • Bank: Canara Bank (A/c •••• 4012) • IFSC: CNRB0001890</div>
              </div>
              <span class="badge badge-success">✓ 100% DBT Verified</span>
            </div>

            <div class="orders-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Trip ID / Date</th>
                    <th>Route (Farmgate ➔ Spoke)</th>
                    <th>Weight</th>
                    <th>Freight (₹4.50/kg)</th>
                    <th>Return Cargo (Backhaul)</th>
                    <th>Total Bank DBT</th>
                    <th>Cold Bonus</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #1e293b;">TRIP-2026-904</div>
                      <div style="font-size: 0.75rem; color: #64748b;">Today, 10:30 AM</div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: #1e293b;">Ramesh Patel Farm ➔ Vokkaleri Spoke</div>
                      <div style="font-size: 0.74rem; color: #64748b;">Tomato Grade A+ • 12 mins ETA</div>
                    </td>
                    <td><strong>650 kg</strong></td>
                    <td><strong style="color: #0284c7;">₹ 2,925.00</strong></td>
                    <td>
                      <span class="badge badge-primary">🔄 40 Bags Bio-Fertilizer (+₹750)</span>
                    </td>
                    <td><strong style="color: #16a34a; font-size: 1.05rem;">₹ 3,675.00</strong></td>
                    <td><span class="badge badge-success">✓ +5% Temp Safe</span></td>
                    <td><span class="badge badge-success">DBT CLEARED</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #1e293b;">TRIP-2026-892</div>
                      <div style="font-size: 0.75rem; color: #64748b;">14 Sept 2026</div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: #1e293b;">Suresh Gowda Farm ➔ Malur Hub</div>
                      <div style="font-size: 0.74rem; color: #64748b;">Red Onion • 18 km Roundtrip</div>
                    </td>
                    <td><strong>1,200 kg</strong></td>
                    <td><strong style="color: #0284c7;">₹ 5,400.00</strong></td>
                    <td>
                      <span class="badge badge-primary">🔄 50 Plastic Crates (+₹750)</span>
                    </td>
                    <td><strong style="color: #16a34a; font-size: 1.05rem;">₹ 6,150.00</strong></td>
                    <td><span class="badge badge-success">✓ +5% Temp Safe</span></td>
                    <td><span class="badge badge-success">DBT CLEARED</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #1e293b;">TRIP-2026-879</div>
                      <div style="font-size: 0.75rem; color: #64748b;">12 Sept 2026</div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: #1e293b;">Anita Devi Farm ➔ Vokkaleri Spoke</div>
                      <div style="font-size: 0.74rem; color: #64748b;">Green Capsicum • 8 km</div>
                    </td>
                    <td><strong>450 kg</strong></td>
                    <td><strong style="color: #0284c7;">₹ 2,025.00</strong></td>
                    <td>
                      <span class="badge badge-primary">🔄 Organic Compost (+₹750)</span>
                    </td>
                    <td><strong style="color: #16a34a; font-size: 1.05rem;">₹ 2,775.00</strong></td>
                    <td><span class="badge badge-success">✓ +5% Temp Safe</span></td>
                    <td><span class="badge badge-success">DBT CLEARED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      }

      // Default: PRIMARY (Dispatch & Routes)
      if (window.FF_LOGISTICS && typeof window.FF_LOGISTICS.renderMain === 'function') {
        window.FF_LOGISTICS.renderMain(container);
      }
    },

    // ========================================================================
    // 4. FPO SUB-VIEWS
    // ========================================================================
    renderFPO(subTab, container) {
      if (subTab === 'MEMBERS') {
        const farmers = window.FF_DATA.farmers || [];
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #14532d 0%, #15803d 50%, #0369a1 100%); margin-bottom: 24px;">
            <div class="store-hero-tag"><span>👥</span> <span>FPO Smallholder Member Ledger</span></div>
            <h1 class="store-hero-title">242 Smallholder Member Registry</h1>
            <p class="store-hero-desc">Manage member harvest quotas, NABL digital scale intake, and collective share capital disbursements.</p>
          </div>

          <div class="ff-card">
            <div class="ff-card-header">
              <div class="ff-card-title"><span>👥</span> <span>Member Smallholder Registry & Payouts</span></div>
              <button class="btn btn-primary btn-sm" onclick="window.FF_APP.showToast('📋 Syncing member quota with NABARD portal...', 'info')">+ Add New Member</button>
            </div>
            <div class="orders-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Farmer Name</th>
                    <th>Village</th>
                    <th>Crops Handled</th>
                    <th>Quota Allocated</th>
                    <th>Brix Assay</th>
                    <th>Total Disbursed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${farmers.map(f => `
                    <tr>
                      <td><strong>${f.name}</strong></td>
                      <td>${f.village}</td>
                      <td>${f.crop}</td>
                      <td>${f.allocatedQuotaKg} kg</td>
                      <td><span class="badge badge-success">${f.brixAssay}</span></td>
                      <td><strong style="color: #166534;">₹ ${f.totalDisbursedRs.toLocaleString()}</strong></td>
                      <td><span class="kyc-status-pill kyc-verified">✓ Verified</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      }

      if (subTab === 'MANDI_DEMANDS') {
        const demands = window.FF_DATA.buyerDemands || [];
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0284c7 100%); margin-bottom: 24px;">
            <div class="store-hero-tag"><span>📊</span> <span>District Mandi & Commercial Demands</span></div>
            <h1 class="store-hero-title">FPO Collective Procurement Demands</h1>
            <p class="store-hero-desc">Aggregated institutional purchase contracts available for member smallholder pooling.</p>
          </div>

          <div class="quota-cards-grid">
            ${demands.map(d => `
              <div class="quota-member-card">
                <div class="quota-member-head">
                  <span class="quota-member-name">${d.icon} ${d.buyerName}</span>
                  <span class="badge badge-success">Escrow Secured</span>
                </div>
                <div class="quota-val-row" style="margin-top: 10px;">
                  <span>Crop Target:</span> <strong>${d.crop}</strong>
                </div>
                <div class="quota-val-row">
                  <span>Volume Needed:</span> <strong>${d.volumeNeededKg.toLocaleString()} kg</strong>
                </div>
                <div class="quota-val-row">
                  <span>FPO Net Rate:</span> <strong style="color: #166534;">₹ ${d.offeredRateGross.toFixed(2)} / kg</strong>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        return;
      }

      // Default: PRIMARY (Operations)
      window.FF_APP.renderFPOViewContent(container);
    },

    // ========================================================================
    // 5. ADMIN SUB-VIEWS
    // ========================================================================
    renderAdmin(subTab, container) {
      if (subTab === 'KYC_DESK') {
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0369a1 100%); margin-bottom: 24px;">
            <div class="store-hero-tag"><span>🛡️</span> <span>Statutory KYC & DPDP Compliance Desk</span></div>
            <h1 class="store-hero-title">Asymmetric Risk Verification Center</h1>
            <p class="store-hero-desc">Review Verhoeff Aadhaar tokens, MCA registrations for FPOs, GSTIN check digits, and transport licenses.</p>
          </div>
          ${window.FF_APP.renderAdminKYCDesk()}
        `;
        return;
      }

      if (subTab === 'SPOKES') {
        const enam = window.FF_DATA.enamExtension || {};
        container.innerHTML = `
          <div class="store-hero-banner" style="background: linear-gradient(135deg, #091e3a 0%, #0e305e 50%, #047857 100%); margin-bottom: 24px;">
            <div class="store-hero-tag"><span>🗺️</span> <span>Village Spokes Network & e-NAM Extension</span></div>
            <h1 class="store-hero-title">Decentralized Village Cold-Hubs</h1>
            <p class="store-hero-desc">Ground execution layer operating within 3km of farms. IoT load-cells, Brix refractometers, and solar cold safe.</p>
          </div>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-green">🏛️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">14 Active Lots</div>
                <div class="farmer-stat-label">${enam.spokeName}</div>
                <div class="farmer-stat-tag">Distance: ${enam.distanceKm} km</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-sky">⚖️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">NABL Certified</div>
                <div class="farmer-stat-label">Assaying Accreditation</div>
                <div class="farmer-stat-tag">0g Load-Cell Calibration OK</div>
              </div>
            </div>
            <div class="farmer-stat-card">
              <div class="farmer-stat-icon stat-icon-amber">❄️</div>
              <div class="farmer-stat-info">
                <div class="farmer-stat-val">25 MT Capacity</div>
                <div class="farmer-stat-label">Solar Cold Room Safe</div>
                <div class="farmer-stat-tag">70% e-NWR Advance Linked</div>
              </div>
            </div>
          </div>
        `;
        return;
      }

      // Default: PRIMARY (Control Tower)
      window.FF_APP.renderAdminViewContent(container);
    }
  };
})();
