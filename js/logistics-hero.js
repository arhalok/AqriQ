/**
 * FarmFlow Kisan - Hero Logistics & On-Demand Farmgate Transport Engine
 * 1. "Where Should I Sell?" Multi-Market Route & Net Margin Advisor
 * 2. On-Demand Farmgate Transport Booking (Porter/Blinkit for Agriculture)
 * 3. Transporter & Driver Partner Desk ("Anyone Can Drive & Earn")
 * 4. Ambient Heat & Delay Spoilage Laboratory Simulator
 * 5. Digital e-Way Bill & Goods Consignment Manifest Generator
 * 6. Live IoT Telemetry with Hourly Temperature Sparkline
 * Zero-dependency: Exposes window.FF_LOGISTICS on global namespace.
 */

(function () {
  'use strict';

  window.FF_LOGISTICS = {
    selectedCropKey: 'tomato',
    harvestQtyKg: 1000,
    selectedVehicleId: 'OPT_E_LOADER',
    isDriverOnline: true,
    ambientTempC: 38,
    transitDelayHours: 3.5,
    activeTab: 'CORRIDOR', // 'CORRIDOR' | 'BOOKING' | 'PARTNER' | 'SPOILAGE'

    crops: {
      tomato: { name: 'Tomato (टमाटर)', icon: '🍅' },
      onion: { name: 'Onion (प्याज)', icon: '🧅' },
      potato: { name: 'Potato (आलू)', icon: '🥔' },
      capsicum: { name: 'Capsicum (शिमला मिर्च)', icon: '🫑' }
    },

    setCrop(cropKey) {
      this.selectedCropKey = cropKey;
      this.renderAdvisor();
    },

    setQuantity(qty) {
      this.harvestQtyKg = Math.max(100, Math.min(10000, Number(qty) || 1000));
      this.renderAdvisor();
    },

    switchLogisticsTab(tabKey) {
      this.activeTab = tabKey;
      if (window.FF_APP) {
        const workspace = document.getElementById('main-workspace');
        if (workspace && window.FF_APP.activeRole === 'LOGISTICS') {
          window.FF_APP.renderLogisticsView(workspace);
        }
      }
    },

    // ========================================================================
    // 1. "WHERE SHOULD I SELL?" MULTI-MARKET ARBITRAGE ADVISOR
    // ========================================================================
    getDestinations() {
      const crop = this.selectedCropKey;
      const qty = this.harvestQtyKg;

      const rates = {
        tomato: { local: 18.00, city: 24.00, regional: 20.00, farmflow: 26.00 },
        onion: { local: 22.00, city: 28.00, regional: 24.00, farmflow: 32.00 },
        potato: { local: 17.00, city: 22.00, regional: 19.00, farmflow: 25.00 },
        capsicum: { local: 30.00, city: 38.00, regional: 33.00, farmflow: 42.00 }
      }[crop];

      return [
        {
          id: 'DEST_LOCAL_MANDI',
          name: 'Kolar APMC Mandi',
          distKm: '8 km away',
          isRecommended: false,
          isTrap: false,
          headlineRate: rates.local,
          transportCost: 1.20,
          commissionPct: 8.5,
          cartageHamali: 2.00,
          spoilagePct: 12.0,
          paymentTerms: '7-14 Days Credit',
          desc: 'Closest open-air yard, but statutory 8.5% Arhtiya fee and handling cuts consume your profit.'
        },
        {
          id: 'DEST_CITY_MANDI',
          name: 'Bengaluru Wholesale Yard',
          distKm: '58 km away',
          isRecommended: false,
          isTrap: true, // Deceptive headline rate!
          headlineRate: rates.city,
          transportCost: 5.50,
          commissionPct: 9.0,
          cartageHamali: 2.80,
          spoilagePct: 18.0,
          paymentTerms: '10-15 Days Credit',
          desc: '⚠️ DECEPTIVE TRAP! High ₹' + rates.city.toFixed(2) + ' headline rate is wiped out by ₹5.50 freight and 18% traffic rotting.'
        },
        {
          id: 'DEST_REGIONAL_MANDI',
          name: 'Chintamani Secondary APMC',
          distKm: '36 km away',
          isRecommended: false,
          isTrap: false,
          headlineRate: rates.regional,
          transportCost: 3.40,
          commissionPct: 8.0,
          cartageHamali: 2.00,
          spoilagePct: 14.0,
          paymentTerms: '5-7 Days Credit',
          desc: 'Moderate distance but volatile daily prices and informal weighing scales.'
        },
        {
          id: 'DEST_FARMFLOW_DIRECT',
          name: 'FarmFlow Kolar Solar Spoke',
          distKm: '4.2 km away',
          isRecommended: true,
          isTrap: false,
          headlineRate: rates.farmflow,
          transportCost: 1.40,
          commissionPct: 0.0, // ZERO middlemen!
          cartageHamali: 0.60,
          spoilagePct: 0.8,
          paymentTerms: '⚡ Instant Same-Day DBT',
          desc: '🌟 BEST NET REALIZATION! Zero middlemen cut, verified digital scale, and direct bank transfer.'
        }
      ].map(dest => {
        const commAmount = (dest.headlineRate * dest.commissionPct) / 100;
        const spoilAmount = (dest.headlineRate * dest.spoilagePct) / 100;
        const totalDeductions = dest.transportCost + commAmount + dest.cartageHamali + spoilAmount;
        const netPerKg = Math.max(0, dest.headlineRate - totalDeductions);
        const totalNet = netPerKg * qty;

        return {
          ...dest,
          commAmount,
          spoilAmount,
          totalDeductions,
          netPerKg,
          totalNet
        };
      });
    },

    renderAdvisor() {
      const container = document.getElementById('market-advisor-content');
      if (!container) return;

      const destinations = this.getDestinations();
      const currentCrop = this.crops[this.selectedCropKey];
      const rec = destinations.find(d => d.isRecommended);
      const trap = destinations.find(d => d.isTrap);

      container.innerHTML = `
        <div style="background: var(--bg-app); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 2rem;">${currentCrop.icon}</span>
            <div>
              <strong style="font-size: 1.15rem; color: var(--primary-900);">Selected: ${currentCrop.name}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Comparing transport tariffs, agent fees & transit spoilage from Vokkaleri Farm</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">Harvest Lot:</label>
            <input type="range" min="200" max="5000" step="100" value="${this.harvestQtyKg}" oninput="window.FF_LOGISTICS.setQuantity(this.value)" style="cursor: pointer; width: 140px;">
            <span style="font-weight: 800; color: var(--primary-700); font-size: 1.05rem;">${this.harvestQtyKg.toLocaleString()} kg</span>
          </div>
        </div>

        <!-- AI Recommendation Callout -->
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px 18px; margin-top: 14px; font-size: 0.88rem; color: #166534; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <strong>🤖 AI Logistics Recommendation:</strong> Sell to <strong>${rec.name}</strong>. Even though City Wholesale advertises ₹${trap.headlineRate.toFixed(2)}, high haulage and spoilage leave only <strong>₹${trap.netPerKg.toFixed(2)}/kg</strong> in your hand. FarmFlow delivers <strong>₹${rec.netPerKg.toFixed(2)}/kg</strong> (+₹${(rec.netPerKg - trap.netPerKg).toFixed(2)} extra take-home!).
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-sm btn-secondary" onclick="window.FF_LOGISTICS.readAdvisorAudio()">
              🔊 Audio
            </button>
            <button class="btn btn-sm btn-primary" onclick="window.FF_LOGISTICS.openBookingModal()">
              🚚 Book Farmgate Pickup
            </button>
          </div>
        </div>

        <!-- 4 Destination Cards Grid -->
        <div class="market-destination-grid">
          ${destinations.map(d => `
            <div class="market-card ${d.isRecommended ? 'recommended' : ''} ${d.isTrap ? 'trap' : ''}">
              ${d.isRecommended ? `<span class="market-badge-rec">🌟 #1 RECOMMENDED CHOICE</span>` : ''}
              ${d.isTrap ? `<span class="market-badge-trap">⚠️ HIGH PRICE TRAP</span>` : ''}

              <div class="market-card-head">
                <div class="market-name">${d.name}</div>
                <div class="market-dist">📍 ${d.distKm}</div>
              </div>

              <div class="market-headline-box">
                <div class="headline-val">₹ ${d.headlineRate.toFixed(2)} / kg</div>
                <div class="headline-lbl">Advertised Headline Price</div>
              </div>

              <div class="deductions-list">
                <div class="deduct-item ${d.transportCost > 3 ? 'loss' : ''}">
                  <span>Transport Freight:</span>
                  <span>- ₹ ${d.transportCost.toFixed(2)}</span>
                </div>
                <div class="deduct-item ${d.commissionPct > 0 ? 'loss' : 'gain'}">
                  <span>Agent Commission (${d.commissionPct}%):</span>
                  <span>${d.commissionPct === 0 ? '₹ 0.00 (Zero)' : `- ₹ ${d.commAmount.toFixed(2)}`}</span>
                </div>
                <div class="deduct-item">
                  <span>Cartage / Weighing:</span>
                  <span>- ₹ ${d.cartageHamali.toFixed(2)}</span>
                </div>
                <div class="deduct-item ${d.spoilagePct > 5 ? 'loss' : 'gain'}">
                  <span>Transit Spoilage (${d.spoilagePct}%):</span>
                  <span>- ₹ ${d.spoilAmount.toFixed(2)}</span>
                </div>
                <div class="deduct-item" style="border-top: 1px solid rgba(0,0,0,0.06); padding-top: 4px; font-weight: 700;">
                  <span>Total Deductions:</span>
                  <span style="color: #dc2626;">- ₹ ${d.totalDeductions.toFixed(2)}</span>
                </div>
              </div>

              <div class="market-takehome-box">
                <div class="takehome-lbl">Actual Farmer Take-Home:</div>
                <div class="takehome-val">₹ ${d.netPerKg.toFixed(2)} / kg</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                  Total for ${this.harvestQtyKg} kg: <strong>₹ ${Math.round(d.totalNet).toLocaleString()}</strong>
                </div>
              </div>

              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px; line-height: 1.3;">
                💳 ${d.paymentTerms}
              </div>

              <button class="btn-choose-dest ${d.isRecommended ? 'btn-choose-rec' : 'btn-choose-alt'}" onclick="window.FF_LOGISTICS.selectDestination('${d.name}', ${d.netPerKg})">
                ${d.isRecommended ? 'Select Recommended Spoke' : 'Compare Destination'}
              </button>
            </div>
          `).join('')}
        </div>
      `;
    },

    selectDestination(name, netRate) {
      if (window.FF_APP) {
        window.FF_APP.openSellModal(this.crops[this.selectedCropKey].name, netRate);
      }
    },

    readAdvisorAudio() {
      const destinations = this.getDestinations();
      const rec = destinations.find(d => d.isRecommended);
      const text = `Logistics Recommendation: Sell to ${rec.name}. By avoiding middleman commissions and city freight, your net take-home pay will be ${rec.netPerKg.toFixed(2)} rupees per kilogram, credited instantly to your bank account.`;
      if (window.FF_VOICE) window.FF_VOICE.speak(text);
    },

    // ========================================================================
    // 2. ON-DEMAND FARMGATE TRANSPORT BOOKING (PORTER / BLINKIT FOR AGRI)
    // ========================================================================
    selectVehicle(vehId) {
      this.selectedVehicleId = vehId;
      document.querySelectorAll('.vehicle-choice-card').forEach(card => {
        card.classList.toggle('selected', card.getAttribute('data-veh-id') === vehId);
      });
      this.updateFareEstimate();
    },

    updateFareEstimate() {
      const veh = window.FF_DATA.transportOptions.find(v => v.id === this.selectedVehicleId) || window.FF_DATA.transportOptions[0];
      const dist = 4.2; // km to Kolar Solar Spoke
      const estFare = veh.baseFareRs + Math.round(dist * veh.perKmRs);
      const fareEl = document.getElementById('booking-est-fare-display');
      if (fareEl) {
        fareEl.textContent = `₹ ${estFare} (Inclusive of GST & Tolls)`;
      }
    },

    openBookingModal() {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const opts = window.FF_DATA.transportOptions;
      const defaultVeh = opts[0];
      const estFare = defaultVeh.baseFareRs + Math.round(4.2 * defaultVeh.perKmRs);

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">🚚 On-Demand Farmgate Agricultural Transport Booking</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
            Book an agricultural vehicle directly to your field gate (like Porter/Blinkit for farm harvest). Fast pickup within 15-20 minutes.
          </p>

          <div class="grid-2" style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Pickup Farmgate Location:</label>
              <input type="text" class="form-control" value="Vokkaleri Village, Field No. 4 (Ramesh Patel)" readonly style="background: #f8fafc;">
            </div>
            <div class="form-group">
              <label class="form-label">Destination Spoke Hub:</label>
              <select class="form-control" id="booking-dest-select" onchange="window.FF_LOGISTICS.updateFareEstimate()">
                <option value="4.2">Kolar Solar Pre-cooling Spoke (4.2 km)</option>
                <option value="18.5">Hoskote Line-Haul Cross-Dock (18.5 km)</option>
                <option value="48.0">Bengaluru Peri-Urban Hub (48.0 km)</option>
              </select>
            </div>
          </div>

          <label class="form-label" style="font-weight: 700;">Choose Vehicle Type:</label>
          <div class="vehicle-select-grid" style="margin-top: 8px;">
            ${opts.map(v => `
              <div class="vehicle-choice-card ${v.id === this.selectedVehicleId ? 'selected' : ''}" data-veh-id="${v.id}" onclick="window.FF_LOGISTICS.selectVehicle('${v.id}')">
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
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px;">
                  <span class="driver-eta-pill">⚡ Driver ETA: ${v.etaMins} mins</span>
                  <strong style="color: var(--primary-900); font-size: 1.1rem;">₹ ${v.baseFareRs} + ₹${v.perKmRs}/km</strong>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.82rem; color: #166534;">Estimated Upfront Fare (Direct to Driver):</span>
              <div id="booking-est-fare-display" style="font-size: 1.25rem; font-weight: 800; color: #15803d;">₹ ${estFare} (Inclusive of GST & Tolls)</div>
            </div>
            <button class="btn btn-primary" onclick="window.FF_LOGISTICS.confirmTransportBooking()">
              ⚡ Confirm Pickup Now
            </button>
          </div>
        </div>
      `;

      window.FF_APP.openModal();
    },

    confirmTransportBooking() {
      const veh = window.FF_DATA.transportOptions.find(v => v.id === this.selectedVehicleId) || window.FF_DATA.transportOptions[0];
      window.FF_APP.closeModal();
      window.FF_APP.showToast(`🎉 Transport Confirmed! Driver ${veh.driverName} (${veh.name}) is en route to your field. ETA: ${veh.etaMins} mins.`, 'success');
      if (window.FF_VOICE) {
        window.FF_VOICE.speak(`Transport booked successfully. Driver ${veh.driverName} is arriving at your farmgate in ${veh.etaMins} minutes.`);
      }
    },

    // ========================================================================
    // 3. TRANSPORTER & DRIVER PARTNER LOAD BOARD ("ANYONE CAN DRIVE & EARN")
    // ========================================================================
    toggleDriverOnline() {
      this.isDriverOnline = !this.isDriverOnline;
      const statusText = document.getElementById('driver-partner-status-text');
      const toggleBtn = document.getElementById('btn-driver-status-toggle');
      if (statusText && toggleBtn) {
        if (this.isDriverOnline) {
          statusText.innerHTML = '🟢 <strong>You are Online</strong> • Receiving harvest pickup requests nearby';
          toggleBtn.textContent = 'Go Offline';
          toggleBtn.className = 'btn btn-sm btn-secondary';
        } else {
          statusText.innerHTML = '🔴 <strong>You are Offline</strong> • Not receiving new trip requests';
          toggleBtn.textContent = 'Go Online';
          toggleBtn.className = 'btn btn-sm btn-primary';
        }
      }
      window.FF_APP.showToast(this.isDriverOnline ? '🟢 You are now ONLINE to accept harvest trips!' : '🔴 You are now OFFLINE.', 'info');
    },

    acceptPartnerLoad(loadId) {
      const load = window.FF_DATA.partnerLoads.find(l => l.id === loadId);
      if (!load) return;

      load.status = 'ACCEPTED';
      window.FF_APP.showToast(`🎉 Trip Accepted! Navigate to ${load.pickupVillage}. Customer Contact: ${load.farmerName} (${load.phone}). Earn ₹${load.offerFareRs} upon spoke delivery!`, 'success');
      
      const btn = document.getElementById(`btn-accept-${loadId}`);
      if (btn) {
        btn.textContent = '✓ Trip Accepted (En Route)';
        btn.disabled = true;
        btn.className = 'btn btn-sm btn-secondary';
      }
    },

    // ========================================================================
    // 4. AMBIENT HEAT & DELAY TRANSIT SPOILAGE LABORATORY SIMULATOR
    // ========================================================================
    setAmbientTemp(temp) {
      this.ambientTempC = Number(temp);
      this.updateSpoilageMath();
    },

    setTransitDelay(hours) {
      this.transitDelayHours = Number(hours);
      this.updateSpoilageMath();
    },

    updateSpoilageMath() {
      const temp = this.ambientTempC;
      const delay = this.transitDelayHours;
      const qty = 2000; // 2,000 kg harvest lot
      const basePrice = 26.00;

      // Traditional open tempo: spoilage escalates rapidly with heat and traffic
      // Base open spoilage = 8% + (temp - 25)*0.8% + (delay - 1)*4%
      let openSpoilagePct = 8 + Math.max(0, (temp - 25) * 1.1) + Math.max(0, (delay - 1) * 4.5);
      openSpoilagePct = Math.min(45, Math.max(10, openSpoilagePct));

      const openLossKg = Math.round((qty * openSpoilagePct) / 100);
      const openLossRs = Math.round(openLossKg * basePrice);

      // FarmFlow multi-temp reefer: stable chilled temperature (+4°C to +8°C)
      // Spoilage stays virtually flat < 1.5% regardless of heat
      const farmflowSpoilagePct = 1.1;
      const farmflowLossKg = Math.round((qty * farmflowSpoilagePct) / 100);
      const farmflowLossRs = Math.round(farmflowLossKg * basePrice);

      const netSavedRs = openLossRs - farmflowLossRs;

      // Update DOM
      const openPctEl = document.getElementById('open-spoilage-pct');
      const openLossEl = document.getElementById('open-spoilage-loss');
      const reeferPctEl = document.getElementById('reefer-spoilage-pct');
      const reeferLossEl = document.getElementById('reefer-spoilage-loss');
      const savedRsEl = document.getElementById('spoilage-saved-rs');
      const tempValEl = document.getElementById('ambient-temp-val');
      const delayValEl = document.getElementById('transit-delay-val');

      if (openPctEl) openPctEl.textContent = `${openSpoilagePct.toFixed(1)}% Rotten / Lost`;
      if (openLossEl) openLossEl.textContent = `${openLossKg} kg (₹ ${openLossRs.toLocaleString()} Lost)`;
      if (reeferPctEl) reeferPctEl.textContent = `${farmflowSpoilagePct.toFixed(1)}% Spoilage`;
      if (reeferLossEl) reeferLossEl.textContent = `${farmflowLossKg} kg (Only ₹ ${farmflowLossRs.toLocaleString()})`;
      if (savedRsEl) savedRsEl.textContent = `₹ ${netSavedRs.toLocaleString()}`;
      if (tempValEl) tempValEl.textContent = `${temp}°C`;
      if (delayValEl) delayValEl.textContent = `${delay} Hours`;
    },

    // ========================================================================
    // 5. DIGITAL E-WAY BILL & MANIFEST MODAL
    // ========================================================================
    openEWayBillModal(plate) {
      const v = window.FF_DATA.fleet.find(item => item.plate === plate) || window.FF_DATA.fleet[0];
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">📄 Digital e-Way Bill & Cold-Chain Consignment Manifest</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="eway-bill-modal-box">
            <div class="eway-header">
              <div>
                <div class="eway-title">GOVT OF INDIA • E-WAY BILL SYSTEM</div>
                <div style="font-size: 0.75rem; color: #64748b;">Ministry of Agriculture & Farmers Welfare • Goods Consignment Note</div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-success">VALID IN TRANSIT</span>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">e-Way Bill No: 291048291042</div>
              </div>
            </div>

            <table class="eway-table">
              <tr>
                <td>Consignor (Source Spoke):</td>
                <td>GreenRoots Kisan Producer Co. Ltd. (Kolar Solar Spoke) • GSTIN: 29AABCG8812K1Z5</td>
              </tr>
              <tr>
                <td>Consignee (Destination):</td>
                <td>FreshMart Hypermarket (Bengaluru Peri-Urban Hub Gate 2)</td>
              </tr>
              <tr>
                <td>Vehicle Registration:</td>
                <td><strong>${v.plate}</strong> (${v.type})</td>
              </tr>
              <tr>
                <td>Driver Details:</td>
                <td>${v.driver}</td>
              </tr>
              <tr>
                <td>Cargo & Certified Weight:</td>
                <td><strong>${v.currentLoadKg} kg</strong> Native Tomato (Grade A+ Export)</td>
              </tr>
              <tr>
                <td>Cold-Chain Temperature SLA:</td>
                <td>Target: +4°C to +8°C • <strong style="color: #16a34a;">Current Sensor: 6.2°C (Compliant)</strong></td>
              </tr>
              <tr>
                <td>Corridor Route:</td>
                <td>NH-75 Express Corridor via Hoskote Cross-Dock (58 km)</td>
              </tr>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 14px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 2.2rem;">📱</div>
                <div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #0f172a;">DIGITALLY COUNTERSIGNED</div>
                  <div style="font-size: 0.72rem; color: #64748b;">RFID & IoT Geo-fence Certified</div>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Manifest</button>
            </div>
          </div>
        </div>
      `;

      window.FF_APP.openModal();
    },

    // ========================================================================
    // 6. LIVE VEHICLE TELEMETRY MODAL WITH TEMPERATURE SPARKLINE
    // ========================================================================
    showVehicleTelemetry(plate) {
      const v = window.FF_DATA.fleet.find(item => item.plate === plate) || window.FF_DATA.fleet[0];
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">📡 Live IoT Sensor Telemetry: Vehicle ${v.plate}</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: #0f172a; border-radius: var(--radius-lg); padding: 20px; color: #ffffff; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #38bdf8; font-family: 'JetBrains Mono', monospace;">${v.plate}</div>
                <div style="font-size: 0.82rem; color: #94a3b8;">${v.type} • Driver: ${v.driver}</div>
              </div>
              <span class="badge badge-success">GPS ACTIVE • ${v.speedKmH} KM/H</span>
            </div>

            <div style="grid-template-columns: repeat(3, 1fr); display: grid; gap: 14px; text-align: center;">
              <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">Chamber Temp</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #4ade80;">6.2°C</div>
                <div style="font-size: 0.7rem; color: #86efac;">Chill Zone Safe</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">Payload Weight</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #38bdf8;">${v.currentLoadKg} kg</div>
                <div style="font-size: 0.7rem; color: #93c5fd;">Rated: ${v.capacityKg} kg</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">Door Magnetic Seal</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #38bdf8;">LOCKED</div>
                <div style="font-size: 0.7rem; color: #4ade80;">Zero Cold Air Leak</div>
              </div>
            </div>

            <!-- Temperature Sparkline Chart -->
            <div style="margin-top: 18px; background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 8px;">
                <span>Hourly Chamber Temp Log (Last 5 Hours):</span>
                <span style="color: #4ade80;">Average: 6.1°C</span>
              </div>
              <svg viewBox="0 0 300 45" style="width: 100%; height: 45px;">
                <polyline fill="none" stroke="#38bdf8" stroke-width="2.5" points="10,25 70,22 130,26 190,20 250,23 290,21" />
                <circle cx="10" cy="25" r="4" fill="#4ade80" />
                <circle cx="70" cy="22" r="4" fill="#4ade80" />
                <circle cx="130" cy="26" r="4" fill="#4ade80" />
                <circle cx="190" cy="20" r="4" fill="#4ade80" />
                <circle cx="250" cy="23" r="4" fill="#4ade80" />
                <circle cx="290" cy="21" r="4" fill="#4ade80" />
                <text x="5" y="42" fill="#64748b" font-size="9">07:00</text>
                <text x="65" y="42" fill="#64748b" font-size="9">08:00</text>
                <text x="125" y="42" fill="#64748b" font-size="9">09:00</text>
                <text x="185" y="42" fill="#64748b" font-size="9">10:00</text>
                <text x="245" y="42" fill="#64748b" font-size="9">11:00</text>
              </svg>
            </div>

            <div style="margin-top: 16px; font-size: 0.8rem; color: #cbd5e1; font-family: 'JetBrains Mono', monospace; line-height: 1.6;">
              GPS Coordinates: Lat 13.1332° N, Long 77.8681° E (${v.location})<br>
              Destination: ${v.destination} • ETA: ${v.etaMins} mins
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="window.FF_LOGISTICS.openEWayBillModal('${v.plate}')">
              📄 View e-Way Bill
            </button>
            <button class="btn btn-danger" onclick="window.FF_CHAIN.triggerBreakdown(); window.FF_APP.closeModal();">
              🚨 Simulate Road Incident
            </button>
          </div>
        </div>
      `;

      window.FF_APP.openModal();
    },

    // ========================================================================
    // 7. DIGITAL WEIGHBRIDGE LOAD-CELL SIMULATOR
    // ========================================================================
    scaleWeight: 650.0,

    simulateScaleIntake() {
      const readout = document.getElementById('digital-scale-num');
      if (!readout) return;

      readout.textContent = '000.0 kg';
      let current = 0;
      const target = 650.0;

      const timer = setInterval(() => {
        current += 65.0;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          readout.textContent = `${current.toFixed(1)} kg`;
          if (window.FF_APP) {
            window.FF_APP.showToast('⚖️ Digital Load-Cell Certified: 650.0 kg Net Produce Verified! Brix Assay: 4.8° Grade A+', 'success');
          }
        } else {
          readout.textContent = `${current.toFixed(1)} kg`;
        }
      }, 40);
    },

    // ========================================================================
    // 8. AI-BASED ROUTE OPTIMIZATION & POOLED MULTI-STOP DISPATCH
    // ========================================================================
    renderRouteOptimizer() {
      const data = window.FF_DATA.aiRouteOptimization;
      if (!data) return '';
      const ineff = data.inefficientRoute;
      const opt = data.optimizedRoute;
      const sav = opt.savings;

      return `
        <div class="route-optimizer-panel">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; border-bottom: 1px solid var(--border-light); padding-bottom: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.5rem;">🗺️</span>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                  ${data.title}
                </h3>
                <span class="badge badge-success">✓ AI TSP Multi-Stop Algorithm</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; max-width: 780px;">
                ${data.overview}
              </p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" onclick="window.FF_APP.openDemandForecastModal('Tomato', 'Jaipur')">
                📊 View AI Demand Forecast
              </button>
            </div>
          </div>

          <!-- Top Executive Savings Summary Pill Banner -->
          <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0369a1 100%); color: #fff; border-radius: var(--radius-lg); padding: 18px 22px; margin: 18px 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #a7f3d0; font-weight: 700;">AI Optimization Impact (Jaipur-Ajmer-Delhi Agro Corridor)</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: #fef08a; margin-top: 2px;">
                ₹ ${sav.totalMoneySavedRs.toLocaleString()} Net Saved Per Dispatch Run
              </div>
            </div>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
              <div style="text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #6ee7b7;">-${sav.distanceSavedKm} km</div>
                <div style="font-size: 0.72rem; color: #d1fae5;">Distance (${sav.distanceSavedPct}% Less)</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #38bdf8;">-${sav.timeSavedHours} hrs</div>
                <div style="font-size: 0.72rem; color: #e0f2fe;">Transit Time (${sav.timeSavedPct}% Faster)</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #facc15;">-₹ ${sav.fuelCostSavedRs.toLocaleString()}</div>
                <div style="font-size: 0.72rem; color: #fef9c3;">Fuel Conserved</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.4rem; font-weight: 800; color: #4ade80;">1.2% Spoilage</div>
                <div style="font-size: 0.72rem; color: #dcfce7;">vs 14.5% Traditional</div>
              </div>
            </div>
          </div>

          <!-- Side by Side Route Comparison -->
          <div class="route-compare-columns">
            <!-- 1. Inefficient Traditional Route -->
            <div class="route-card inefficient">
              <div>
                <span class="route-header-tag">❌ Traditional Inefficient Route (Disorganized)</span>
                <div class="route-path-summary">${ineff.pathSummary}</div>
                <div style="font-size: 0.8rem; color: #7f1d1d; margin-bottom: 12px; background: #fee2e2; padding: 6px 10px; border-radius: var(--radius-sm);">
                  ⚠️ <strong>Problem:</strong> ${ineff.backtrackingPenalty}. Uncoordinated individual driver booking causes chaotic backtracking.
                </div>

                <div class="route-stops-timeline">
                  ${ineff.stops.map(s => `
                    <div class="route-stop-row">
                      <span class="route-stop-num">${s.seq}</span>
                      <div style="flex: 1;">
                        <div style="font-weight: 700; color: #7f1d1d;">${s.location}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${s.action} • <strong>${s.km} km</strong></div>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 700; color: #b91c1c;">${s.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="route-metrics-bar">
                <div class="route-metric-box">
                  <div class="route-metric-val" style="color: #dc2626;">${ineff.totalDistanceKm} km</div>
                  <div class="route-metric-lbl">Total Run</div>
                </div>
                <div class="route-metric-box">
                  <div class="route-metric-val" style="color: #dc2626;">${ineff.estimatedDurationHours} hrs</div>
                  <div class="route-metric-lbl">Transit Delay</div>
                </div>
                <div class="route-metric-box">
                  <div class="route-metric-val" style="color: #dc2626;">₹ ${ineff.fuelCostRs.toLocaleString()}</div>
                  <div class="route-metric-lbl">Fuel Expense</div>
                </div>
              </div>
            </div>

            <!-- 2. AI-Optimized Multi-Stop Route -->
            <div class="route-card optimized">
              <div>
                <span class="route-header-tag">✅ AI-Optimized Pooled Route (Zero Backtracking)</span>
                <div class="route-path-summary">${opt.pathSummary}</div>
                <div style="font-size: 0.8rem; color: #14532d; margin-bottom: 12px; background: #dcfce7; padding: 6px 10px; border-radius: var(--radius-sm);">
                  ✨ <strong>AI Intelligence:</strong> Consolidated 4,000 kg order. Mathematically ordered stops with zero reverse tracking and pre-cooled preservation.
                </div>

                <div class="route-stops-timeline">
                  ${opt.stops.map(s => `
                    <div class="route-stop-row">
                      <span class="route-stop-num">${s.seq}</span>
                      <div style="flex: 1;">
                        <div style="font-weight: 700; color: #14532d;">${s.location}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${s.action} • <strong>${s.km} km</strong></div>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 700; color: #166534;">${s.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="route-metrics-bar">
                <div class="route-metric-box">
                  <div class="route-metric-val" style="color: #15803d;">${opt.totalDistanceKm} km</div>
                  <div class="route-metric-lbl">Distance (-34%)</div>
                </div>
                <div class="route-metric-box">
                  <div class="route-metric-val" style="color: #15803d;">${opt.estimatedDurationHours} hrs</div>
                  <div class="route-metric-lbl">Duration (-42%)</div>
                </div>
                <div class="route-metric-box">
                  <div class="route-metric-val" style="color: #15803d;">₹ ${opt.fuelCostRs.toLocaleString()}</div>
                  <div class="route-metric-lbl">Fuel (-₹7,200)</div>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-primary" onclick="window.FF_APP.showToast('🚀 Dispatching Standby Reefer KA-04-E-4421 along AI-Optimized TSP Route!', 'success')">
              🚚 Dispatch Pooled Reefer on AI Route
            </button>
          </div>
        </div>
      `;
    }
  };
})();
