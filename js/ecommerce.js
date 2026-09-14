/**
 * FarmFlow Kisan - E-Commerce Shopping Cart & Product Engine
 * Zero-dependency: Exposes window.FF_STORE for direct browser execution.
 */

(function () {
  'use strict';

  window.FF_STORE = {
    cart: [
      { productId: 'PROD-01', qty: 2 }, // 2kg Farm-Fresh Native Tomatoes
      { productId: 'PROD-06', qty: 1 }  // 1x 7kg Kisan Family Box
    ],
    activeCategory: 'all',
    searchKeyword: '',
    clusterDiscountEnabled: true, // Auto-apply neighborhood group-buy

    init() {
      this.updateCartBadge();
    },

    addToCart(productId, qty = 1) {
      const prod = window.FF_DATA.products.find(p => p.id === productId);
      if (!prod) return;

      const existing = this.cart.find(item => item.productId === productId);
      if (existing) {
        existing.qty += qty;
      } else {
        this.cart.push({ productId, qty });
      }

      this.updateCartBadge();
      if (window.FF_APP) {
        window.FF_APP.showToast(`🧺 Added ${qty}x ${prod.name} to basket!`, 'success');
      }
      this.renderCartDrawer();
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.productId !== productId);
      this.updateCartBadge();
      this.renderCartDrawer();
    },

    updateQty(productId, delta) {
      const existing = this.cart.find(item => item.productId === productId);
      if (existing) {
        existing.qty += delta;
        if (existing.qty <= 0) {
          this.removeFromCart(productId);
        } else {
          this.updateCartBadge();
          this.renderCartDrawer();
        }
      }
    },

    getCartCount() {
      return this.cart.reduce((sum, item) => sum + item.qty, 0);
    },

    updateCartBadge() {
      const badge = document.getElementById('cart-badge-count');
      if (badge) {
        badge.textContent = this.getCartCount();
      }
    },

    setCategory(category) {
      this.activeCategory = category;
      this.renderProductGrid();
    },

    setSearch(keyword) {
      this.searchKeyword = (keyword || '').toLowerCase().trim();
      this.renderProductGrid();
    },

    toggleClusterDiscount() {
      this.clusterDiscountEnabled = !this.clusterDiscountEnabled;
      this.renderCartDrawer();
    },

    getFilteredProducts() {
      return window.FF_DATA.products.filter(prod => {
        const matchesCat = (this.activeCategory === 'all') || (prod.category === this.activeCategory);
        const matchesSearch = !this.searchKeyword ||
          prod.name.toLowerCase().includes(this.searchKeyword) ||
          prod.hindiName.toLowerCase().includes(this.searchKeyword) ||
          prod.farmerName.toLowerCase().includes(this.searchKeyword);
        return matchesCat && matchesSearch;
      });
    },

    renderProductGrid() {
      const grid = document.getElementById('store-products-grid');
      if (!grid) return;

      const products = this.getFilteredProducts();

      if (products.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="font-size: 3rem;">🔍</div>
            <div style="font-size: 1.1rem; font-weight: 700; margin-top: 10px;">No farm produce found matching "${this.searchKeyword}"</div>
            <div style="font-size: 0.85rem; margin-top: 4px;">Try searching for "Tomato", "Onion", "Potato" or "Box".</div>
          </div>
        `;
        return;
      }

      grid.innerHTML = products.map(prod => {
        const farmerPct = Math.round((prod.farmerPayout / prod.pricePerKg) * 100);
        const reeferPct = Math.round((prod.logisticsCost / prod.pricePerKg) * 100);
        const platformPct = 100 - farmerPct - reeferPct;

        return `
        <div class="product-card">
          <div class="product-badge-strip">
            <span class="product-badge-farmer">👨‍🌾 Grown by ${prod.farmerName}</span>
            ${(prod.isNewSeller || prod.trustScore <= 70) ? '<span class="new-seller-badge" title="New Smallholder Seller (Neutral Trust Baseline 50/100)">🌱 New Seller</span>' : ''}
            <span class="product-badge-fresh">⚡ ${prod.harvestTimestamp}</span>
          </div>

          <div class="product-image-hero">
            <span>${prod.icon}</span>
          </div>

          <div class="product-body">
            <div class="product-farmer-provenance">
              <span>📍 ${prod.farmerVillage}</span>
              <span>•</span>
              <span style="color: #f59e0b;">★ ${prod.rating}</span>
            </div>

            <div class="product-title">${prod.name}</div>
            <div class="product-sub-hindi">${prod.hindiName}</div>

            <div class="product-price-row">
              <span class="product-price-direct">₹ ${prod.pricePerKg.toFixed(2)}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${prod.unit}</span>
              <span class="product-price-strike">₹ ${prod.supermarketPrice.toFixed(2)}</span>
              <span class="product-price-save">Save ₹ ${(prod.supermarketPrice - prod.pricePerKg).toFixed(2)}</span>
            </div>

            <!-- Inline 100% Transparent Rupee Breakdown Mini-Bar -->
            <div class="transparency-breakdown-card" onclick="window.FF_STORE.openPriceTransparency('${prod.id}')" style="cursor: pointer;" title="Click to view detailed audit breakdown">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                <span style="color: #166534; font-weight: 800;">💰 ${farmerPct}% Goes Directly to Farmer</span>
                <span style="color: var(--primary-700); font-weight: 700;">Full Audit ➔</span>
              </div>
              <div class="transparency-bar-wrap">
                <div class="t-bar-farmer" style="width: ${farmerPct}%;" title="Farmer: ${farmerPct}%"></div>
                <div class="t-bar-reefer" style="width: ${reeferPct}%;" title="Reefer Logistics: ${reeferPct}%"></div>
                <div class="t-bar-platform" style="width: ${platformPct}%;" title="Spoke & Platform: ${platformPct}%"></div>
              </div>
              <div class="transparency-legend-mini">
                <span>🌾 Farmer: <strong>₹${prod.farmerPayout.toFixed(2)}</strong></span>
                <span>🚚 Cold: <strong>₹${prod.logisticsCost.toFixed(2)}</strong></span>
                <span>⚖️ Spoke: <strong>₹${prod.platformFee.toFixed(2)}</strong></span>
              </div>
            </div>

            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 16px;">
              ${prod.description}
            </p>

            <div class="product-card-footer">
              <button class="btn-add-cart" onclick="window.FF_STORE.addToCart('${prod.id}', 1)">
                <span>🧺</span>
                <span>Add to Basket</span>
              </button>
            </div>
          </div>
        </div>
      `;
      }).join('');
    },

    openPriceTransparency(productId) {
      const prod = window.FF_DATA.products.find(p => p.id === productId);
      if (!prod) return;

      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const waterfall = prod.priceWaterfall || {
        consumerPricePerKg: prod.pricePerKg,
        supermarketRetailPerKg: prod.supermarketPrice,
        consumerSavingsPerKg: prod.supermarketPrice - prod.pricePerKg,
        consumerSavingsPct: Math.round(((prod.supermarketPrice - prod.pricePerKg) / prod.supermarketPrice) * 100),
        breakdown: [
          { label: `Direct Farmer Take-Home (${prod.farmerName})`, amount: prod.farmerPayout, pct: Math.round((prod.farmerPayout / prod.pricePerKg) * 1000) / 10, icon: '👨‍🌾', color: '#16a34a' },
          { label: 'Reefer Cold-Chain Carrier Freight', amount: prod.logisticsCost, pct: Math.round((prod.logisticsCost / prod.pricePerKg) * 1000) / 10, icon: '🚚', color: '#0284c7' },
          { label: 'Village Spoke Assaying & Pre-Cooling', amount: 2.50, pct: Math.round((2.50 / prod.pricePerKg) * 1000) / 10, icon: '🏛️', color: '#8b5cf6' },
          { label: 'Platform & Bank Escrow Guarantee', amount: 1.50, pct: Math.round((1.50 / prod.pricePerKg) * 1000) / 10, icon: '🔒', color: '#eab308' }
        ]
      };

      const farmerShare = waterfall.breakdown[0];
      const freightShare = waterfall.breakdown[1];
      const spokeShare = waterfall.breakdown[2];
      const platformShare = waterfall.breakdown[3];

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">💰 Farm-to-Fork Price Transparency: ${prod.name}</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
            <div style="font-size: 3rem; background: #f0fdf4; border-radius: var(--radius-md); width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
              ${prod.icon}
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">${prod.name}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                Consumer Price: <strong style="color: #166534; font-size: 1.05rem;">₹ ${prod.pricePerKg.toFixed(2)} / ${prod.unit}</strong> • Supermarket: <span style="text-decoration: line-through; color: #94a3b8;">₹ ${prod.supermarketPrice.toFixed(2)}</span>
                <span class="badge badge-success" style="margin-left: 8px;">Save ₹ ${(prod.supermarketPrice - prod.pricePerKg).toFixed(2)} (${waterfall.consumerSavingsPct}%)</span>
              </div>
            </div>
          </div>

          <h4 style="margin-bottom: 8px; color: var(--primary-900); font-size: 0.95rem;">SIH Problem Statement 33: Where Does Every Consumer Rupee Go?</h4>
          <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 14px;">
            100% mathematically balanced: Eliminating the 5 traditional middlemen allows the farmer to receive 73.4% of the consumer rupee while urban consumers save 27%.
          </p>

          <!-- 4-color segmented progress bar -->
          <div style="display: flex; height: 32px; border-radius: 999px; overflow: hidden; margin-bottom: 18px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
            ${waterfall.breakdown.map(b => `
              <div style="width: ${b.pct}%; background: ${b.color}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; font-family: 'JetBrains Mono', monospace;" title="${b.label}: ₹${b.amount.toFixed(2)} (${b.pct}%)">
                ${b.pct > 8 ? `${b.pct}%` : ''}
              </div>
            `).join('')}
          </div>

          <div class="legend-list" style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
            <div class="legend-item" style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div class="legend-left" style="display: flex; align-items: center; gap: 8px;">
                <span>👨‍🌾</span>
                <strong>Direct Farmer Net Payout (${prod.farmerName}):</strong>
              </div>
              <span style="color: #16a34a; font-weight: 800; font-size: 1.05rem;">₹ ${farmerShare.amount.toFixed(2)} (${farmerShare.pct}%)</span>
            </div>

            <div class="legend-item" style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div class="legend-left" style="display: flex; align-items: center; gap: 8px;">
                <span>🚚</span>
                <span>Transporter Freight & Reefer Line-Haul:</span>
              </div>
              <span style="color: #0284c7; font-weight: 700;">₹ ${freightShare.amount.toFixed(2)} (${freightShare.pct}%)</span>
            </div>

            <div class="legend-item" style="background: #faf5ff; border-left: 4px solid #8b5cf6; padding: 10px 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div class="legend-left" style="display: flex; align-items: center; gap: 8px;">
                <span>🏛️</span>
                <span>Village Spoke Assaying & Solar Pre-Cooling:</span>
              </div>
              <span style="color: #8b5cf6; font-weight: 700;">₹ ${spokeShare.amount.toFixed(2)} (${spokeShare.pct}%)</span>
            </div>

            <div class="legend-item" style="background: #fefce8; border-left: 4px solid #eab308; padding: 10px 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div class="legend-left" style="display: flex; align-items: center; gap: 8px;">
                <span>🔒</span>
                <span>Bank Escrow Guarantee & Digital Weighing:</span>
              </div>
              <span style="color: #a16207; font-weight: 700;">₹ ${platformShare.amount.toFixed(2)} (${platformShare.pct}%)</span>
            </div>

            <div class="legend-item" style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 8px 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div class="legend-left" style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #dc2626;">❌</span>
                <span style="color: #b91c1c; font-weight: 600;">5 Middlemen & Arhtiya Commissions:</span>
              </div>
              <span style="color: #b91c1c; font-weight: 800;">₹ 0.00 (Zero Intermediaries!)</span>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 0.82rem; color: #475569; line-height: 1.5;">
            <strong>Batch Origin & Provenance:</strong> Harvested by Farmer <strong>${prod.farmerName}</strong> at ${prod.farmerVillage}. Pre-cooled at village solar spoke with IoT Load-Cell digital slip and direct Aadhaar DBT bank payout.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="window.FF_STORE.addToCart('${prod.id}', 1); window.FF_APP.closeModal();">Add to Basket</button>
        </div>
      `;

      window.FF_APP.openModal();
    },

    openCartDrawer() {
      this.renderCartDrawer();
      const backdrop = document.getElementById('cart-drawer-backdrop');
      if (backdrop) backdrop.classList.add('open');
    },

    closeCartDrawer() {
      const backdrop = document.getElementById('cart-drawer-backdrop');
      if (backdrop) backdrop.classList.remove('open');
    },

    renderCartDrawer() {
      const scrollArea = document.getElementById('cart-items-scroll');
      const footerArea = document.getElementById('cart-drawer-footer');
      if (!scrollArea || !footerArea) return;

      if (this.cart.length === 0) {
        scrollArea.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <div style="font-size: 3.5rem;">🧺</div>
            <div style="font-size: 1.1rem; font-weight: 700; margin-top: 12px; color: var(--text-main);">Your farm basket is empty</div>
            <div style="font-size: 0.85rem; margin-top: 4px;">Select fresh produce directly from Kolar smallholders.</div>
          </div>
        `;
        footerArea.innerHTML = `
          <button class="btn btn-secondary" style="width: 100%;" onclick="window.FF_STORE.closeCartDrawer()">Continue Shopping</button>
        `;
        return;
      }

      let subtotal = 0;
      let totalFarmerPayout = 0;
      let totalRetailSavings = 0;

      const itemsHtml = this.cart.map(item => {
        const prod = window.FF_DATA.products.find(p => p.id === item.productId);
        if (!prod) return '';

        const itemTotal = prod.pricePerKg * item.qty;
        const itemFarmerPayout = prod.farmerPayout * item.qty;
        const itemSavings = (prod.supermarketPrice - prod.pricePerKg) * item.qty;

        subtotal += itemTotal;
        totalFarmerPayout += itemFarmerPayout;
        totalRetailSavings += itemSavings;

        return `
          <div class="cart-item-row">
            <div class="cart-item-info">
              <div class="cart-item-icon">${prod.icon}</div>
              <div>
                <div class="cart-item-name">${prod.name}</div>
                <div class="cart-item-meta">₹ ${prod.pricePerKg.toFixed(2)} / ${prod.unit} • Grown by ${prod.farmerName}</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="qty-stepper">
                <button class="qty-btn" onclick="window.FF_STORE.updateQty('${prod.id}', -1)">−</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="window.FF_STORE.updateQty('${prod.id}', 1)">+</button>
              </div>

              <div style="text-align: right; min-width: 70px;">
                <div class="cart-item-price">₹ ${itemTotal.toFixed(2)}</div>
                <button style="background: none; border: none; color: #ef4444; font-size: 0.75rem; cursor: pointer;" onclick="window.FF_STORE.removeFromCart('${prod.id}')">Remove</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Cluster Group-Buy Discount
      const clusterDiscountAmount = this.clusterDiscountEnabled ? (subtotal * 0.15) : 0;
      const deliveryFee = 0; // Free neighborhood bulk delivery
      const finalTotal = subtotal - clusterDiscountAmount;

      scrollArea.innerHTML = `
        ${itemsHtml}

        <div class="cart-cluster-toggle">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: #166534;">🏘️ Housing Society Pool Discount (Whitefield)</div>
            <div style="font-size: 0.78rem; color: #15803d;">Group order pooled with 120 flats saves an extra 15% on last-mile logistics!</div>
          </div>
          <input type="checkbox" ${this.clusterDiscountEnabled ? 'checked' : ''} onchange="window.FF_STORE.toggleClusterDiscount()" style="width: 20px; height: 20px; cursor: pointer;">
        </div>

        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: var(--radius-md); padding: 12px 16px; margin-top: 12px; font-size: 0.82rem; color: var(--text-muted);">
          💚 <strong>Direct Farmer Impact:</strong> ₹ ${totalFarmerPayout.toFixed(2)} of this order is deposited directly into smallholders' bank accounts.
        </div>
      `;

      footerArea.innerHTML = `
        <div class="cart-summary-row">
          <span>Subtotal:</span>
          <span>₹ ${subtotal.toFixed(2)}</span>
        </div>
        ${this.clusterDiscountEnabled ? `
          <div class="cart-summary-row" style="color: #16a34a; font-weight: 700;">
            <span>🏘️ Neighborhood Group Discount (15%):</span>
            <span>- ₹ ${clusterDiscountAmount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="cart-summary-row">
          <span>Cold Delivery to Community Gate:</span>
          <span style="color: #16a34a; font-weight: 700;">FREE (Consolidated)</span>
        </div>
        <div class="cart-summary-row cart-summary-total">
          <span>Total Payable:</span>
          <span style="color: var(--primary-900);">₹ ${finalTotal.toFixed(2)}</span>
        </div>
        <div style="font-size: 0.8rem; color: #16a34a; font-weight: 700; text-align: center;">
          🎉 You save ₹ ${(totalRetailSavings + clusterDiscountAmount).toFixed(2)} compared to city supermarkets!
        </div>
        <button class="btn-checkout-now" onclick="window.FF_STORE.openCheckoutModal(${finalTotal.toFixed(2)})">
          Proceed to Farm-Direct Checkout ➔
        </button>
      `;
    },

    selectedSocietyId: 'SOC-01',

    setSociety(socId) {
      this.selectedSocietyId = socId;
      if (window.FF_APP && window.FF_APP.activeRole === 'CONSUMER') {
        const workspace = document.getElementById('main-workspace');
        if (workspace) window.FF_APP.renderConsumerView(workspace);
      }
      const soc = (window.FF_DATA.consumerSocieties || []).find(s => s.id === socId);
      if (soc) {
        window.FF_APP.showToast(`🏘️ Switched delivery hub to ${soc.name}`, 'info');
      }
    },

    openCheckoutModal(amount) {
      this.closeCartDrawer();
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const currentSoc = (window.FF_DATA.consumerSocieties || []).find(s => s.id === this.selectedSocietyId) || window.FF_DATA.consumerSocieties[0];
      const cert = window.FF_DATA.provenanceCert || {};

      // Calculate realistic breakdown
      const payAmount = Number(amount) || 142.00;
      const supermarketEst = Math.round(payAmount * 1.38);
      const consumerSavings = supermarketEst - payAmount;
      const farmerDirectPayout = Math.round(payAmount * 0.734);
      const middlemanCommissionSaved = Math.round(supermarketEst * 0.25);

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">🌱 Transparent Farm-to-Fork Impact Checkout</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="impact-header-badge">
            ✓ 100% DIRECT ESCROW • ZERO COMMISSION AGENTS
          </div>

          <div class="impact-stats-row">
            <div class="impact-stat-box green">
              <div style="font-size: 0.78rem; color: #166534; font-weight: 700;">YOUR DIRECT SAVINGS</div>
              <div class="impact-stat-val">₹ ${consumerSavings}.00</div>
              <div style="font-size: 0.75rem; color: #15803d; margin-top: 2px;">vs Supermarket Retail (₹${supermarketEst})</div>
            </div>
            <div class="impact-stat-box green">
              <div style="font-size: 0.78rem; color: #166534; font-weight: 700;">FARMER DIRECT EARNINGS</div>
              <div class="impact-stat-val" style="color: #047857;">₹ ${farmerDirectPayout}.00</div>
              <div style="font-size: 0.75rem; color: #047857; margin-top: 2px;">+113% higher than Mandi net rate</div>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>Middlemen Eliminated:</span>
              <strong style="color: #16a34a;">5 Intermediaries (₹${middlemanCommissionSaved} cuts avoided)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>Direct Beneficiary:</span>
              <strong>Farmer Ramesh Patel (Vokkaleri, Kolar)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>Community Hub Drop-off:</span>
              <strong>${currentSoc.name} (${currentSoc.hubDropLocation})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0; border-top: 1px dashed #cbd5e1; margin-top: 6px; padding-top: 8px;">
              <span style="font-weight: 700;">Net Payable (Direct Escrow):</span>
              <strong style="font-size: 1.15rem; color: var(--primary-900);">₹ ${payAmount.toFixed(2)}</strong>
            </div>
          </div>

          <div class="provenance-tag-box">
            <strong>🛡️ Certified Chemical-Residue-Free (NABL Lab Test):</strong><br>
            Lab Certificate: ${cert.labCertificateNo || 'NABL-2026-9921'} • Pesticide Residue: &lt; 0.01 mg/kg (100% Safe) • Harvested this morning at 05:30 AM in Kolar.
          </div>

          <!-- Simulated UPI QR Code -->
          <div style="text-align: center; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; background: #ffffff; margin-top: 14px;">
            <div class="qr-box" style="margin: 0 auto; width: 80px; height: 80px; font-size: 2.8rem;">📱</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900); margin-top: 6px;">Scan & Pay ₹ ${payAmount.toFixed(2)} via UPI</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Aadhaar DBT Escrow Bridge • SBI Escrow Node</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.FF_STORE.confirmOrder(${payAmount.toFixed(2)}, '${currentSoc.name}')">
            ⚡ Pay ₹ ${payAmount.toFixed(2)} & Lock Direct Order
          </button>
        </div>
      `;

      window.FF_APP.openModal();
    },

    confirmOrder(amount, socName) {
      this.cart = [];
      this.updateCartBadge();
      window.FF_APP.closeModal();

      // Show Order Success Voucher Modal
      const modalBox = document.getElementById('modal-box');
      if (modalBox) {
        modalBox.innerHTML = `
          <div class="modal-header">
            <div class="modal-title">🎉 Order Confirmed • FarmFlow Batch Sealed</div>
            <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
          </div>
          <div class="modal-body" style="text-align: center; padding: 20px;">
            <div style="font-size: 3.5rem;">🧺</div>
            <h3 style="color: #166534; font-size: 1.35rem; margin-top: 8px;">Direct Harvest Scheduled!</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 480px; margin: 8px auto 16px;">
              Your order of <strong>₹ ${amount}</strong> has been secured in bank escrow. Farmer Ramesh Patel has received your harvest token at Vokkaleri, Kolar.
            </p>

            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 16px; text-align: left; margin-bottom: 18px;">
              <div style="font-size: 0.82rem; color: #166534;">
                📍 <strong>Delivery:</strong> Tomorrow morning at ${socName || 'Your Society Hub'}<br>
                🚚 <strong>Transit:</strong> Electric Loader KA-03-D-9912 (Reefer Pre-Cooled)<br>
                💰 <strong>Farmer Take-Home:</strong> 100% direct bank DBT settlement on delivery.
              </div>
            </div>

            <div class="qr-box" style="margin: 0 auto; width: 90px; height: 90px; font-size: 3rem;">📱</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">Batch Tamper-Proof QR #CRATE-2026-8812</div>
          </div>
          <div class="modal-footer" style="justify-content: center;">
            <button class="btn btn-primary" onclick="window.FF_APP.closeModal()">Done</button>
          </div>
        `;
        window.FF_APP.openModal();
      }

      window.FF_APP.showToast('🎉 Order Placed! Dispatch notification sent to Kolar Spoke.', 'success');
      window.FF_VOICE.speak('Your direct farm order is confirmed. Produce will be harvested early morning and delivered fresh to your society gate.');
    }
  };

  // Auto initialize when DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    window.FF_STORE.init();
  });
})();
