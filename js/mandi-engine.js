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

      // 2. FarmFlow Direct Buyer Math
      const ffHeadline = benchmark.farmFlowPrice;
      const ffGross = ffHeadline * qty;
      const ffLogisticsPerKg = benchmark.farmFlowDeductions.directLogistics;
      const ffHandlingPerKg = benchmark.farmFlowDeductions.handlingSpoke;
      const ffPlatformPerKg = benchmark.farmFlowDeductions.platformTechFee;

      const totalFFDeductionPerKg = ffLogisticsPerKg + ffHandlingPerKg + ffPlatformPerKg;
      const ffNetPerKg = ffHeadline - totalFFDeductionPerKg;
      const ffTotalNet = ffNetPerKg * qty;

      // Advantage Metrics
      const netGainPerKg = ffNetPerKg - mandiNetPerKg;
      const totalExtraEarnings = ffTotalNet - mandiTotalNet;
      const percentageGain = ((netGainPerKg / mandiNetPerKg) * 100).toFixed(1);

      return {
        benchmark,
        qty,
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
          headline: ffHeadline,
          gross: ffGross,
          logistics: ffLogisticsPerKg,
          handling: ffHandlingPerKg,
          techFee: ffPlatformPerKg,
          totalDeductions: totalFFDeductionPerKg,
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

      container.innerHTML = `
        <div style="background: var(--bg-app); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.5rem;">${data.benchmark.icon}</span>
            <div>
              <strong style="font-size: 1.1rem; color: var(--primary-900);">${data.benchmark.name}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Comparing current market rates for ${data.qty.toLocaleString()} kg harvest lot</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">Adjust Lot Size:</label>
            <input type="range" min="200" max="5000" step="100" value="${data.qty}" oninput="window.FF_MANDI.setQuantity(this.value)" style="cursor: pointer; width: 140px;">
            <span style="font-weight: 800; color: var(--primary-700); font-size: 0.95rem;">${data.qty.toLocaleString()} kg</span>
          </div>
        </div>

        <div class="comparison-columns">
          <!-- Traditional Mandi Column -->
          <div class="mandi-loss-card">
            <div class="mandi-loss-header">
              <div>
                <div class="mandi-name">Traditional APMC Mandi</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Middleman Intermediary System</div>
              </div>
              <span class="mandi-tag">5 Intermediaries</span>
            </div>

            <div class="breakdown-row">
              <span>Headline APMC Rate</span>
              <strong>₹ ${data.mandi.headline.toFixed(2)} / kg</strong>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Arhtiya Commission (${data.benchmark.mandiDeductions.commissionPct}%)</span>
              <span>- ₹ ${data.mandi.commission.toFixed(2)}</span>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Loading & Cartage (Hamali)</span>
              <span>- ₹ ${data.mandi.hamali.toFixed(2)}</span>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Middleman Weighment Cut</span>
              <span>- ₹ ${data.mandi.weighCut.toFixed(2)}</span>
            </div>
            <div class="breakdown-row loss-item">
              <span>- Open Transit Spoilage (${data.benchmark.mandiDeductions.transitWastePct}%)</span>
              <span>- ₹ ${data.mandi.spoilage.toFixed(2)}</span>
            </div>

            <div class="breakdown-row final-take-home">
              <span>Actual Farmer Take-Home:</span>
              <span style="color: #c53030;">₹ ${data.mandi.netPerKg.toFixed(2)} / kg</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px; text-align: right;">
              Total Handover on ${data.qty} kg: <strong>₹ ${Math.round(data.mandi.totalNet).toLocaleString()}</strong>
            </div>
          </div>

          <!-- FarmFlow Direct Column -->
          <div class="farmflow-gain-card">
            <div class="gain-badge">+ ${data.advantage.percentageGain}% Higher Earnings</div>
            <div class="farmflow-gain-header">
              <div>
                <div class="farmflow-name">FarmFlow Direct Contract</div>
                <div style="font-size: 0.78rem; color: var(--primary-700);">Direct to B2B Buyer / Consumer Cluster</div>
              </div>
              <span class="badge badge-success">Zero Middlemen</span>
            </div>

            <div class="breakdown-row">
              <span>Direct Agreed Contract Rate</span>
              <strong>₹ ${data.farmFlow.headline.toFixed(2)} / kg</strong>
            </div>
            <div class="breakdown-row gain-item">
              <span>- Consolidated Reefer Logistics</span>
              <span>- ₹ ${data.farmFlow.logistics.toFixed(2)}</span>
            </div>
            <div class="breakdown-row gain-item">
              <span>- Spoke Weighbridge & Grading</span>
              <span>- ₹ ${data.farmFlow.handling.toFixed(2)}</span>
            </div>
            <div class="breakdown-row gain-item">
              <span>- Platform Tech & Guarantee Fee</span>
              <span>- ₹ ${data.farmFlow.techFee.toFixed(2)}</span>
            </div>
            <div class="breakdown-row gain-item" style="color: #16a34a;">
              <span>+ Spoilage Loss Prevention</span>
              <span>< 1.5% Controlled</span>
            </div>

            <div class="breakdown-row final-gain">
              <span>Farmer Bank Payout (Take-Home):</span>
              <span>₹ ${data.farmFlow.netPerKg.toFixed(2)} / kg</span>
            </div>
            <div style="font-size: 0.95rem; color: var(--primary-900); font-weight: 700; margin-top: 6px; text-align: right;">
              Total in Bank on ${data.qty} kg: <strong style="color: #16a34a; font-size: 1.15rem;">₹ ${Math.round(data.farmFlow.totalNet).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <!-- Extra Payout Banner -->
        <div style="margin-top: 20px; background: linear-gradient(135deg, #10754a, #1b8f56); color: #ffffff; border-radius: var(--radius-lg); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 800;">💰 Direct Net Advantage: + ₹ ${Math.round(data.advantage.totalExtraEarnings).toLocaleString()} Extra in Farmer's Bank!</div>
            <div style="font-size: 0.85rem; color: #dcfce7;">By eliminating the 5 middlemen, you earn ₹ ${data.advantage.netGainPerKg.toFixed(2)} more per kg directly deposited via DBT / UPI.</div>
          </div>
          <button class="btn btn-amber btn-lg" onclick="window.FF_APP.openSellModal('${data.benchmark.name}', ${data.farmFlow.netPerKg})">
            🌾 Lock Direct Forward Contract
          </button>
        </div>
      `;
    }
  };
})();
