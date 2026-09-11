/**
 * FarmFlow Kisan - Supply Chain Logistics, FPO Aggregation & Failure Recovery
 * Coordinates Hub-and-Spoke Transit, Order State Machines & SIH 2026 Simulation
 */

(function () {
  'use strict';

  window.FF_CHAIN = {
    currentSimStep: 1,
    maxSimSteps: 15,
    isSimRunning: false,

    simSteps: [
      { step: 1, title: 'Commercial Demand Created', actor: 'FreshMart B2B & Whitefield Cluster', desc: 'Demand posted: 1,500 kg (FreshMart) + 700 kg (Consumer Cluster) = 2,200 kg Grade-A Tomato.', payload: { totalDemandKg: 2200, escrowSecured: true } },
      { step: 2, title: 'AI Procurement Gap Detected', actor: 'FarmFlow Forecasting Engine', desc: 'Identified 2,200 kg procurement deficit at Bengaluru North Distribution Hub.', payload: { gapKg: 2200, hub: 'Bengaluru North Hub' } },
      { step: 3, title: 'FPO & Smallholder Pool Discovered', actor: 'Kolar Agro Spoke', desc: 'Discovered supply: GreenRoots FPO (900 kg) + Farmer Ramesh (650 kg) + Suresh (500 kg) + Meena (150 kg buffer).', payload: { allocatedKg: 2200, farmersCount: 4 } },
      { step: 4, title: 'Net Realization Evaluated', actor: 'Economic Matching Algorithm', desc: 'Evaluated buyer offers. FreshMart selected: ₹26 headline - ₹2.50 logistics/handling = ₹23.50 net realization (₹12.50 higher than Mandi).', payload: { netTakeHome: 23.50, rank: 1 } },
      { step: 5, title: 'Forward Contract Locked', actor: 'Smart Contract / Order Engine', desc: 'Forward order #ORD-2026-8812 locked with 100% Escrow deposit of ₹57,200 in buyer account.', payload: { orderNo: 'ORD-2026-8812', escrowAmount: 57200 } },
      { step: 6, title: 'Spoke Digital Weighbridge Intake', actor: 'Kolar Spoke Weighbridge', desc: 'Digital load cells recorded: Ramesh (650 kg, Grade A, Ticket #WB-991). Tamper-proof QR certificate generated.', payload: { ticketNo: 'WB-991', grossKg: 650, tareKg: 18 } },
      { step: 7, title: 'Quality Assay Verified', actor: 'Certified Spoke Assayer', desc: 'Digital refractometer & colorimetric assay: 4.8° Brix, 98.2% defect-free Grade A certified.', payload: { brix: 4.8, grade: 'A_PLUS', inspector: 'Dr. C. Gowda' } },
      { step: 8, title: 'Consolidated Reefer Truck Loaded', actor: 'Fleet Logistics (VEH-01)', desc: '2,200 kg palletized into refrigerated Eicher Truck (KA-04-E-4421). Pre-cooled chamber: 6°C.', payload: { vehicle: 'KA-04-E-4421', tempC: 6.2, capacityUtilPct: 55 } },
      { step: 9, title: 'Line-Haul Transit on NH-75', actor: 'GPS Corridor Tracker', desc: 'En route Kolar Spoke to Bengaluru Peri-Urban Hub. Speed: 52 km/h, thermal log stable.', payload: { corridor: 'NH-75', etaMins: 42, distanceKm: 64 } },
      { step: 10, title: 'Arrival at Peri-Urban Hub', actor: 'Bengaluru Central Cross-Dock', desc: 'Truck checked in at Gate 3. Secondary temperature and seal verification passed.', payload: { hub: 'Bengaluru Hub', sealIntact: true } },
      { step: 11, title: 'Demand Cluster Cross-Dock Split', actor: 'Automated Sorting Conveyor', desc: 'Consolidated batch separated: 1,500 kg for FreshMart B2B; 700 kg dispatched to Whitefield Cluster via E-Loader (KA-03-D-9912).', payload: { b2bKg: 1500, clusterKg: 700 } },
      { step: 12, title: 'Dock Delivery Acceptance', actor: 'FreshMart Receiving Dock', desc: 'Dock scale verifies 1,490 kg accepted produce (10 kg standard transit moisture loss logged).', payload: { receivedKg: 1490, shrinkageKg: 10 } },
      { step: 13, title: 'Direct Net Settlement Reconciled', actor: 'Payment & Escrow Clearing', desc: '₹53,955 gross released: Payouts disbursed directly to farmers (Ramesh: ₹15,275; Suresh: ₹11,750; Meena: ₹19,975).', payload: { totalFarmerPayout: 51225, platformFee: 1100, logisticsDeduction: 3080 } },
      { step: 14, title: 'Instant Bank DBT Transfer Completed', actor: 'Aadhaar / NPCI / SBI Gateway', desc: 'Instant DBT credit references generated. Ramesh Patel account ••••8842 credited ₹15,275.00 instantly.', payload: { utr: 'SBI98231049281', status: 'SUCCESS' } },
      { step: 15, title: 'Trust Score & Forecast Updated', actor: 'Reputation & Learning Ledger', desc: 'Buyer Trust: 99.2% (+0.1%). Farmer Ramesh Trust: 98.6% (+0.2%). Rolling forecast learns seasonal demand elasticity.', payload: { newTrustScore: 98.6, modelUpdated: true } }
    ],

    // Jump to specific simulation step
    goToStep(stepNum) {
      this.currentSimStep = Math.max(1, Math.min(this.maxSimSteps, stepNum));
      this.renderSimStage();
    },

    nextStep() {
      if (this.currentSimStep < this.maxSimSteps) {
        this.currentSimStep++;
        this.renderSimStage();
      }
    },

    prevStep() {
      if (this.currentSimStep > 1) {
        this.currentSimStep--;
        this.renderSimStage();
      }
    },

    // Play automated simulation run
    playSim() {
      if (this.isSimRunning) return;
      this.isSimRunning = true;
      this.currentSimStep = 1;
      this.renderSimStage();

      const btn = document.getElementById('btn-play-sim');
      if (btn) btn.textContent = '⏸️ Running 15 Stages...';

      const interval = setInterval(() => {
        if (this.currentSimStep < this.maxSimSteps) {
          this.currentSimStep++;
          this.renderSimStage();
        } else {
          clearInterval(interval);
          this.isSimRunning = false;
          if (btn) btn.textContent = '▶️ Auto Run 15 Steps';
          if (window.FF_APP) window.FF_APP.showToast('🎉 End-to-End Enterprise Supply Chain Pipeline Simulation Completed Successfully!', 'success');
        }
      }, 1400);
    },

    renderSimStage() {
      const stepData = this.simSteps[this.currentSimStep - 1];
      const container = document.getElementById('pipeline-stage-view');
      if (!container || !stepData) return;

      const badge = document.getElementById('sim-current-step-badge');
      if (badge) badge.textContent = `Stage ${this.currentSimStep} of ${this.maxSimSteps}`;

      container.innerHTML = `
        <div class="pipeline-stage-card highlight">
          <div class="stage-title-wrap">
            <div class="stage-name">Step ${stepData.step}: ${stepData.title}</div>
            <span class="stage-actor">${stepData.actor}</span>
          </div>

          <div style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">
            ${stepData.desc}
          </div>

          <div class="stage-data-preview">
// System Event Bus Dispatch [EVENT_STAGE_${stepData.step}]
${JSON.stringify(stepData.payload, null, 2)}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--text-muted);">
            <span>Status: <strong style="color: #16a34a;">VERIFIED_AUDITABLE_TRANSACTION</strong></span>
            <span>Blockchain/Audit Hash: <code>#a8f93e${stepData.step}09b2</code></span>
          </div>
        </div>
      `;
    },

    // ========================================================================
    // Real-World Failure Scenarios
    // ========================================================================
    triggerBreakdown() {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title" style="color: #dc2626;">🚨 Live Failure Test: Vehicle Breakdown on NH-75</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
            <strong style="color: #991b1b;">Telemetry Incident:</strong>
            <p style="font-size: 0.88rem; color: #7f1d1d; margin-top: 4px;">
              Primary Reefer Truck <strong>KA-04-E-4421</strong> reported coolant failure on NH-75 (Mile 42, Hoskote Bypass). Carrying 2,200 kg perishables at 6.2°C.
            </p>
          </div>

          <h4 style="margin-bottom: 10px; color: var(--primary-900);">Automated System Recovery Action:</h4>
          <ol style="font-size: 0.88rem; color: var(--text-muted); padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Auto-Standby Reassignment:</strong> Detected Standby Reefer <strong>KA-51-B-3310</strong> stationed at Hoskote Hub (6.8 km away).</li>
            <li><strong>Cross-Dock Transfer Manifest:</strong> Authorized transfer of 2,200 kg crates without thermal breach.</li>
            <li><strong>Dynamic ETA Recalculation:</strong> Adjusted Bengaluru Central arrival from 06:00 AM to 06:35 AM (+35 mins).</li>
            <li><strong>Automated Stakeholder Alerts:</strong> Destination cold room and FreshMart dock notified in real-time.</li>
          </ol>

          <div style="margin-top: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; color: #166534; font-weight: 700; font-size: 0.88rem;">
            ✅ Recovery Succeeded: Produce saved from thermal spoilage. Standby reefer engaged. Zero financial loss for farmers!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.FF_APP.closeModal()">Acknowledge & Close</button>
        </div>
      `;

      window.FF_APP.openModal();
      window.FF_APP.showToast('🚨 Simulated Breakdown: Auto-Standby Reefer dispatched!', 'warning');
    },

    triggerShortage() {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title" style="color: #d97706;">⚖️ Live Failure Test: 150 kg Spoke Weight Shortage</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
            <strong style="color: #92400e;">Spoke Scale Discrepancy:</strong>
            <p style="font-size: 0.88rem; color: #78350f; margin-top: 4px;">
              Reconciled intake at Kolar Spoke measured <strong>2,050 kg</strong> against forward contract target of <strong>2,200 kg</strong> (Deficit: 150 kg).
            </p>
          </div>

          <h4 style="margin-bottom: 10px; color: var(--primary-900);">Automated Mitigation Pipeline:</h4>
          <ol style="font-size: 0.88rem; color: var(--text-muted); padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Dynamic Buffer Discovery:</strong> Queried verified standby harvest lots in radius < 10 km.</li>
            <li><strong>Emergency Allocation:</strong> Pulled 150 kg Grade-A Tomato from member <strong>Meena Bai (Lot #LOT-552)</strong> pre-cooled at Kolar Solar Spoke.</li>
            <li><strong>Full Quota Restored:</strong> Total shipment volume restored to 2,200 kg without delaying line-haul departure.</li>
            <li><strong>Contract Preserved:</strong> Buyer contract fulfilled 100% with zero shortage penalty.</li>
          </ol>

          <div style="margin-top: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; color: #166534; font-weight: 700; font-size: 0.88rem;">
            ✅ Buffer Sourced: 150 kg supplied from solar cold spoke reserve. Order intact!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.FF_APP.closeModal()">Acknowledge & Close</button>
        </div>
      `;

      window.FF_APP.openModal();
      window.FF_APP.showToast('⚖️ Shortage Mitigated: Sourced 150 kg from solar cold spoke reserve.', 'info');
    },

    triggerOverdue() {
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title" style="color: #2563eb;">📅 Live Failure Test: Buyer 7-Day Payment Extension</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
            <strong style="color: #1e40af;">Buyer Credit Request:</strong>
            <p style="font-size: 0.88rem; color: #1e3a8a; margin-top: 4px;">
              B2B Buyer FreshMart requested a 7-day credit grace extension on Invoice #INV-4921 (Amount: ₹57,200).
            </p>
          </div>

          <h4 style="margin-bottom: 10px; color: var(--primary-900);">Smart Escrow Mediation Protocol:</h4>
          <ol style="font-size: 0.88rem; color: var(--text-muted); padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Pre-Secured Escrow Lien:</strong> 100% of the funds remain frozen in bank escrow, guaranteeing zero default risk for farmers.</li>
            <li><strong>Farmer Early Liquidity Bridge:</strong> Platform NBFC / FPO credit pool advances ₹15,275 to Ramesh Patel at 0% farmer cost.</li>
            <li><strong>Buyer Late Surcharge:</strong> 1.25% commercial credit extension surcharge applied to buyer invoice for delayed release.</li>
            <li><strong>Trust Score Adjustment:</strong> Buyer payment reliability index updated from 99.1% to 98.4%.</li>
          </ol>

          <div style="margin-top: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; color: #166534; font-weight: 700; font-size: 0.88rem;">
            ✅ Farmer Protected: Farmers paid on schedule via smart escrow liquidity bridge!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.FF_APP.closeModal()">Acknowledge & Close</button>
        </div>
      `;

      window.FF_APP.openModal();
      window.FF_APP.showToast('📅 Extension Handled: Farmer payout guaranteed via smart escrow bridge.', 'info');
    }
  };
})();
