/**
 * FarmFlow Kisan - Net Farmer Realization & Mandi Benchmark Math Engine
 * Directly demonstrates why eliminating intermediaries increases farmer take-home payout by >100%
 */

(function () {
  'use strict';

  window.FF_MANDI = {
    selectedCropKey: 'tomato',
    quantityKg: 1500, // Standard smallholder harvest lot

    selectCrop(cropKey) {
      if (window.FF_DATA.mandiBenchmarks[cropKey]) {
        this.selectedCropKey = cropKey;
        this.renderComparator();
        return true;
      }
      return false;
    },

    setQuantity(qty) {
      this.quantityKg = Math.max(100, Math.min(10000, Number(qty) || 1500));
      this.renderComparator();
    },

    calculateBreakdown() {
      const benchmark = window.FF_DATA.mandiBenchmarks[this.selectedCropKey];
      if (!benchmark) return null;

      const qty = this.quantityKg;

      // Link to Master AI Pricing Engine
      const aiData = window.FF_BRIDGE ? window.FF_BRIDGE.calculateAIPrice(this.selectedCropKey, qty) : null;

      // 1. Traditional APMC Mandi Math
      const mandiHeadline = benchmark.mandiPrice;
      const mandiGross = mandiHeadline * qty;
      const arhtiyaCutPerKg = (mandiHeadline * benchmark.mandiDeductions.commissionPct) / 100;
      const hamaliPerKg = benchmark.mandiDeductions.cartageHamali;
      const weighCutPerKg = benchmark.mandiDeductions.weighmentDeduction;
      const wasteLossPerKg = (mandiHeadline * benchmark.mandiDeductions.transitWastePct) / 100;

      const totalMandiDeductionPerKg = arhtiyaCutPerKg + hamaliPerKg + weighCutPerKg + wasteLossPerKg;
      const mandiNetPerKg = Math.max(0, mandiHeadline - totalMandiDeductionPerKg);
      const mandiTotalNet = mandiNetPerKg * qty;

      // 2. FarmFlow Direct Buyer Math (from AI Pricing Engine)
      const ffNetPerKg = aiData ? aiData.fairFarmgateRate : 23.50;
      const ffTotalNet = Math.round(ffNetPerKg * qty);

      // Advantage Metrics
      const netGainPerKg = ffNetPerKg - mandiNetPerKg;
      const totalExtraEarnings = ffTotalNet - mandiTotalNet;
      const percentageGain = ((netGainPerKg / mandiNetPerKg) * 100).toFixed(1);

      return {
        benchmark,
        qty,
        aiData,
        mandi: {
          headline: mandiHeadline,
          gross: mandiGross,
          commission: arhtiyaCutPerKg,
          hamali: hamaliPerKg,
          weighCut: weighCutPerKg,
          spoilage: wasteLossPerKg,
          totalDeductions: totalMandiDeductionPerKg,
          netPerKg: mandiNetPerKg,
          totalNet: mandiTotalNet
        },
        farmFlow: {
          headline: aiData ? aiData.priceWaterfall.consumerPricePerKg : 32.00,
          gross: (aiData ? aiData.priceWaterfall.consumerPricePerKg : 32.00) * qty,
          logistics: aiData ? aiData.transporterParity.freightRatePerKg : 4.50,
          handling: 2.50,
          techFee: 1.50,
          netPerKg: ffNetPerKg,
          totalNet: ffTotalNet
        },
        advantage: {
          netGainPerKg,
          totalExtraEarnings,
          percentageGain
        }
      };
    },

    renderComparator() {
      const data = this.calculateBreakdown();
      const container = document.getElementById('mandi-comparator-content');
      if (!container || !data) return;

      const ai = data.aiData;
      const waterfall = ai ? ai.priceWaterfall : null;
      const trans = ai ? ai.transporterParity : null;
      const forecast = ai ? ai.forecast7Days : [];

      container.innerHTML = `
        <!-- Crop & Volume Control Bar -->
        <div style="background: var(--bg-app); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.8rem;">${data.benchmark.icon}</span>
            <div>
              <strong style="font-size: 1.15rem; color: var(--primary-900);">${data.benchmark.name}</strong>
              <div style="font-size: 0.82rem; color: var(--text-muted);">SIH PS-33 Intermediary Elimination Benchmark • ${data.qty.toLocaleString()} kg Harvest Batch</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; background: #ffffff; padding: 6px 14px; border-radius: var(--radius-pill); border: 1px solid var(--border-light);">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">Lot Size:</label>
            <input type="range" min="200" max="5000" step="100" value="${data.qty}" oninput="window.FF_MANDI.setQuantity(this.value)" style="cursor: pointer; width: 140px;">
            <span style="font-weight: 800; color: var(--primary-700); font-size: 0.95rem; font-family: 'JetBrains Mono', monospace;">${data.qty.toLocaleString()} kg</span>
          </div>
        </div>

        <!-- 1. Side-by-Side Comparative Cards -->
        <div class="comparison-columns">
          <!-- Traditional Mandi Column -->
          <div class="mandi-loss-card">
            <div class="mandi-loss-header">
              <div>
                <div class="mandi-name">Traditional APMC Mandi</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">5 Middlemen & Intermediary Layer</div>
              </div>
              <span class="mandi-tag">❌ 72.5% Value Lost</span>
            </div>

            <div class="breakdown-row">
              <span>Mandi Nominal Board Rate</span>
              <strong>₹ ${data.mandi.headline.toFixed(2)} / kg</strong>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Arhtiya Commission (${data.benchmark.mandiDeductions.commissionPct}%)</span>
              <span>- ₹ ${data.mandi.commission.toFixed(2)}</span>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Cartage & Unloading (Hamali)</span>
              <span>- ₹ ${data.mandi.hamali.toFixed(2)}</span>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Scale Weighment Cut (Informal Loss)</span>
              <span>- ₹ ${data.mandi.weighCut.toFixed(2)}</span>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Open-Air Transit Spoilage (${data.benchmark.mandiDeductions.transitWastePct}%)</span>
              <span>- ₹ ${data.mandi.spoilage.toFixed(2)}</span>
            </div>

            <div class="breakdown-row final-take-home">
              <span>Actual Farmer Take-Home:</span>
              <span style="color: #c53030;">₹ ${data.mandi.netPerKg.toFixed(2)} / kg</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; text-align: right;">
              Net Handover on ${data.qty} kg: <strong>₹ ${Math.round(data.mandi.totalNet).toLocaleString()}</strong>
            </div>
          </div>

          <!-- FarmFlow Direct Column -->
          <div class="farmflow-gain-card">
            <div class="gain-badge">+ ${data.advantage.percentageGain}% Higher Earnings</div>
            <div class="farmflow-gain-header">
              <div>
                <div class="farmflow-name">FarmFlow Direct Realization</div>
                <div style="font-size: 0.78rem; color: var(--primary-700);">Direct to B2B Buyer & Consumer Clusters</div>
              </div>
              <span class="badge badge-success">✓ 100% Zero Middlemen</span>
            </div>

            <div class="breakdown-row">
              <span>Transparent Consumer Price</span>
              <strong>₹ ${data.farmFlow.headline.toFixed(2)} / kg</strong>
            </div>
            <div class="breakdown-row gain-item">
              <span>- Guaranteed Transporter Freight</span>
              <span>- ₹ ${data.farmFlow.logistics.toFixed(2)}</span>
            </div>
            <div class="breakdown-row gain-item">
              <span>- Spoke Weighbridge & Solar Cooling</span>
              <span>- ₹ ${data.farmFlow.handling.toFixed(2)}</span>
            </div>
            <div class="breakdown-row gain-item">
              <span>- Bank Escrow & Quality Platform</span>
              <span>- ₹ ${data.farmFlow.techFee.toFixed(2)}</span>
            </div>
            <div class="breakdown-row gain-item" style="color: #16a34a;">
              <span>+ Spoilage Prevention (Reefer Cold-Chain)</span>
              <span>< 1.5% Controlled</span>
            </div>

            <div class="breakdown-row final-gain">
              <span>Farmer Direct Bank Payout (DBT):</span>
              <span>₹ ${data.farmFlow.netPerKg.toFixed(2)} / kg</span>
            </div>
            <div style="font-size: 0.95rem; color: var(--primary-900); font-weight: 700; margin-top: 6px; text-align: right;">
              Total in Bank on ${data.qty} kg: <strong style="color: #16a34a; font-size: 1.25rem;">₹ ${Math.round(data.farmFlow.totalNet).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <!-- 2. Transparent 5-Tier Farm-to-Fork Price Composition Waterfall -->
        ${waterfall ? `
          <div class="clean-waterfall-card" style="margin-top: 24px; background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 22px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
              <div>
                <div style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">
                  📊 Transparent Farm-to-Fork Price Composition (PS-33 Rupee Balance)
                </div>
                <div style="font-size: 0.82rem; color: #64748b;">
                  Every rupee paid by the consumer is accounted for mathematically with zero hidden cuts.
                </div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-success" style="font-size: 0.82rem;">Consumer Pays ₹ ${waterfall.consumerPricePerKg.toFixed(2)} / kg (Saves ${waterfall.consumerSavingsPct}%)</span>
              </div>
            </div>

            <!-- Segmented Progress Bar -->
            <div style="display: flex; height: 28px; border-radius: 999px; overflow: hidden; margin-bottom: 18px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
              ${waterfall.breakdown.map(b => `
                <div style="width: ${b.pct}%; background: ${b.color}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; font-family: 'JetBrains Mono', monospace;" title="${b.label}: ₹${b.amount.toFixed(2)} (${b.pct}%)">
                  ${b.pct > 10 ? `${b.pct}%` : ''}
                </div>
              `).join('')}
            </div>

            <!-- Segment Cards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
              ${waterfall.breakdown.map(b => `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${b.color}; border-radius: var(--radius-md); padding: 12px 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1rem;">${b.icon}</span>
                    <span style="font-size: 0.78rem; font-weight: 700; color: ${b.color};">${b.pct}%</span>
                  </div>
                  <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 4px 0;">₹ ${b.amount.toFixed(2)} / kg</div>
                  <div style="font-size: 0.74rem; color: #64748b; line-height: 1.3;">${b.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. Logistics Parity Insight: "Best for Logistics like Farmer" -->
        ${trans ? `
          <div style="margin-top: 20px; background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: var(--radius-lg); padding: 20px 24px; color: #ffffff;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 2rem;">🚚</span>
                <div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: #38bdf8;">Logistics Parity: Best for Rural Transporters Too</div>
                  <div style="font-size: 0.8rem; color: #94a3b8;">Local vehicle drivers earn guaranteed rates, zero dead miles, and 2-hour bank DBT.</div>
                </div>
              </div>
              <span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4);">
                Guaranteed Freight: ₹ ${trans.freightRatePerKg.toFixed(2)} / kg
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              <div style="background: rgba(255,255,255,0.05); padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">Single-Leg Freight</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #4ade80;">₹ ${trans.freightTotalRs.toLocaleString()}</div>
                <div style="font-size: 0.7rem; color: #86efac;">For ${data.qty} kg load</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">Matched Return Cargo</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #38bdf8;">+ ₹ ${trans.backhaulEarningsRs}</div>
                <div style="font-size: 0.7rem; color: #93c5fd;">Zero empty deadhead return</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">EV Energy Savings</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #facc15;">Save ₹ ${trans.fuelSavingsRs}</div>
                <div style="font-size: 0.7rem; color: #fde047;">EV Loader vs Diesel tempo</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 12px 14px; border-radius: var(--radius-md);">
                <div style="font-size: 0.75rem; color: #94a3b8;">Net Driver Realization</div>
                <div style="font-size: 1.2rem; font-weight: 800; color: #38bdf8;">₹ ${trans.netTransporterTakeHomeRs.toLocaleString()}</div>
                <div style="font-size: 0.7rem; color: #94a3b8;">Settled via DBT in 2 hrs</div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 4. Extra Payout Banner & Call to Action -->
        <div style="margin-top: 20px; background: linear-gradient(135deg, #10754a, #1b8f56); color: #ffffff; border-radius: var(--radius-lg); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-size: 1.2rem; font-weight: 800;">💰 Direct Net Gain: + ₹ ${Math.round(data.advantage.totalExtraEarnings).toLocaleString()} Extra in Farmer's Bank!</div>
            <div style="font-size: 0.85rem; color: #dcfce7; margin-top: 2px;">By eliminating 5 intermediaries, you earn ₹ ${data.advantage.netGainPerKg.toFixed(2)} more per kg, credited instantly via DBT / UPI.</div>
          </div>
          <button class="btn btn-amber btn-lg" onclick="window.FF_APP.openSellModal('${data.benchmark.name}', ${data.farmFlow.netPerKg})">
            🌾 Lock Direct Forward Contract
          </button>
        </div>
      `;
    }

  };
})();
