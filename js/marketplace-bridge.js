/**
 * FarmFlow Kisan - Marketplace Bridge & Linked Cross-Stakeholder Registry
 * Manages the reactive shared state linking Farmer produce listings to:
 * 1. B2B Wholesale Produce Catalog (for Institutional Buyers)
 * 2. Farm-to-Fork Direct Store (for Consumers & Society Hubs)
 * 3. Reefer Dispatch Queue (for Logistics Drivers)
 * 4. Aadhaar DBT Passbook (for Farmer Payouts)
 */

(function () {
  'use strict';

  window.FF_BRIDGE = {
    // Dynamic smallholder listings posted by farmers & FPOs
    smallholderListings: [
      {
        id: 'LOT-2026-01',
        farmerId: 'FARMER-01',
        farmerName: 'Ramesh Patel',
        farmerVillage: 'Vokkaleri Village, Kolar',
        crop: 'Tomato',
        variety: 'Sivam Hybrid (Grade A+)',
        category: 'solanaceous',
        qtyKg: 650,
        availableQtyKg: 650,
        harvestDate: '2026-09-15',
        spokeId: 'eNAM-SPOKE-KA-KOLAR-04',
        spokeName: 'Vokkaleri e-NAM Village Sub-Spoke',
        farmerRatePerKg: 23.50,
        logisticsPerKg: 4.50,
        platformFeePerKg: 2.00,
        consumerPricePerKg: 32.00,
        supermarketPricePerKg: 44.00,
        wholesaleRatePerKg: 26.00,
        brixSugar: '4.8° Brix',
        firmness: '4.2 kg/cm²',
        shelfLifeDays: 8,
        status: 'AVAILABLE_FOR_SOURCING', // AVAILABLE_FOR_SOURCING, LOCKED_ESCROW, IN_TRANSIT, DELIVERED
        matchedBuyer: null,
        escrowLocked: false,
        icon: '🍅'
      },
      {
        id: 'LOT-2026-02',
        farmerId: 'FARMER-02',
        farmerName: 'Suresh Gowda',
        farmerVillage: 'Malur, Kolar',
        crop: 'Red Onion',
        variety: 'Nashik Red Grade A',
        category: 'tubers',
        qtyKg: 1200,
        availableQtyKg: 1200,
        harvestDate: '2026-09-14',
        spokeId: 'eNAM-SPOKE-KA-KOLAR-02',
        spokeName: 'Malur Solar Hub',
        farmerRatePerKg: 24.00,
        logisticsPerKg: 3.50,
        platformFeePerKg: 1.50,
        consumerPricePerKg: 32.00,
        supermarketPricePerKg: 42.00,
        wholesaleRatePerKg: 26.50,
        brixSugar: 'N/A',
        firmness: 'Firm Dry Cured',
        shelfLifeDays: 30,
        status: 'AVAILABLE_FOR_SOURCING',
        matchedBuyer: null,
        escrowLocked: false,
        icon: '🧅'
      },
      {
        id: 'LOT-2026-03',
        farmerId: 'FARMER-04',
        farmerName: 'Anita Devi',
        farmerVillage: 'Srinivaspur, Kolar',
        crop: 'Green Capsicum',
        variety: 'Indam Polyhouse Bell',
        category: 'solanaceous',
        qtyKg: 450,
        availableQtyKg: 450,
        harvestDate: '2026-09-15',
        spokeId: 'eNAM-SPOKE-KA-KOLAR-04',
        spokeName: 'Vokkaleri e-NAM Village Sub-Spoke',
        farmerRatePerKg: 38.60,
        logisticsPerKg: 5.40,
        platformFeePerKg: 4.00,
        consumerPricePerKg: 48.00,
        supermarketPricePerKg: 68.00,
        wholesaleRatePerKg: 42.50,
        brixSugar: '4.2° Brix',
        firmness: 'Thick Walled A+',
        shelfLifeDays: 12,
        status: 'AVAILABLE_FOR_SOURCING',
        matchedBuyer: null,
        escrowLocked: false,
        icon: '🫑'
      }
    ],

    // Active purchase contracts & orders generated across the network
    ordersLedger: [
      {
        orderId: 'ORD-2026-8812',
        lotId: 'LOT-2026-01',
        buyerId: 'BUYER-01',
        buyerName: 'FreshMart Hypermarket Pvt. Ltd.',
        buyerType: 'Organized Retail Chain',
        farmerId: 'FARMER-01',
        farmerName: 'Ramesh Patel',
        crop: 'Tomato (Grade A+)',
        qtyKg: 650,
        headlineRate: 26.00,
        netFarmerTakeHome: 23.50,
        totalGrossRs: 16900,
        totalFarmerPayoutRs: 15275,
        escrowDepositRs: 16900,
        escrowStatus: '100% SECURED_IN_BANK',
        vehicleAssigned: 'KA-03-D-9912 (Mahindra E-Loader)',
        driverName: 'Kiran Kumar',
        driverPhone: '+91 88612 99014',
        pickupLocation: 'Vokkaleri Farmgate, Kolar',
        deliveryLocation: 'Kolar Village Spoke #4',
        status: 'PICKUP_DISPATCHED', // PENDING, PICKUP_DISPATCHED, SPOKE_WEIGHED, ASSAYED, IN_TRANSIT, DELIVERED, DBT_CREDITED
        utrNumber: 'SBIN90214892'
      }
    ],

    // Farmer's DBT passbook records
    dbtPassbookRecords: [
      {
        id: 'DBT-991',
        date: '14 Sept 2026, 11:42 AM',
        lotId: 'LOT-2026-PREV',
        crop: 'Tomato (Grade A+)',
        qtyKg: 650,
        netRate: 23.50,
        totalCreditedRs: 15275.00,
        buyer: 'FreshMart Hypermarket',
        utr: 'SBIN90214892',
        weighTicket: 'WB-2026-991',
        brixAssay: '4.8° Brix',
        account: 'SBI ••••8842',
        status: 'SUCCESSFUL_DBT'
      },
      {
        id: 'DBT-985',
        date: '10 Sept 2026, 04:15 PM',
        lotId: 'LOT-2026-0908',
        crop: 'Tomato (Grade A)',
        qtyKg: 500,
        netRate: 22.80,
        totalCreditedRs: 11400.00,
        buyer: 'Whitefield Consumer Cluster',
        utr: 'SBIN90184412',
        weighTicket: 'WB-2026-874',
        brixAssay: '4.6° Brix',
        account: 'SBI ••••8842',
        status: 'SUCCESSFUL_DBT'
      },
      {
        id: 'DBT-971',
        date: '04 Sept 2026, 01:20 PM',
        lotId: 'LOT-2026-0830',
        crop: 'Green Capsicum',
        qtyKg: 300,
        netRate: 38.00,
        totalCreditedRs: 11400.00,
        buyer: 'Royal Palace Hotels',
        utr: 'SBIN90112948',
        weighTicket: 'WB-2026-720',
        brixAssay: '4.4° Brix',
        account: 'SBI ••••8842',
        status: 'SUCCESSFUL_DBT'
      }
    ],

    // Returns all active lots available for B2B buyers
    getAvailableLots() {
      return this.smallholderListings.filter(l => l.availableQtyKg > 0);
    },

    // AI Pricing algorithm for a farmer's harvest according to SIH 2026 PS-33
    calculateAIPrice(cropKey, quantityKg, qualityGrade = 'Grade A+', distanceKm = 3.2) {
      // Historical and live mandi benchmarks
      const benchmarks = {
        tomato: { mandiBase: 11.00, fairBase: 24.50, msp: 16.00, icon: '🍅', name: 'Tomato' },
        onion: { mandiBase: 14.50, fairBase: 25.00, msp: 18.00, icon: '🧅', name: 'Red Onion' },
        capsicum: { mandiBase: 22.00, fairBase: 39.50, msp: 25.00, icon: '🫑', name: 'Green Capsicum' },
        potato: { mandiBase: 12.00, fairBase: 21.00, msp: 15.00, icon: '🥔', name: 'Fresh Potato' },
        chilli: { mandiBase: 18.00, fairBase: 34.00, msp: 22.00, icon: '🌶️', name: 'Green Chilli' }
      };

      const meta = benchmarks[cropKey.toLowerCase()] || benchmarks.tomato;

      // Mandi deductions breakdown (traditional exploitative cuts: 5 intermediaries)
      const mandiDeductions = {
        headlineRate: meta.mandiBase + 3.00, // Nominal APMC board rate
        commissionAgentFee: 1.20, // 8% Arhatiya commission
        weighbridgeLoss: 0.90,    // 1.5 - 2.5 kg fraud per crate
        unloadingHamaali: 0.60,   // Manual labour cuts
        transportTractor: 1.80,   // Long distance line-haul to district APMC
        netMandiInHand: meta.mandiBase
      };

      // Quality multiplier
      let qualityMultiplier = 1.0;
      if (qualityGrade.includes('A+')) qualityMultiplier = 1.06;
      else if (qualityGrade.includes('B')) qualityMultiplier = 0.92;

      // FarmFlow Direct Gate Realization (Farmer Net Payout)
      const fairFarmgateRate = Math.round((meta.fairBase * qualityMultiplier) * 10) / 10;
      const totalFarmerTakeHome = Math.round(fairFarmgateRate * quantityKg);
      const mandiTotalTakeHome = Math.round(mandiDeductions.netMandiInHand * quantityKg);
      const extraCashInHand = totalFarmerTakeHome - mandiTotalTakeHome;
      const percentageGain = Math.round(((totalFarmerTakeHome - mandiTotalTakeHome) / mandiTotalTakeHome) * 100);

      // ======================================================================
      // 1. DYNAMIC 7-DAY PREDICTIVE PRICE CURVE & MARKET SIGNALS
      // ======================================================================
      const today = new Date();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecast7Days = [];
      const forecastDeltas = [0, 0.8, 1.9, 3.8, 3.4, 2.6, 1.7]; // Price trajectory reflecting mandi arrival dip & urban weekend demand

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dayLabel = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`);
        const delta = forecastDeltas[i];
        const projRate = Math.round((fairFarmgateRate + delta) * 10) / 10;
        const mandiProjected = Math.round((mandiDeductions.netMandiInHand + (delta * 0.45)) * 10) / 10;

        forecast7Days.push({
          dayIndex: i,
          dayLabel,
          dateString: d.toISOString().split('T')[0],
          rateFarmgate: projRate,
          rateMandi: mandiProjected,
          deltaVsToday: delta,
          isPeak: i === 3,
          trend: i <= 3 ? 'RISING' : 'STABILIZING'
        });
      }

      // ======================================================================
      // 2. "SELL TODAY vs HOLD IN SOLAR COLD STORAGE" DECISION ENGINE
      // ======================================================================
      const peakDay = forecast7Days[3]; // Day +3 represents optimal price realization
      const coldStorageCostPerKgPerDay = 0.05; // ₹1.25 per 25-kg crate/day = ₹0.05/kg/day
      const storageDays = 3;
      const totalStorageFeeRs = Math.round(coldStorageCostPerKgPerDay * storageDays * quantityKg);
      const grossHoldTakeHome = Math.round(peakDay.rateFarmgate * quantityKg);
      const netHoldTakeHome = grossHoldTakeHome - totalStorageFeeRs;
      const holdingAdvantageNetRs = netHoldTakeHome - totalFarmerTakeHome;
      const holdingGainPct = Math.round(((netHoldTakeHome - totalFarmerTakeHome) / totalFarmerTakeHome) * 100);
      const instantPledgeCreditRs = Math.round(totalFarmerTakeHome * 0.70); // 70% immediate warehouse receipt loan

      const holdingAdvisor = {
        recommendedAction: holdingAdvantageNetRs > 800 ? 'HOLD_IN_COLD_ROOM' : 'SELL_TODAY',
        todayRate: fairFarmgateRate,
        todayTakeHome: totalFarmerTakeHome,
        peakDayLabel: peakDay.dayLabel,
        peakRate: peakDay.rateFarmgate,
        storageDays,
        storageRatePerKgDay: coldStorageCostPerKgPerDay,
        totalStorageFeeRs,
        netHoldTakeHome,
        holdingAdvantageNetRs,
        holdingGainPct,
        instantPledgeCreditRs,
        rationale: 'Heavy rains in Kolar reduce Bengaluru mandi arrivals by 38% over the next 72 hrs. Storing harvest in the village solar cold room for 3 days yields higher net bank realization even after storage rental.'
      };

      // ======================================================================
      // 3. TRANSPARENT 5-TIER FARM-TO-FORK PRICE WATERFALL (Exact Balance)
      // ======================================================================
      const transporterFreightPerKg = 4.50; // Guaranteed fair carrier payout
      const spokeHandlingAssayingPerKg = 2.50; // Digital weighing, NABL Brix grading, solar pre-cooling
      const platformEscrowFeePerKg = 1.50; // 100% bank escrow guarantee, zero payment delay
      const consumerPricePerKg = Math.round((fairFarmgateRate + transporterFreightPerKg + spokeHandlingAssayingPerKg + platformEscrowFeePerKg) * 10) / 10;
      const supermarketRetailPerKg = Math.round((consumerPricePerKg * 1.375) * 10) / 10;
      const consumerSavingsPerKg = Math.round((supermarketRetailPerKg - consumerPricePerKg) * 10) / 10;
      const consumerSavingsPct = Math.round((consumerSavingsPerKg / supermarketRetailPerKg) * 100);

      const priceWaterfall = {
        consumerPricePerKg,
        supermarketRetailPerKg,
        consumerSavingsPerKg,
        consumerSavingsPct,
        breakdown: [
          {
            key: 'FARMER',
            label: 'Farmer Direct Net Bank Payout (Take-Home)',
            amount: fairFarmgateRate,
            pct: Math.round((fairFarmgateRate / consumerPricePerKg) * 1000) / 10,
            icon: '👨‍🌾',
            color: '#16a34a'
          },
          {
            key: 'LOGISTICS',
            label: 'Transporter Freight & Reefer Cold-Chain',
            amount: transporterFreightPerKg,
            pct: Math.round((transporterFreightPerKg / consumerPricePerKg) * 1000) / 10,
            icon: '🚚',
            color: '#0284c7'
          },
          {
            key: 'SPOKE',
            label: 'Village Spoke Weighbridge, Assaying & Solar Cooling',
            amount: spokeHandlingAssayingPerKg,
            pct: Math.round((spokeHandlingAssayingPerKg / consumerPricePerKg) * 1000) / 10,
            icon: '🏛️',
            color: '#8b5cf6'
          },
          {
            key: 'PLATFORM',
            label: 'Bank Escrow Guarantee & Quality Assurance',
            amount: platformEscrowFeePerKg,
            pct: Math.round((platformEscrowFeePerKg / consumerPricePerKg) * 1000) / 10,
            icon: '🔒',
            color: '#eab308'
          }
        ]
      };

      // ======================================================================
      // 4. TRANSPORTER PARITY ECONOMICS ("Best for Logistics like Farmer")
      // ======================================================================
      const transporterFreightTotalRs = Math.round(quantityKg * transporterFreightPerKg);
      const backhaulEarningsRs = 750; // Automated return cargo match
      const evFuelCostRs = 95; // EV loader energy cost for 30 km vs ₹480 for diesel tempo
      const dieselFuelCostRs = 480;
      const netTransporterTakeHomeRs = transporterFreightTotalRs + backhaulEarningsRs - evFuelCostRs;
      const transporterAdvantageRs = netTransporterTakeHomeRs - (transporterFreightTotalRs - dieselFuelCostRs);

      const transporterParity = {
        freightRatePerKg: transporterFreightPerKg,
        freightTotalRs: transporterFreightTotalRs,
        backhaulCargoMatched: '40 Bags Organic Bio-Fertilizer (City Depot ➔ Kolar FPO Spoke)',
        backhaulEarningsRs,
        evFuelCostRs,
        dieselFuelCostRs,
        fuelSavingsRs: dieselFuelCostRs - evFuelCostRs,
        netTransporterTakeHomeRs,
        transporterAdvantageRs,
        coldChainBonusPct: 5, // +5% bonus for maintaining 4°C-8°C
        paymentWindow: 'Instant Bank DBT within 2 Hours of Spoke Weighbridge'
      };

      // Top matching institutional buyers for this produce
      const matchedBuyers = [
        {
          id: 'BUYER-01',
          name: 'FreshMart Hypermarket Pvt. Ltd.',
          type: 'Organized Retail Chain',
          icon: '🏬',
          offeredRate: fairFarmgateRate + 2.50, // Gross wholesale headline rate
          netFarmerTakeHome: fairFarmgateRate,
          escrowDeposit: totalFarmerTakeHome + Math.round(quantityKg * 3.00),
          escrowStatus: '100% SECURED_IN_BANK',
          pickupTime: 'Today 10:30 AM (Farmgate EV Loader)'
        },
        {
          id: 'BUYER-02',
          name: 'Royal Palace Hotels & Luxury Dining',
          type: 'B2B Hospitality Group',
          icon: '🏨',
          offeredRate: fairFarmgateRate + 3.20,
          netFarmerTakeHome: fairFarmgateRate + 0.70,
          escrowDeposit: Math.round((fairFarmgateRate + 0.70) * quantityKg),
          escrowStatus: '100% SECURED_IN_BANK',
          pickupTime: 'Today 11:15 AM (Solar Reefer Van)'
        },
        {
          id: 'BUYER-03',
          name: 'Whitefield & Bangalore Consumer Clusters',
          type: 'Housing Societies Group-Buy',
          icon: '🏘️',
          offeredRate: fairFarmgateRate + 2.00,
          netFarmerTakeHome: fairFarmgateRate,
          escrowDeposit: totalFarmerTakeHome,
          escrowStatus: '100% SECURED_IN_BANK',
          pickupTime: 'Today 12:00 PM (Batch Consolidated Pickup)'
        }
      ];

      return {
        meta,
        quantityKg,
        fairFarmgateRate,
        mandiDeductions,
        totalFarmerTakeHome,
        mandiTotalTakeHome,
        extraCashInHand,
        percentageGain,
        forecast7Days,
        holdingAdvisor,
        priceWaterfall,
        transporterParity,
        matchedBuyers
      };
    },

    // Farmer submits a new produce listing or completes a sale
    createFarmerListing(listingInput) {
      const id = `LOT-2026-${Date.now().toString().slice(-4)}`;
      const cropKey = (listingInput.crop || 'tomato').toLowerCase();

      const aiData = this.calculateAIPrice(cropKey, Number(listingInput.qtyKg) || 500, listingInput.variety || 'Grade A+');

      const newLot = {
        id,
        farmerId: listingInput.farmerId || 'FARMER-01',
        farmerName: listingInput.farmerName || 'Ramesh Patel',
        farmerVillage: listingInput.farmerVillage || 'Vokkaleri Village, Kolar',
        crop: aiData.meta.name,
        variety: listingInput.variety || 'Grade A+ Certified',
        category: listingInput.category || 'solanaceous',
        qtyKg: Number(listingInput.qtyKg) || 500,
        availableQtyKg: Number(listingInput.qtyKg) || 500,
        harvestDate: listingInput.harvestDate || new Date().toISOString().split('T')[0],
        spokeId: 'eNAM-SPOKE-KA-KOLAR-04',
        spokeName: 'Vokkaleri e-NAM Village Sub-Spoke',
        farmerRatePerKg: aiData.fairFarmgateRate,
        logisticsPerKg: aiData.priceWaterfall.breakdown[1].amount,
        spokeFeePerKg: aiData.priceWaterfall.breakdown[2].amount,
        platformFeePerKg: aiData.priceWaterfall.breakdown[3].amount,
        consumerPricePerKg: aiData.priceWaterfall.consumerPricePerKg,
        supermarketPricePerKg: aiData.priceWaterfall.supermarketRetailPerKg,
        wholesaleRatePerKg: Math.round((aiData.fairFarmgateRate + 2.50) * 10) / 10,
        brixSugar: '4.8° Brix',
        firmness: 'Firm Table Grade',
        shelfLifeDays: 8,
        priceWaterfall: aiData.priceWaterfall,
        transporterParity: aiData.transporterParity,
        holdingAdvisor: aiData.holdingAdvisor,
        forecast7Days: aiData.forecast7Days,
        status: 'AVAILABLE_FOR_SOURCING',
        matchedBuyer: null,
        escrowLocked: false,
        icon: aiData.meta.icon
      };

      this.smallholderListings.unshift(newLot);

      // Sync into window.FF_DATA.products for Consumer Store with full transparency breakdown
      if (window.FF_DATA && Array.isArray(window.FF_DATA.products)) {
        window.FF_DATA.products.unshift({
          id: `PROD-${id}`,
          name: `Farm-Fresh ${newLot.crop} (${newLot.variety})`,
          hindiName: `खेत से सीधे ताजा ${newLot.crop}`,
          category: newLot.category,
          grade: newLot.variety,
          farmerId: newLot.farmerId,
          farmerName: newLot.farmerName,
          farmerVillage: newLot.farmerVillage,
          harvestTimestamp: `Harvested ${newLot.harvestDate}, 06:00 AM`,
          icon: newLot.icon,
          unit: 'kg',
          pricePerKg: newLot.consumerPricePerKg,
          supermarketPrice: newLot.supermarketPricePerKg,
          farmerPayout: newLot.farmerRatePerKg,
          logisticsCost: newLot.logisticsPerKg,
          platformFee: newLot.platformFeePerKg,
          wasteSavedPct: 26,
          stockKg: newLot.qtyKg,
          rating: 4.9,
          reviewsCount: 1,
          priceWaterfall: newLot.priceWaterfall,
          description: `Direct harvest from ${newLot.farmerName}, ${newLot.farmerVillage}. Pre-cooled at village solar spoke with 0 middleman margin.`
        });
      }

      // Sync into Farmer's active listings
      if (window.FF_DATA && window.FF_DATA.currentFarmer) {
        window.FF_DATA.currentFarmer.activeListings.unshift({
          id: newLot.id,
          crop: `${newLot.crop} (${newLot.variety})`,
          qtyKg: newLot.qtyKg,
          targetRate: newLot.wholesaleRatePerKg,
          netExpected: newLot.farmerRatePerKg,
          harvestDate: newLot.harvestDate,
          spoke: newLot.spokeName,
          status: 'LISTED_IN_MARKET'
        });
      }

      return newLot;
    },

    // Completes end-to-end deal execution with farmgate transport & instant DBT
    executeSaleWithTransport(lotId, buyerId, vehicleType, qtyKg) {
      const lot = this.smallholderListings.find(l => l.id === lotId) || this.smallholderListings[0];
      const buyerMap = {
        'BUYER-01': { name: 'FreshMart Hypermarket Pvt. Ltd.', type: 'Organized Retail' },
        'BUYER-02': { name: 'Royal Palace Hotels & Luxury Dining', type: 'Hospitality Group' },
        'BUYER-03': { name: 'Whitefield Consumer Clusters', type: 'Apartment Collective' }
      };
      const buyer = buyerMap[buyerId] || buyerMap['BUYER-01'];

      const vehicleInfo = {
        'E_LOADER': { model: 'Mahindra Zor Grand EV Loader', plate: 'KA-03-D-9912', driver: 'Kiran Kumar', eta: '12 mins' },
        'REEFER': { model: 'Tata Ace Reefer (Solar 4°C)', plate: 'KA-04-E-1029', driver: 'Manjunath Gowda', eta: '18 mins' },
        'TRACTOR': { model: 'Spoke Electric Tractor Trolley', plate: 'KA-03-TR-881', driver: 'Raju Naik', eta: '25 mins' }
      }[vehicleType] || { model: 'Mahindra Zor Grand EV Loader', plate: 'KA-03-D-9912', driver: 'Kiran Kumar', eta: '12 mins' };

      const volume = Number(qtyKg) || lot.qtyKg;
      const netTotal = Math.round(volume * lot.farmerRatePerKg);
      const grossTotal = Math.round(volume * lot.wholesaleRatePerKg);
      const freightTotal = Math.round(volume * 4.50);
      const utr = `SBIN${Date.now().toString().slice(-8)}`;
      const orderNo = `ORD-2026-${Date.now().toString().slice(-4)}`;

      // 1. Update lot status
      lot.availableQtyKg = Math.max(0, lot.availableQtyKg - volume);
      lot.status = 'IN_TRANSIT';
      lot.matchedBuyer = buyer.name;
      lot.escrowLocked = true;

      // 2. Create Order in Ledger
      const order = {
        orderId: orderNo,
        lotId: lot.id,
        buyerId,
        buyerName: buyer.name,
        buyerType: buyer.type,
        farmerId: lot.farmerId,
        farmerName: lot.farmerName,
        crop: `${lot.crop} (${lot.variety})`,
        qtyKg: volume,
        headlineRate: lot.wholesaleRatePerKg,
        netFarmerTakeHome: lot.farmerRatePerKg,
        totalGrossRs: grossTotal,
        totalFarmerPayoutRs: netTotal,
        freightPayoutRs: freightTotal,
        backhaulCargo: '40 Bags Organic Bio-Fertilizer (City Depot ➔ Kolar FPO Spoke)',
        backhaulEarningsRs: 750,
        escrowDepositRs: grossTotal,
        escrowStatus: '100% SECURED_IN_BANK',
        vehicleAssigned: `${vehicleInfo.plate} (${vehicleInfo.model})`,
        driverName: vehicleInfo.driver,
        driverPhone: '+91 88612 99014',
        pickupLocation: `${lot.farmerVillage}`,
        deliveryLocation: lot.spokeName,
        status: 'PICKUP_DISPATCHED',
        utrNumber: utr
      };
      this.ordersLedger.unshift(order);

      // 3. Add to DBT Passbook
      const dbtRecord = {
        id: `DBT-${Date.now().toString().slice(-3)}`,
        date: 'Today, Just Now',
        lotId: lot.id,
        crop: `${lot.crop} (${lot.variety})`,
        qtyKg: volume,
        netRate: lot.farmerRatePerKg,
        totalCreditedRs: netTotal,
        buyer: buyer.name,
        utr: utr,
        weighTicket: `WB-2026-${Math.floor(100 + Math.random() * 900)}`,
        brixAssay: lot.brixSugar || '4.8° Brix',
        account: 'SBI ••••8842',
        status: 'SUCCESSFUL_DBT'
      };
      this.dbtPassbookRecords.unshift(dbtRecord);

      // 4. Update Farmer Wallet & Totals in window.FF_DATA
      if (window.FF_DATA && window.FF_DATA.currentFarmer) {
        window.FF_DATA.currentFarmer.walletBalanceRs += netTotal;
        window.FF_DATA.currentFarmer.totalSoldKg += volume;
        window.FF_DATA.currentFarmer.totalEarningsRs += netTotal;

        // Update first active listing status
        if (window.FF_DATA.currentFarmer.activeListings.length > 0) {
          window.FF_DATA.currentFarmer.activeListings[0].status = 'DISPATCHED_DBT_LOCKED';
        }
      }

      // 5. Generate dispatch order in Logistics portal with full parity economics
      if (window.FF_DATA && Array.isArray(window.FF_DATA.activeFleetRoutes)) {
        window.FF_DATA.activeFleetRoutes.unshift({
          vehicleId: vehicleInfo.plate,
          type: vehicleInfo.model,
          driver: vehicleInfo.driver,
          status: 'EN_ROUTE_FARMGATE',
          currentTempC: 6.2,
          batteryPct: 88,
          currentLoadKg: volume,
          freightEarnedRs: freightTotal,
          backhaulCargo: '40 Bags Organic Bio-Fertilizer (City Depot ➔ Kolar FPO Spoke)',
          backhaulBonusRs: 750,
          stops: [
            { name: `${lot.farmerName} Farm, ${lot.farmerVillage}`, type: 'FARMGATE_PICKUP', eta: vehicleInfo.eta, status: 'NEXT' },
            { name: lot.spokeName, type: 'SPOKE_INTAKE', eta: '+25 mins', status: 'PENDING' },
            { name: 'City Retail Receiving Dock Gate 3', type: 'DOCK_DELIVERY', eta: '+1 hr 15 mins', status: 'PENDING' }
          ]
        });
      }

      return {
        order,
        dbtRecord,
        vehicleInfo,
        netTotal,
        grossTotal,
        freightTotal,
        utr
      };
    }
  };
})();
