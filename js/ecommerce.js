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

      grid.innerHTML = products.map(prod => `
        <div class="product-card">
          <div class="product-badge-strip">
            <span class="product-badge-farmer">👨‍🌾 Grown by ${prod.farmerName}</span>
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

            <div class="transparency-chip-trigger" onclick="window.FF_STORE.openPriceTransparency('${prod.id}')" title="Click to see where your money goes">
              <span>💰 <strong>₹ ${prod.farmerPayout.toFixed(2)}</strong> goes to farmer</span>
              <span style="color: var(--primary-700); font-weight: 700;">Transparency ➔</span>
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
      `).join('');
    },

    openPriceTransparency(productId) {
      const prod = window.FF_DATA.products.find(p => p.id === productId);
      if (!prod) return;

      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      const farmerPct = ((prod.farmerPayout / prod.pricePerKg) * 100).toFixed(1);
      const logisticsPct = ((prod.logisticsCost / prod.pricePerKg) * 100).toFixed(1);
      const platformPct = ((prod.platformFee / prod.pricePerKg) * 100).toFixed(1);

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">💰 Price Transparency Meter: ${prod.name}</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
            <div style="font-size: 3rem; background: #f0fdf4; border-radius: var(--radius-md); width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
              ${prod.icon}
            </div>
            <div>
              <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-900);">${prod.name}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">Consumer Price: <strong>₹ ${prod.pricePerKg.toFixed(2)} / ${prod.unit}</strong> (Retail Mandi: ₹ ${prod.supermarketPrice.toFixed(2)})</div>
            </div>
          </div>

          <h4 style="margin-bottom: 10px; color: var(--primary-900);">Where Does Every Rupee Go?</h4>
          <div class="scenario-stacked-bar" style="margin-bottom: 18px; height: 36px;">
            <div class="bar-segment seg-farmer" style="width: ${farmerPct}%;" title="Farmer Share">${farmerPct}%</div>
            <div class="bar-segment seg-logistics" style="width: ${logisticsPct}%;" title="Cold Line-Haul">${logisticsPct}%</div>
            <div class="bar-segment seg-platform" style="width: ${platformPct}%;" title="Spoke & Platform">${platformPct}%</div>
          </div>

          <div class="legend-list" style="margin-bottom: 20px;">
            <div class="legend-item" style="background: #f0fdf4; padding: 8px 12px; border-radius: var(--radius-md);">
              <div class="legend-left">
                <span class="legend-dot seg-farmer"></span>
                <strong>Direct Farmer Payout (${prod.farmerName}):</strong>
              </div>
              <span class="legend-val" style="color: #16a34a; font-size: 1rem;">₹ ${prod.farmerPayout.toFixed(2)} (${farmerPct}%)</span>
            </div>
            <div class="legend-item" style="padding: 6px 12px;">
              <div class="legend-left">
                <span class="legend-dot seg-logistics"></span>
                <span>Cold-Chain Transit (NH-75 Reefer):</span>
              </div>
              <span class="legend-val">₹ ${prod.logisticsCost.toFixed(2)} (${logisticsPct}%)</span>
            </div>
            <div class="legend-item" style="padding: 6px 12px;">
              <div class="legend-left">
                <span class="legend-dot seg-platform"></span>
                <span>Spoke Digital Weighbridge & Platform Fee:</span>
              </div>
              <span class="legend-val">₹ ${prod.platformFee.toFixed(2)} (${platformPct}%)</span>
            </div>
            <div class="legend-item" style="background: #fee2e2; padding: 6px 12px; border-radius: var(--radius-md);">
              <div class="legend-left">
                <span style="color: #dc2626;">✕</span>
                <span style="color: #b91c1c;">Middlemen & Arhtiya Cut:</span>
              </div>
              <span class="legend-val" style="color: #b91c1c; font-weight: 800;">₹ 0.00 (Zero Intermediaries!)</span>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
            <strong>Smallholder Origin:</strong> Harvested by ${prod.farmerName} at ${prod.farmerVillage}. Delivered fresh via GreenRoots FPO Spoke Point without passing through wholesale mandis.
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

    openCheckoutModal(amount) {
      this.closeCartDrawer();
      const modalBox = document.getElementById('modal-box');
      if (!modalBox) return;

      modalBox.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">⚡ Instant Farm-to-Fork Checkout</div>
          <button class="modal-close-btn" onclick="window.FF_APP.closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 14px; margin-bottom: 18px;">
            <div style="font-size: 0.95rem; font-weight: 800; color: #166534;">
              Total Amount: ₹ ${amount} (Zero Middleman Markups)
            </div>
            <div style="font-size: 0.8rem; color: #15803d; margin-top: 2px;">
              Delivery scheduled for tomorrow morning via E-Loader KA-03-D-9912.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Drop-off Location / Cluster Hub:</label>
            <input type="text" class="form-control" value="Whitefield Green Residency, Security Gate 2 Hub" readonly>
          </div>

          <div class="form-group">
            <label class="form-label">Apartment / Flat No. & Mobile:</label>
            <input type="text" class="form-control" value="Flat 402, Tower B • +91 98450 11223">
          </div>

          <div class="form-group">
            <label class="form-label">Select Payment Method:</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
              <button class="btn btn-secondary active" style="border-color: var(--primary-600); background: var(--primary-50);">
                📲 UPI (GPay / PhonePe / BHIM)
              </button>
              <button class="btn btn-secondary">
                💳 Card / Net Banking
              </button>
            </div>
          </div>

          <!-- Simulated UPI QR Code -->
          <div style="text-align: center; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px; background: #ffffff; margin-top: 14px;">
            <div class="qr-box" style="margin: 0 auto; width: 100px; height: 100px; font-size: 3.5rem;">📱</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900); margin-top: 8px;">Scan & Pay ₹ ${amount}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">UPI ID: farmflow.kolar@sbi</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.FF_APP.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="window.FF_STORE.confirmOrder()">
            ⚡ Confirm & Simulate Instant Payment
          </button>
        </div>
      `;

      window.FF_APP.openModal();
    },

    confirmOrder() {
      this.cart = [];
      this.updateCartBadge();
      window.FF_APP.closeModal();
      window.FF_APP.showToast('🎉 Order Placed! Dispatch notification sent to Kolar Spoke.', 'success');

      // Play Kisan Voice confirmation
      window.FF_VOICE.speak('Your direct farm order is confirmed. Produce will be harvested tomorrow morning and delivered to your cluster gate.');
    }
  };

  // Auto initialize when DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    window.FF_STORE.init();
  });
})();
