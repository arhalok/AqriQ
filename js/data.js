/**
 * FarmFlow - Production Canonical Seed Fixtures & Operational Datasets
 * Zero-dependency: Exposes window.FF_DATA for direct browser execution.
 */

(function () {
  'use strict';

  window.FF_DATA = {
    // Current Active Farmer Profile
    currentFarmer: {
      id: 'FARMER-01',
      name: 'Ramesh Patel',
      phone: '+91 98451 22390',
      location: 'Vokkaleri Village, Kolar, Karnataka',
      acres: 3.5,
      fpoId: 'FPO-01',
      fpoName: 'GreenRoots Kisan Producer Co.',
      bankName: 'State Bank of India',
      accountMasked: '•••• •••• 8842',
      ifsc: 'SBIN0004120',
      dbtStatus: 'VERIFIED_AADHAAR_LINKED',
      trustScore: 98.6,
      walletBalanceRs: 42350,
      totalSoldKg: 14200,
      totalEarningsRs: 333700,
      activeListings: [
        { id: 'LST-101', crop: 'Tomato (Grade A+)', qtyKg: 650, targetRate: 26.00, netExpected: 23.50, harvestDate: '2026-09-15', spoke: 'Kolar Spoke Cold Hub', status: 'MATCHED_ORDER' },
        { id: 'LST-102', crop: 'Green Capsicum', qtyKg: 300, targetRate: 42.00, netExpected: 38.60, harvestDate: '2026-09-18', spoke: 'Kolar Spoke Cold Hub', status: 'SPOKE_WEIGHING' }
      ]
    },

    // e-NAM (National Agriculture Market) Last-Mile Village Spoke Extension
    enamExtension: {
      spokeId: 'eNAM-SPOKE-KA-KOLAR-04',
      spokeName: 'Vokkaleri Village e-NAM Sub-Spoke (ग्राम पंचायत केंद्र)',
      distanceKm: 3.2,
      operatorFPO: 'GreenRoots Kisan Producer Co. (NABARD Supported)',
      roleDescription: 'Powers the missing Last-Mile of e-NAM: Farmgate pickup, village digital Brix assaying, FPO aggregation for smallholders, and distress solar cold storage with instant DBT.',
      nationalClearingRateRs: 26.00,
      localApmcMandiRateRs: 11.00,
      mspFloorRateRs: 18.50,
      assayAccreditation: 'Govt. NABL Certified Digital Brix Refractometer & AI Leaf Scanner',
      activeTradingLots: 14
    },

    // Colloquial Illiterate-Friendly Audio Voice Scripts (Hindi & English)
    kisanVoiceAdvisories: {
      hi: {
        welcome: 'नमस्ते रमेश जी! फार्मफ्लो ई-नाम विलेज स्पोक में आपका स्वागत है। आज टमाटर का सीधा भाव 26 रुपये है, जबकि मंडी में केवल 11 रुपये मिल रहे हैं। अपनी फसल बेचने के लिए हरा बटन दबाएं।',
        sell: 'फसल बेचें: यहाँ आप सीधे सुपरमार्केट और सोसायटियों को बिना किसी आढ़तिया कमीशन के अपनी फसल बेच सकते हैं। तुरंत पक्का बैंक भाव मिलेगा।',
        demands: 'खरीदार मांगें: यहाँ देखें कि कौन सा खरीदार कितना माल खरीद रहा है और क्या भाव दे रहा है। एक क्लिक में सौदा पक्का करें।',
        transport: 'खेत से गाड़ी बुलाएं: 15 मिनट में आपके खेत के दरवाजे पर ई-लोडर या पिकअप आ जाएगा। आपको मंडी जाने के लिए धक्के खाने की जरूरत नहीं है।',
        weighbridge: 'डिजिटल धर्मकांटा: गाँव के स्पोक पर सटीक कंप्यूटर कांटा और मिठास जांच। तौल पर्ची कटते ही आपके बैंक खाते में तुरंत पूरे पैसे जमा हो जाएंगे।',
        distress: 'सावधान! मंडी में आज दाम गिरकर 9 रुपये हो गए हैं। घाटे में न बेचें। सोलर कोल्ड रूम में फसल रखें और 70% अग्रिम पैसा अभी खाते में पाएं।',
        doctor: 'फसल डॉक्टर: खराब या बीमार पत्ते की फोटो खींचें और 2 सेकंड में जैविक खाद और घरेलू उपचार जानें।',
        storage: 'सोलर कोल्ड स्टोरेज: जब मंडी में भाव गिर जाए, तो फसल को गाँव के सोलर कोल्ड रूम में सुरक्षित रखें और भाव बढ़ने पर बेचें।'
      },
      en: {
        welcome: 'Welcome Ramesh Patel. Today tomato direct rate is 26 rupees, compared to only 11 rupees in Mandi. Tap the green button to sell your harvest lot directly.',
        sell: 'Sell Produce: Sell directly to supermarkets and housing societies with zero middlemen commissions and guaranteed bank payment.',
        demands: 'Buyer Demands: View live purchase orders with locked bank escrow and guaranteed rates.',
        transport: 'Book Farm Vehicle: Call an electric loader or refrigerated tempo to your farm gate in 15 minutes.',
        weighbridge: 'Digital Weighbridge: Certified load-cell weighing and sugar assay at village spoke with instant bank DBT payout.',
        distress: 'Price crash alert! APMC Mandi price dropped to 9 rupees. Store in solar cold room and receive 70% cash advance immediately.',
        doctor: 'Crop Doctor: Scan diseased leaves to get instant ICAR certified organic and chemical cures.',
        storage: 'Solar Cold Storage: Store produce at village farmgate solar rooms to prevent distress selling during market gluts.'
      }
    },

    // 4 Representative FPO Smallholder Members
    farmers: [
      {
        id: 'FARMER-01',
        name: 'Ramesh Patel',
        village: 'Vokkaleri, Kolar',
        crop: 'Tomato (Grade A+)',
        qtyKg: 650,
        allocatedQuotaKg: 650,
        intakeStatus: 'WEIGHED_CERTIFIED',
        scaleTicketNo: 'WB-2026-991',
        brixAssay: '4.8° Brix',
        shareCapitalRs: 2000,
        totalDisbursedRs: 15275,
        rating: 4.9
      },
      {
        id: 'FARMER-02',
        name: 'Suresh Gowda',
        village: 'Malur, Kolar',
        crop: 'Tomato & Red Onion',
        qtyKg: 500,
        allocatedQuotaKg: 500,
        intakeStatus: 'WEIGHED_CERTIFIED',
        scaleTicketNo: 'WB-2026-992',
        brixAssay: '4.6° Brix',
        shareCapitalRs: 2000,
        totalDisbursedRs: 11750,
        rating: 4.8
      },
      {
        id: 'FARMER-03',
        name: 'Meena Bai',
        village: 'Bangarapet, Kolar',
        crop: 'Tomato (Grade A)',
        qtyKg: 850,
        allocatedQuotaKg: 850,
        intakeStatus: 'EN_ROUTE_SPOKE',
        scaleTicketNo: 'PENDING_ARRIVAL',
        brixAssay: '4.7° Brix (Pre-assay)',
        shareCapitalRs: 2000,
        totalDisbursedRs: 19975,
        rating: 4.9
      },
      {
        id: 'FARMER-04',
        name: 'Anita Devi',
        village: 'Srinivaspur, Kolar',
        crop: 'Green Capsicum & Buffer Tomato',
        qtyKg: 400,
        allocatedQuotaKg: 200,
        intakeStatus: 'STANDBY_RESERVE',
        scaleTicketNo: 'BUFFER_LOT_404',
        brixAssay: '4.9° Brix',
        shareCapitalRs: 2000,
        totalDisbursedRs: 4700,
        rating: 4.7
      }
    ],

    // FPO Cooperative Profile & Operational Data
    fpoInfo: {
      id: 'FPO-01',
      name: 'GreenRoots Kisan Producer Co. Ltd.',
      regNo: 'CIN: U01409KA2024PTC188219',
      boardHead: 'Shri Narayanaswamy (Chairman)',
      manager: 'R. K. Verma (Operations CEO)',
      headquarters: 'APMC Market Yard Road, Kolar',
      totalMembers: 242,
      activeDistricts: ['Kolar', 'Chintamani', 'Malur', 'Bangarapet'],
      aggregationTargetKg: 2200,
      collectedSoFarKg: 2000,
      totalDisbursedThisMonthRs: 432400,
      cooperativeMarginPct: 3.0, // 3% sustainable FPO service margin
      coldStorageCapacityCrates: 2500,
      coldStorageOccupiedCrates: 1660,
      inputInventory: [
        { item: 'Hybrid High-Yield Tomato Seedlings (Pack of 500)', stock: '320 Trays', memberDiscount: '25% OFF Bulk Rate', price: '₹ 420' },
        { item: 'Organic Neem Seed Extract (NSKE 10,000 ppm - 1 Litre)', stock: '140 Cans', memberDiscount: '20% OFF MRP', price: '₹ 380' },
        { item: 'Ventilated Plastic Harvest Crates (25 kg Capacity)', stock: '850 Crates', memberDiscount: 'Subsidized Rental', price: '₹ 1.20/day' }
      ]
    },

    // Consumer & B2B E-Commerce Catalog
    products: [
      {
        id: 'PROD-01',
        name: 'Farm-Fresh Native Tomatoes',
        hindiName: 'खेत से सीधे देशी टमाटर',
        category: 'solanaceous',
        grade: 'Grade A+ Export',
        farmerId: 'FARMER-01',
        farmerName: 'Ramesh Patel',
        farmerVillage: 'Vokkaleri, Kolar (42 km from City)',
        harvestTimestamp: 'Harvested Today, 05:30 AM',
        icon: '🍅',
        unit: 'kg',
        pricePerKg: 32.00,
        supermarketPrice: 44.00,
        farmerPayout: 23.50,
        logisticsCost: 4.50,
        platformFee: 2.00,
        wasteSavedPct: 24,
        stockKg: 1200,
        rating: 4.9,
        reviewsCount: 142,
        description: 'Juicy, farm-ripened tomatoes sorted and pre-cooled at village solar spoke. Delivered within 6 hours of harvest.'
      },
      {
        id: 'PROD-02',
        name: 'Crisp Green Bell Capsicum',
        hindiName: 'ताजा कुरकुरी शिमला मिर्च',
        category: 'solanaceous',
        grade: 'Grade A Polyhouse',
        farmerId: 'FARMER-04',
        farmerName: 'Anita Devi',
        farmerVillage: 'Srinivaspur, Kolar',
        harvestTimestamp: 'Harvested Yesterday Evening',
        icon: '🫑',
        unit: 'kg',
        pricePerKg: 48.00,
        supermarketPrice: 68.00,
        farmerPayout: 38.60,
        logisticsCost: 5.40,
        platformFee: 4.00,
        wasteSavedPct: 22,
        stockKg: 650,
        rating: 4.8,
        reviewsCount: 89,
        description: 'Vibrant green, thick-walled capsicum grown under protected polyhouse conditions and transported in refrigerated temperature.'
      },
      {
        id: 'PROD-03',
        name: 'Sun-Cured Malur Red Onions',
        hindiName: 'मालूर के खेत-सूखे लाल प्याज',
        category: 'tubers',
        grade: 'Grade A Medium-Large',
        farmerId: 'FARMER-02',
        farmerName: 'Suresh Gowda',
        farmerVillage: 'Malur, Kolar',
        harvestTimestamp: 'Cured & Graded 2 Days Ago',
        icon: '🧅',
        unit: 'kg',
        pricePerKg: 34.00,
        supermarketPrice: 46.00,
        farmerPayout: 25.80,
        logisticsCost: 4.20,
        platformFee: 2.50,
        wasteSavedPct: 18,
        stockKg: 1800,
        rating: 4.8,
        reviewsCount: 210,
        description: 'Traditional pungent red onions dried naturally in field solar sheds. High dry-matter content ensures 4+ weeks storage.'
      },
      {
        id: 'PROD-04',
        name: 'Golden Mountain Farm Potatoes',
        hindiName: 'पहाड़ी फार्म के सुनहरे आलू',
        category: 'tubers',
        grade: 'Grade A Table Grade',
        farmerId: 'FARMER-03',
        farmerName: 'Meena Bai',
        farmerVillage: 'Bangarapet, Kolar',
        harvestTimestamp: 'Sorted Today Morning',
        icon: '🥔',
        unit: 'kg',
        pricePerKg: 26.00,
        supermarketPrice: 38.00,
        farmerPayout: 19.50,
        logisticsCost: 3.80,
        platformFee: 1.70,
        wasteSavedPct: 19,
        stockKg: 2400,
        rating: 4.7,
        reviewsCount: 165,
        description: 'Thin-skinned golden potatoes freshly dug and sorted. Ideal for steaming, boiling, and curry cooking.'
      },
      {
        id: 'PROD-05',
        name: 'Spicy Pungent Green Chillies',
        hindiName: 'तीखी देसी हरी मिर्च',
        category: 'condiments',
        grade: 'Grade A G-4 Variety',
        farmerId: 'FARMER-04',
        farmerName: 'Anita Devi',
        farmerVillage: 'Srinivaspur, Kolar',
        harvestTimestamp: 'Handpicked Today, 06:00 AM',
        icon: '🌶️',
        unit: '500g',
        pricePerKg: 28.00,
        supermarketPrice: 42.00,
        farmerPayout: 21.00,
        logisticsCost: 4.00,
        platformFee: 2.00,
        wasteSavedPct: 25,
        stockKg: 350,
        rating: 4.9,
        reviewsCount: 78,
        description: 'Dark green slender chillies packed in ventilated farm crates with crisp green stems intact.'
      },
      {
        id: 'PROD-06',
        name: 'Kisan Weekly Farm Basket (7kg Family Box)',
        hindiName: 'किसान वीकली फैमिली बास्केट (7 किलो)',
        category: 'combos',
        grade: 'Assorted Grade A Selection',
        farmerId: 'FARMER-01',
        farmerName: 'GreenRoots Collective FPO',
        farmerVillage: 'Kolar Agro-Corridor Spoke Point',
        harvestTimestamp: 'Fresh Morning Consolidation',
        icon: '🧺',
        unit: 'box (7kg)',
        pricePerKg: 239.00,
        supermarketPrice: 340.00,
        farmerPayout: 182.00,
        logisticsCost: 32.00,
        platformFee: 15.00,
        wasteSavedPct: 30,
        stockKg: 200,
        rating: 5.0,
        reviewsCount: 340,
        description: 'Complete family box: 2kg Tomatoes, 2kg Potatoes, 1.5kg Onions, 500g Capsicum, 500g Chillies & seasonal farm greens.'
      },
      {
        id: 'PROD-07',
        name: 'Rajasthan Farm Fresh Tomatoes (FPO Direct)',
        hindiName: 'राजस्थान एफपीओ सीधे खेत के देशी टमाटर',
        category: 'solanaceous',
        grade: 'Grade A Farmgate Lot',
        farmerId: 'FPO-RAJ-01',
        farmerName: 'Rajasthan Vegetable FPO',
        farmerVillage: 'Jaipur Agro Hub, Rajasthan',
        harvestTimestamp: 'Harvested Today Morning',
        icon: '🍅',
        unit: 'kg',
        pricePerKg: 18.00,
        supermarketPrice: 40.00,
        farmerPayout: 15.50,
        logisticsCost: 1.80,
        platformFee: 0.70,
        wasteSavedPct: 28,
        stockKg: 1000,
        rating: 4.9,
        reviewsCount: 94,
        description: 'Direct listing from Rajasthan Vegetable FPO: 1,000 kg lot available for direct purchase by Supermarkets, Hotels, Restaurants, and Consumers at ₹18/kg (vs ₹40/kg retail).'
      },
      {
        id: 'PROD-08',
        name: 'Hoskote Golden Sweet Corn (New Seller)',
        hindiName: 'होसकोटे का ताजा मीठा भुट्टा',
        category: 'condiments',
        grade: 'Grade A Export Cobs',
        farmerId: 'ACC-FARMER-02',
        farmerName: 'Somanna Gowda',
        farmerVillage: 'Hoskote East, Bengaluru Rural',
        harvestTimestamp: 'Harvested Today Morning',
        icon: '🌽',
        unit: 'kg',
        pricePerKg: 24.00,
        supermarketPrice: 38.00,
        farmerPayout: 18.50,
        logisticsCost: 3.50,
        platformFee: 2.00,
        wasteSavedPct: 22,
        stockKg: 650,
        rating: 4.8,
        reviewsCount: 12,
        isNewSeller: true,
        trustScore: 50.0,
        description: 'Direct listing from new smallholder seller Somanna Gowda. Baseline trust 50/100 with visible New Seller badge. Handpicked juicy sweet corn cobs.'
      }
    ],

    // APMC Mandis vs FarmFlow Benchmark Rates (₹/kg)
    mandiBenchmarks: {
      tomato: {
        name: 'Tomato (टमाटर)',
        icon: '🍅',
        unit: 'kg',
        mandiPrice: 16.00,
        mandiDeductions: { commissionPct: 8.5, cartageHamali: 2.20, weighmentDeduction: 1.10, transitWastePct: 15.0 },
        farmFlowPrice: 26.00,
        farmFlowDeductions: { directLogistics: 1.40, handlingSpoke: 0.60, platformTechFee: 0.50 }
      },
      onion: {
        name: 'Onion (प्याज)',
        icon: '🧅',
        unit: 'kg',
        mandiPrice: 22.00,
        mandiDeductions: { commissionPct: 8.0, cartageHamali: 2.50, weighmentDeduction: 1.20, transitWastePct: 12.0 },
        farmFlowPrice: 32.00,
        farmFlowDeductions: { directLogistics: 1.60, handlingSpoke: 0.70, platformTechFee: 0.60 }
      },
      potato: {
        name: 'Potato (आलू)',
        icon: '🥔',
        unit: 'kg',
        mandiPrice: 18.00,
        mandiDeductions: { commissionPct: 7.5, cartageHamali: 2.00, weighmentDeduction: 1.00, transitWastePct: 10.0 },
        farmFlowPrice: 25.00,
        farmFlowDeductions: { directLogistics: 1.30, handlingSpoke: 0.50, platformTechFee: 0.50 }
      },
      capsicum: {
        name: 'Capsicum (शिमला मिर्च)',
        icon: '🫑',
        unit: 'kg',
        mandiPrice: 28.00,
        mandiDeductions: { commissionPct: 9.0, cartageHamali: 3.00, weighmentDeduction: 1.50, transitWastePct: 18.0 },
        farmFlowPrice: 42.00,
        farmFlowDeductions: { directLogistics: 2.00, handlingSpoke: 0.80, platformTechFee: 0.80 }
      }
    },

    // Solar Micro-Cold Storages in Kolar Agro-Corridor
    coldStorages: [
      {
        id: 'CS-01',
        name: 'Kolar Solar Kisan Cold Spoke',
        location: 'Vokkaleri Cross, Kolar',
        distanceKm: 4.2,
        totalCrates: 2500,
        availableCrates: 840,
        tempC: '4°C - 8°C',
        ratePerCrateDay: '₹ 1.25 / crate / day',
        powerSource: '100% Solar PV with 12-hr Thermal Storage',
        manager: 'Anand Murthy (+91 94481 09211)'
      },
      {
        id: 'CS-02',
        name: 'Malur Farm-Gate Cooling Chamber',
        location: 'Malur Spoke Point',
        distanceKm: 9.6,
        totalCrates: 1800,
        availableCrates: 420,
        tempC: '2°C - 6°C',
        ratePerCrateDay: '₹ 1.30 / crate / day',
        powerSource: 'Hybrid Solar + Biomass Backup',
        manager: 'S. N. Kumar (+91 98860 33412)'
      },
      {
        id: 'CS-03',
        name: 'Chintamani FPO Cold Hub',
        location: 'Chintamani Bypass Road',
        distanceKm: 14.5,
        totalCrates: 3200,
        availableCrates: 1650,
        tempC: '5°C - 10°C',
        ratePerCrateDay: '₹ 1.15 / crate / day',
        powerSource: 'Rooftop Solar Array',
        manager: 'Venkatesh Rao (+91 97412 88201)'
      }
    ],

    // Hyperlocal Weather Feed (Kolar Agro Zone)
    weatherFeed: {
      temp: '27°C',
      condition: 'Partly Sunny with Light Breeze',
      humidity: '68%',
      windSpeed: '11 km/h',
      rainfallForecast: 'No rain predicted next 48 hrs (0% PoP)',
      sprayAdvisory: {
        status: 'OPTIMAL_SPRAY_WINDOW',
        recommendation: 'Optimal weather for preventive organic copper spray or foliar nutrient feed. Spray early morning (7:00 AM - 9:30 AM).'
      }
    },

    // B2B Buyers & Forward Demand
    buyers: [
      {
        id: 'BUYER-01',
        name: 'FreshMart Hypermarket Pvt. Ltd.',
        procurementManager: 'Rajesh Nair',
        location: 'Bengaluru Central Distribution Hub',
        demandCrop: 'Tomato (Grade A+)',
        demandQtyKg: 1500,
        agreedRate: 26.00,
        deliveryWindow: 'Tomorrow, 06:00 AM - 08:00 AM',
        escrowLocked: '₹ 39,000 (100% Escrow Secured)',
        trustScore: 99.1
      },
      {
        id: 'BUYER-02',
        name: 'Nature’s Organic Kitchen & Hotel Chain',
        procurementManager: 'Priya Sharma',
        location: 'Indiranagar Hub, Bengaluru',
        demandCrop: 'Green Capsicum & Tomato',
        demandQtyKg: 700,
        agreedRate: 42.00,
        deliveryWindow: 'Tomorrow, 07:00 AM',
        escrowLocked: '₹ 29,400 (Escrow Secured)',
        trustScore: 97.5
      }
    ],

    // Consumer Housing Society Clusters
    consumerClusters: [
      {
        id: 'CLUSTER-01',
        name: 'Whitefield Green Residency Group',
        households: 120,
        deliveryHub: 'Whitefield Community Gate 2',
        currentPoolKg: 615,
        targetPoolKg: 700,
        clusterDiscountPct: 20.0,
        savingVsRetailPct: 25.5,
        lastMileVehicle: 'KA-03-D-9912 (Zero-Emission E-Loader)'
      },
      {
        id: 'CLUSTER-02',
        name: 'Koramangala Eco Living Society',
        households: 85,
        deliveryHub: 'Eco Club House Cross',
        currentPoolKg: 420,
        targetPoolKg: 450,
        clusterDiscountPct: 20.0,
        savingVsRetailPct: 24.0,
        lastMileVehicle: 'KA-03-E-1144 (Electric Van)'
      }
    ],

    // On-Demand Farmgate Logistics Vehicle Types (Porter / Blinkit for Farm Produce)
    transportOptions: [
      {
        id: 'OPT_E_LOADER',
        name: 'Mahindra Zor Grand E-Loader',
        tag: '⚡ FAST VILLAGE PICKUP',
        icon: '🛵',
        capacityKg: 800,
        cratesCap: 32,
        baseFareRs: 140,
        perKmRs: 8,
        etaMins: 12,
        coldSupport: 'Insulated Thermal Cover',
        driverName: 'Kiran Gowda',
        driverPhone: '+91 88612 99014',
        rating: 4.9,
        desc: 'Zero-emission electric 3-wheeler designed for narrow village farm tracks. Ideal for 10-30 crates directly to the village spoke.'
      },
      {
        id: 'OPT_BOLERO',
        name: 'Bolero Maxi Insulated Pickup',
        tag: '🛡️ FARM POOLING TRUCK',
        icon: '🛻',
        capacityKg: 1600,
        cratesCap: 65,
        baseFareRs: 290,
        perKmRs: 14,
        etaMins: 18,
        coldSupport: 'Multi-layer Insulated Box',
        driverName: 'Manjunath Swamy',
        driverPhone: '+91 97412 88201',
        rating: 4.8,
        desc: 'Robust 1.5-ton pickup suited for bumpy field roads and larger harvests. Can pool loads from 2-3 adjacent farmer fields.'
      },
      {
        id: 'OPT_REEFER',
        name: '4-Ton Eicher Refrigerated Line-Haul',
        tag: '❄️ MULTI-TEMP CHILL ZONE (+4°C)',
        icon: '🚛',
        capacityKg: 4000,
        cratesCap: 160,
        baseFareRs: 650,
        perKmRs: 22,
        etaMins: 25,
        coldSupport: 'Active Refrigeration (+4°C to +8°C)',
        driverName: 'Manjunath',
        driverPhone: '+91 99002 44321',
        rating: 4.9,
        desc: 'Active chiller unit preserving perishables for long highway runs directly to city distribution hubs or hypermarket docks.'
      }
    ],

    // Available Nearby Loads for Transporter Partner Board ("Anyone Can Drive & Earn")
    partnerLoads: [
      {
        id: 'LOAD-881',
        farmerName: 'Ramesh Patel',
        phone: '+91 98451 22390',
        pickupVillage: 'Vokkaleri Village, Kolar (Field #4)',
        destHub: 'Kolar Solar Spoke (4.2 km)',
        crop: 'Native Tomato (Grade A+)',
        cratesCount: 26,
        weightKg: 650,
        offerFareRs: 340,
        pickupWindow: 'Ready Now • Urgent Farmgate',
        status: 'AVAILABLE'
      },
      {
        id: 'LOAD-882',
        farmerName: 'Suresh Gowda',
        phone: '+91 97311 00223',
        pickupVillage: 'Sugatur Cross, Kolar (Greenhouse 2)',
        destHub: 'Kolar Solar Spoke (7.8 km)',
        crop: 'Crisp Bell Capsicum',
        cratesCount: 40,
        weightKg: 800,
        offerFareRs: 490,
        pickupWindow: 'Today by 02:00 PM',
        status: 'AVAILABLE'
      },
      {
        id: 'LOAD-883',
        farmerName: 'Anita Devi',
        phone: '+91 99801 77210',
        pickupVillage: 'Srinivaspur Orchards',
        destHub: 'Hoskote Cross-Dock (22 km)',
        crop: 'Table Grade Potatoes',
        cratesCount: 60,
        weightKg: 1500,
        offerFareRs: 920,
        pickupWindow: 'Evening 05:00 PM',
        status: 'AVAILABLE'
      }
    ],

    // Active Harvest Contracts & Spoke Intake Journey (Farmer Hero Component)
    activeHarvestJourney: {
      contractId: 'HVT-2026-8812',
      buyerName: 'FreshMart Hypermarket',
      crop: 'Tomato (Grade A+ Export)',
      totalQtyKg: 650,
      agreedRate: 26.00,
      netTakeHomeRate: 23.50,
      totalDisbursedRs: 15275.00,
      pickupDriver: 'Kiran Gowda',
      pickupVehicle: 'KA-03-D-9912 (Mahindra E-Loader)',
      pickupPhone: '+91 88612 99014',
      scaleTicket: 'WB-2026-991',
      spokeName: 'Kolar Solar Pre-cooling Spoke',
      currentStep: 4, // 1: Deal Locked, 2: Farmgate Pickup, 3: Digital Weighbridge & Brix, 4: Bank Payout Settled
      steps: [
        {
          num: 1,
          title: 'Direct Contract Locked',
          time: '14 Sept, 08:30 AM',
          status: 'COMPLETED',
          desc: 'Locked @ ₹26.00/kg with FreshMart. Escrow secured in bank.'
        },
        {
          num: 2,
          title: 'Farmgate Transport Picked Up',
          time: '14 Sept, 10:15 AM',
          status: 'COMPLETED',
          desc: 'E-Loader KA-03-D-9912 loaded 26 crates at Vokkaleri farmgate.'
        },
        {
          num: 3,
          title: 'Digital Weighbridge & Brix Assay',
          time: '14 Sept, 11:30 AM',
          status: 'COMPLETED',
          desc: 'Verified 650.0 kg net weight. Brix sugar assay: 4.8° (Grade A+).'
        },
        {
          num: 4,
          title: 'Instant Bank DBT Deposited',
          time: '14 Sept, 11:42 AM',
          status: 'COMPLETED',
          desc: '₹15,275 credited to SBI A/c ••••8842. UTR: SBIN90214892'
        }
      ]
    },

    // Custom Hiring Center (CHC) Farm Machinery Inventory for FPO
    chcMachinery: [
      {
        id: 'MACH-01',
        name: 'Mahindra 575 DI (45 HP) Tractor + Rotavator',
        icon: '🚜',
        memberRate: '₹ 450 / hour',
        marketRate: '₹ 850 / hour',
        discount: '47% Member Subsidy',
        status: 'AVAILABLE_TODAY',
        operator: 'Operator Included (FPO Staff)'
      },
      {
        id: 'MACH-02',
        name: 'Solar-Powered 16L Knapsack Sprayer',
        icon: '🔋',
        memberRate: '₹ 40 / day',
        marketRate: '₹ 150 / day',
        discount: '73% Member Subsidy',
        status: 'AVAILABLE_TODAY',
        operator: 'Self-Operated'
      },
      {
        id: 'MACH-03',
        name: 'Multi-Crop Power Tiller & Weeder',
        icon: '⚙️',
        memberRate: '₹ 220 / hour',
        marketRate: '₹ 500 / hour',
        discount: '56% Member Subsidy',
        status: 'IN_USE_BOOKABLE',
        operator: 'Available from Tomorrow 08:00 AM'
      }
    ],

    // Active Fleet for Logistics & Corridor Telemetry
    fleet: [
      {
        id: 'VEH-01',
        plate: 'KA-04-E-4421',
        type: 'Refrigerated 4-Ton Eicher Truck',
        tempZone: '6.2°C Chill Zone',
        capacityKg: 4000,
        currentLoadKg: 2200,
        status: 'LINE_HAUL_TRANSIT',
        driver: 'Manjunath (+91 99002 44321)',
        speedKmH: 54,
        location: 'NH-75 Express Highway, Mile 42',
        destination: 'Bengaluru Peri-Urban Cross-Dock Hub',
        etaMins: 38
      },
      {
        id: 'VEH-02',
        plate: 'KA-51-B-3310',
        type: 'Standby Reefer 3.5-Ton Truck',
        tempZone: '4.0°C Pre-Cooled',
        capacityKg: 3500,
        currentLoadKg: 0,
        status: 'STANDBY_HOSKOTE',
        driver: 'Gururaj (+91 97311 00223)',
        speedKmH: 0,
        location: 'Hoskote Hub Standby Bay',
        destination: 'Ready for Quick Response Dispatch',
        etaMins: 0
      },
      {
        id: 'VEH-03',
        plate: 'KA-03-D-9912',
        type: 'Mahindra Zor Grand E-Loader',
        tempZone: 'Insulated Crates',
        capacityKg: 800,
        currentLoadKg: 700,
        status: 'LAST_MILE_DISPATCH',
        driver: 'Kiran (+91 88612 99014)',
        speedKmH: 32,
        location: 'Whitefield Main Road Crossing',
        destination: 'Whitefield Green Residency Gate 2 Hub',
        etaMins: 14
      }
    ],

    // Live Verified B2B & Housing Society Buyer Demands (Direct Contracts with Zero Middlemen)
    buyerDemands: [
      {
        id: 'DEM-01',
        buyerName: 'Royal Palace Hotels & Luxury Dining',
        buyerType: 'Premium Hospitality Group',
        icon: '🏨',
        crop: 'Tomato (Grade A+ Cherry/Table)',
        cropKey: 'tomato',
        volumeNeededKg: 400,
        offeredRateGross: 27.50,
        netFarmerTakeHome: 24.20,
        netTakeHome: 24.20,
        mandiRateComparison: 10.77,
        gainPerKg: 13.43,
        pickupSpoke: 'Kolar Solar Pre-cooling Spoke',
        deliveryWindow: 'Tomorrow, 08:00 AM - 11:00 AM',
        escrowDepositRs: 11000,
        escrowStatus: '100% SECURED_IN_BANK',
        qualityGrade: 'Grade A+ (Brix > 4.8°)',
        status: 'OPEN_ACCEPTING',
        fulfilledKg: 150
      },
      {
        id: 'DEM-02',
        buyerName: 'FreshMart Hypermarket',
        buyerType: 'Organized Retail Chain',
        icon: '🏬',
        crop: 'Tomato (Grade A Table)',
        cropKey: 'tomato',
        volumeNeededKg: 650,
        offeredRateGross: 26.00,
        netFarmerTakeHome: 23.50,
        netTakeHome: 23.50,
        mandiRateComparison: 10.77,
        gainPerKg: 12.73,
        pickupSpoke: 'Kolar Solar Pre-cooling Spoke',
        deliveryWindow: 'Tomorrow, 08:00 AM - 11:00 AM',
        escrowDepositRs: 16900,
        escrowStatus: '100% SECURED_IN_BANK',
        qualityGrade: 'Grade A Table (Brix > 4.5°)',
        status: 'OPEN_ACCEPTING',
        fulfilledKg: 650
      },
      {
        id: 'DEM-03',
        buyerName: 'Whitefield & Bengaluru Housing Societies Cluster',
        buyerType: 'Apartment Consumer Collective',
        icon: '🏢',
        crop: 'Farm-Fresh Native Tomato',
        cropKey: 'tomato',
        volumeNeededKg: 1200,
        offeredRateGross: 25.00,
        netFarmerTakeHome: 22.80,
        netTakeHome: 22.80,
        mandiRateComparison: 10.77,
        gainPerKg: 12.03,
        pickupSpoke: 'Kolar Agro Spoke',
        deliveryWindow: 'Tomorrow, 07:00 AM Direct Dispatch',
        escrowDepositRs: 30000,
        escrowStatus: '100% SECURED_IN_BANK',
        qualityGrade: 'Residue-Free Farm Fresh',
        status: 'OPEN_ACCEPTING',
        fulfilledKg: 400
      },
      {
        id: 'DEM-04',
        buyerName: 'Bangalore Caterers & Hotel Federation',
        buyerType: 'Commercial Food Service',
        icon: '🍽️',
        crop: 'Golden Mountain Potato',
        cropKey: 'potato',
        volumeNeededKg: 3000,
        offeredRateGross: 25.00,
        netFarmerTakeHome: 22.50,
        mandiRateComparison: 13.00,
        gainPerKg: 9.50,
        pickupSpoke: 'Hoskote Cross-Dock Spoke',
        deliveryWindow: '17 Sept, 06:00 AM',
        escrowDepositRs: 75000,
        escrowStatus: '100% SECURED_IN_BANK',
        qualityGrade: 'Grade A Uniform Size',
        status: 'OPEN_ACCEPTING',
        fulfilledKg: 1200
      },
      {
        id: 'DEM-05',
        buyerName: 'Kolar Sun-Dry & Agro Processing Co.',
        buyerType: 'Food Processor',
        icon: '🏭',
        crop: 'Green Bell Capsicum',
        cropKey: 'capsicum',
        volumeNeededKg: 1200,
        offeredRateGross: 42.00,
        netFarmerTakeHome: 38.50,
        mandiRateComparison: 22.00,
        gainPerKg: 16.50,
        pickupSpoke: 'Kolar Solar Spoke',
        deliveryWindow: '18 Sept, Morning',
        escrowDepositRs: 50400,
        escrowStatus: '100% SECURED_IN_BANK',
        qualityGrade: 'Grade A Thick Wall',
        status: 'OPEN_ACCEPTING',
        fulfilledKg: 400
      }
    ],

    // Automated Distress Sale & Price Crash Protection Shield
    distressSaleShield: {
      isCrashAlertActive: true,
      crop: 'Tomato (टमाटर)',
      cropKey: 'tomato',
      currentMandiCrashRate: 9.00,
      baselineCultivationCost: 14.50,
      distressLossPerKg: -5.50,
      alertMessage: '⚠️ Kolar APMC Mandi Tomato prices crashed by 42% due to temporary supply glut. Traditional farmers are losing ₹5.50/kg or dumping crops on highway!',
      solutionTitle: '🛡️ Solar Cold Storage + 70% Instant e-NWR Cash Advance',
      coldStorageFacility: 'Kolar Gramin Solar Cold Room (Unit 2, 4.2 km away)',
      rentalCostPerCrateDay: 1.50,
      eNwrLoanAdvanceRatePerKg: 16.50, // 70% advance on expected recovery value
      expectedRecoveryRate: 25.00,
      recoveryHorizonDays: '8 to 12 Days',
      availableColdCrates: 120,
      status: 'SHIELD_AVAILABLE'
    },

    // Consumer Housing Societies & Group-Buy Pooling Hubs
    consumerSocieties: [
      {
        id: 'SOC-01',
        name: 'Whitefield Green Residency',
        unitsCount: 120,
        currentPoolKg: 85,
        targetPoolKg: 100,
        discountPct: 15,
        isThresholdReached: false,
        hubDropLocation: 'Tower B Clubhouse / Gate 2 Hub',
        scheduledDelivery: 'Tomorrow, 07:00 AM'
      },
      {
        id: 'SOC-02',
        name: 'Prestige Shantiniketan',
        unitsCount: 350,
        currentPoolKg: 165,
        targetPoolKg: 150,
        discountPct: 15,
        isThresholdReached: true,
        hubDropLocation: 'Main Society Plaza Hub',
        scheduledDelivery: 'Tomorrow, 07:30 AM'
      },
      {
        id: 'SOC-03',
        name: 'Green Glen Layout Residents Association',
        unitsCount: 90,
        currentPoolKg: 45,
        targetPoolKg: 80,
        discountPct: 15,
        isThresholdReached: false,
        hubDropLocation: 'Central Park Pavilion',
        scheduledDelivery: 'Tomorrow, 08:15 AM'
      }
    ],

    // Certified Quality Assay & Lab Provenance Test
    provenanceCert: {
      labCertificateNo: 'NABL-AGRI-2026-9921',
      accreditedLab: 'Central Agro Quality Testing Laboratory, GKVK Bengaluru',
      sampleHarvestDate: '14 Sept 2026, 05:30 AM',
      sampleTestedDate: '14 Sept 2026, 08:15 AM',
      farmerName: 'Ramesh Patel',
      farmLocation: 'Survey No. 44/2, Vokkaleri Village, Kolar',
      pesticideResidueMgKg: '< 0.01 mg/kg (Zero Chemical Residue Detected)',
      fssaiStandard: 'FSSAI Category 14 - Certified Safe & Non-Toxic',
      brixSugar: '4.8° Brix (Grade A+ Sweet & Firm)',
      firmnessPressure: '4.2 kg/cm² (Ideal Export Firmness)',
      transportChain: 'Direct Solar Pre-Cooled Reefer Transit (+6.2°C)'
    },

    // 1. The Actual Middleman Problem & FarmFlow Solution Pricing Model
    middlemanPriceEscalation: {
      crop: 'Tomato (टमाटर)',
      unit: 'kg',
      traditionalChain: {
        title: 'Traditional Middleman Multi-Stage Exploitation',
        steps: [
          { stage: 'Farmer', price: 15.00, stageCut: 15.00, cumulativeMarkup: 0.00, role: 'Cultivation & Harvest (Bears 100% weather, pest & diesel risks)', icon: '👨‍🌾' },
          { stage: 'Local Trader / Village Arhtiya', price: 20.00, stageCut: 5.00, cumulativeMarkup: 5.00, role: 'Village middleman buys on credit, charges 33% markup', icon: '🤝' },
          { stage: 'Wholesaler / APMC Agent', price: 25.00, stageCut: 5.00, cumulativeMarkup: 10.00, role: 'Mandi yard commission, cartage, hamali & weighment loss', icon: '🏬' },
          { stage: 'Distributor / Secondary Trader', price: 35.00, stageCut: 10.00, cumulativeMarkup: 20.00, role: 'Regional transport markup, coldless truck rot & broker cut', icon: '🏪' },
          { stage: 'Retailer / Supermarket', price: 40.00, stageCut: 5.00, cumulativeMarkup: 25.00, role: 'Final retail markup paid by consumer', icon: '🛒' }
        ],
        farmerReceives: 15.00,
        consumerPays: 40.00,
        middlemanGap: 25.00,
        farmerSharePct: 37.5,
        middlemanSharePct: 62.5
      },
      farmflowDirectChain: {
        title: 'FarmFlow Demand-Driven Direct Coordination',
        farmerReceives: 18.00, // Direct fair price
        pooledLogistics: 3.50,
        spokeTechAssay: 1.50,
        consumerPays: 23.00,
        farmerGainPerKg: 3.00,
        farmerGainPct: 20.0,
        consumerSavingsPerKg: 17.00,
        consumerSavingsPct: 42.5,
        intermediariesEliminated: 5
      }
    },

    // 2. AI-Based Hyperlocal Demand Forecasting Engine (6-Factor Analysis)
    aiDemandForecasting: {
      headline: 'AI-Based Hyperlocal Demand Forecasting Engine',
      summary: 'Analyzes previous sales, seasonal demand, weather conditions, festival periods, local market trends, and current orders to predict upcoming consumption volume.',
      coreFactors: [
        { id: 'FAC-1', name: 'Previous Sales Data', weight: '22%', icon: '📊', status: '+14% Week-on-Week consumption acceleration across retail clusters' },
        { id: 'FAC-2', name: 'Seasonal Demand Cycles', weight: '18%', icon: '🍂', status: 'Post-monsoon transition; household vegetable curry consumption peaks' },
        { id: 'FAC-3', name: 'Hyperlocal Weather Conditions', weight: '15%', icon: '☀️', status: 'Clear & dry (28°C avg); zero rainfall disruption; high tomato shelf stability' },
        { id: 'FAC-4', name: 'Festival & Banquet Periods', weight: '20%', icon: '🎉', status: 'Upcoming festival & wedding banquet season surging commercial hotel intake' },
        { id: 'FAC-5', name: 'Local Mandi Supply Trends', weight: '13%', icon: '📈', status: 'APMC wholesale mandi arrivals down by 18%; regional supply deficit emerging' },
        { id: 'FAC-6', name: 'Current Pre-Booked Forward Orders', weight: '12%', icon: '📝', status: '3,200 kg already committed in active forward escrows by restaurants & marts' }
      ],
      predictions: [
        {
          city: 'Jaipur',
          state: 'Rajasthan',
          crop: 'Tomato',
          cropIcon: '🍅',
          predictedDemandKg: 5000,
          currentCommittedKg: 3200,
          unmetDeficitKg: 1800,
          timeHorizon: 'Next Week (7 Days)',
          confidenceScore: 94.8,
          recommendedFarmgatePrice: 18.00,
          traditionalMandiPrice: 15.00,
          farmerNetAdvantage: '+ ₹3.00/kg (+20.0%)',
          recommendedAction: 'Rajasthan Vegetable FPO advised to aggregate 5,000 kg batch for direct city delivery next week.',
          buyerBreakdown: [
            { type: 'Supermarkets & Hypermarkets', shareKg: 1800, sharePct: 36, icon: '🏬' },
            { type: 'Hotels & Banquets (Palace/Heritage)', shareKg: 1400, sharePct: 28, icon: '🏨' },
            { type: 'Commercial Restaurant Clusters', shareKg: 1000, sharePct: 20, icon: '🍽️' },
            { type: 'Consumer Housing Collectives', shareKg: 800, sharePct: 16, icon: '🏘️' }
          ]
        },
        {
          city: 'Bengaluru',
          state: 'Karnataka',
          crop: 'Tomato & Capsicum',
          cropIcon: '🍅',
          predictedDemandKg: 6500,
          currentCommittedKg: 4200,
          unmetDeficitKg: 2300,
          timeHorizon: 'Next Week (7 Days)',
          confidenceScore: 96.2,
          recommendedFarmgatePrice: 23.50,
          traditionalMandiPrice: 11.00,
          farmerNetAdvantage: '+ ₹12.50/kg (+113.6%)',
          recommendedAction: 'Kolar Agro Spoke pre-cooling chamber to aggregate 2,200 kg lots with 4-Ton Reefer truck.',
          buyerBreakdown: [
            { type: 'FreshMart Hypermarket Hubs', shareKg: 3000, sharePct: 46, icon: '🏬' },
            { type: 'Apartment Housing Societies', shareKg: 2000, sharePct: 31, icon: '🏘️' },
            { type: 'Cloud Kitchens & Caterers', shareKg: 1500, sharePct: 23, icon: '🍽️' }
          ]
        },
        {
          city: 'Delhi NCR',
          state: 'Delhi',
          crop: 'Tomato & Potato',
          cropIcon: '🥔',
          predictedDemandKg: 8200,
          currentCommittedKg: 5100,
          unmetDeficitKg: 3100,
          timeHorizon: 'Next Week (7 Days)',
          confidenceScore: 93.5,
          recommendedFarmgatePrice: 21.00,
          traditionalMandiPrice: 14.00,
          farmerNetAdvantage: '+ ₹7.00/kg (+50.0%)',
          recommendedAction: 'Schedule interstate refrigerated corridor from Jaipur and Haryana aggregator spokes.',
          buyerBreakdown: [
            { type: 'Organized Supermarkets', shareKg: 4500, sharePct: 55, icon: '🏬' },
            { type: 'Hotel Federations', shareKg: 2200, sharePct: 27, icon: '🏨' },
            { type: 'Society Bulk Baskets', shareKg: 1500, sharePct: 18, icon: '🏘️' }
          ]
        }
      ]
    },

    // 3. AI-Based Multi-Stop Route Optimization & Pooled Fleet Dispatch
    aiRouteOptimization: {
      title: 'AI-Based Multi-Stop Route Optimization & Pooled Fleet Dispatch',
      overview: 'Calculates the mathematically optimal Travelling Salesperson (TSP) delivery path based on delivery locations, vehicle capacity, distance, and traffic.',
      scenario: 'Consolidated dispatch for 4,000 kg multi-delivery batch across Northern Agro-Corridor.',
      inefficientRoute: {
        name: 'Traditional Disorganized Route (Wasteful Backtracking)',
        pathSummary: 'Farmer (Jaipur) ➔ Jaipur City ➔ Ajmer ➔ Jaipur Backtrack ➔ Delhi',
        stops: [
          { seq: 1, location: 'Farmer Farmgate (Jaipur Outskirts)', action: 'Pickup 4,000 kg harvest', km: 0, status: 'Depart 06:00 AM' },
          { seq: 2, location: 'Jaipur Local Mandi Yard', action: 'Unload 1,000 kg (Manual auction queue delay 4 hrs)', km: 35, status: 'Delay +4 hrs' },
          { seq: 3, location: 'Ajmer Wholesale Yard', action: 'Unload 1,000 kg (Drive southwest 135 km away)', km: 170, status: 'Traffic Congestion' },
          { seq: 4, location: 'Jaipur Backtracking Loop', action: 'Wasteful return on same highway (Redundant 135 km)', km: 305, status: '⚠️ 135 km Waste Backtrack' },
          { seq: 5, location: 'Delhi Central Hub', action: 'Final unload 2,000 kg (Driver exhausted, 14.5% produce rotted)', km: 820, status: 'Delivered 01:30 AM Next Day' }
        ],
        totalDistanceKm: 820,
        estimatedDurationHours: 19.5,
        fuelConsumptionLiters: 182,
        fuelCostRs: 18400,
        transitSpoilagePct: 14.5,
        spoilageValueLostRs: 11600,
        co2EmissionsKg: 284,
        backtrackingPenalty: '135 km redundant loop through Jaipur twice',
        trafficDelaysHours: 4.5
      },
      optimizedRoute: {
        name: 'AI-Optimized Dynamic Pooled Route (Zero Backtracking)',
        pathSummary: 'Farmer ➔ Jaipur Hub ➔ Ajmer Reefer Drop ➔ Delhi Direct Expressway',
        stops: [
          { seq: 1, location: 'Rajasthan Vegetable FPO Farmgate', action: 'Rapid 15-min pooled loading (4,000 kg)', km: 0, status: 'Depart 06:00 AM' },
          { seq: 2, location: 'Jaipur Pre-Cooling Spoke Hub', action: 'Pre-chill chamber intake + 1,000 kg local drop', km: 28, status: 'Quick Dock Bay 1' },
          { seq: 3, location: 'Ajmer Dedicated Reefer Drop', action: 'Direct offload 1,000 kg at cold receiving bay', km: 160, status: 'Scheduled Bay 2' },
          { seq: 4, location: 'Delhi NCR Mega Distribution Hub', action: 'Express transit via direct highway; 2,000 kg final drop', km: 540, status: 'Delivered 05:12 PM Same Day' }
        ],
        totalDistanceKm: 540,
        estimatedDurationHours: 11.2,
        fuelConsumptionLiters: 110,
        fuelCostRs: 11200,
        transitSpoilagePct: 1.2,
        spoilageValueLostRs: 960,
        co2EmissionsKg: 172,
        backtrackingPenalty: '0 km (Zero Backtracking)',
        trafficDelaysHours: 0.5,
        savings: {
          distanceSavedKm: 280,
          distanceSavedPct: 34.1,
          timeSavedHours: 8.3,
          timeSavedPct: 42.5,
          fuelCostSavedRs: 7200,
          spoilageSavedRs: 10640,
          totalMoneySavedRs: 17840
        }
      }
    },

    // 4. Comparable Customer Benchmarking Matrix for Farmers (100% Aligned with Unified Market Engine)
    comparableCustomers: [
      {
        id: 'CUST-01',
        name: 'Royal Palace Hotels & Luxury Dining',
        type: 'Premium Hospitality Group',
        icon: '🏨',
        crop: 'Tomato (Grade A+ Cherry/Table)',
        neededQtyKg: 400,
        offeredRateGross: 27.50,
        netTakeHome: 24.20,
        netFarmerTakeHome: 24.20,
        mandiRate: 16.00,
        gainVsMandiRs: '+ ₹13.43/kg (+125%) vs Mandi Net',
        paymentTerms: '⚡ Instant Direct Bank DBT via SBI Escrow',
        escrowLockedRs: 11000,
        pickupMode: 'Insulated Chilled Transit (₹3.30/kg)',
        rating: 4.9,
        badge: '🏆 Highest Net Take-Home'
      },
      {
        id: 'CUST-02',
        name: 'FreshMart Hypermarkets (Organized Retail Chain)',
        type: 'Organized Supermarket Chain',
        icon: '🏬',
        crop: 'Tomato (Grade A Table)',
        neededQtyKg: 650,
        offeredRateGross: 26.00,
        netTakeHome: 23.50,
        netFarmerTakeHome: 23.50,
        mandiRate: 16.00,
        gainVsMandiRs: '+ ₹12.73/kg (+118%) vs Mandi Net',
        paymentTerms: '⚡ 2-Hour ICICI Escrow DBT Payout',
        escrowLockedRs: 16900,
        pickupMode: '15-min EV Farmgate Pickup (₹2.50/kg)',
        rating: 4.9,
        badge: 'Verified Retail Chain'
      },
      {
        id: 'CUST-03',
        name: 'Bengaluru Housing Societies Collective',
        type: 'Direct Consumer Group-Buy',
        icon: '🏢',
        crop: 'Tomato (Table Fresh)',
        neededQtyKg: 1200,
        offeredRateGross: 25.00,
        netTakeHome: 22.80,
        netFarmerTakeHome: 22.80,
        mandiRate: 16.00,
        gainVsMandiRs: '+ ₹12.03/kg (+112%) vs Mandi Net',
        paymentTerms: '⚡ Razorpay Bank Escrow Payout',
        escrowLockedRs: 30000,
        pickupMode: 'Pooled Spoke Carrier (₹2.20/kg)',
        rating: 4.8,
        badge: 'Direct Consumer Pool'
      },
      {
        id: 'CUST-04',
        name: 'CloudKitchen Culinary Processing Hub',
        type: 'Bulk Food Prep & Commercial Kitchens',
        icon: '🍽️',
        crop: 'Tomato (Grade B/A Yield)',
        neededQtyKg: 800,
        offeredRateGross: 23.00,
        netTakeHome: 21.00,
        netFarmerTakeHome: 21.00,
        mandiRate: 16.00,
        gainVsMandiRs: '+ ₹10.23/kg (+95%) vs Mandi Net',
        paymentTerms: '⚡ HDFC Bank Escrow Vault Release',
        escrowLockedRs: 18400,
        pickupMode: 'Bulk E-Loader (₹2.00/kg)',
        rating: 4.7,
        badge: 'High Daily Volume'
      },
      {
        id: 'CUST-05',
        name: 'Traditional APMC Mandi Yard (The Middleman Trap)',
        type: 'Traditional Middleman Open Yard',
        icon: '🏛️',
        crop: 'Tomato (Unsorted)',
        neededQtyKg: 5000,
        offeredRateGross: 16.00,
        netTakeHome: 10.77,
        netFarmerTakeHome: 10.77, // After 8.5% commission, ₹2.20 hamali, 5% weigh theft
        mandiRate: 16.00,
        gainVsMandiRs: '- ₹5.23/kg (-33% Middleman Cuts)',
        paymentTerms: '⏳ 15-45 Days Delayed Credit (Zero Escrow)',
        escrowLockedRs: 0,
        pickupMode: 'Farmer Must Pay Own Mandi Transport',
        rating: 2.3,
        badge: 'Traditional Trap'
      }
    ],

    // 5. Operational Execution Clarity: WHO, WHEN, and HOW Matrix
    operationalExecutionMatrix: {
      who: [
        { role: 'Farmer (Producer)', icon: '👨‍🌾', action: 'Lists crops pre-harvest, verifies AI target rate, confirms buyer contract, delivers to village spoke' },
        { role: 'FPO (Aggregator)', icon: '🏢', action: 'Aggregates 242 smallholder harvests, tests Grade-A quality, packages pooled dispatches' },
        { role: 'Logistics Fleet', icon: '🚚', action: 'Dispatches multi-stop Reefer EVs along AI TSP-optimized routes with real-time temperature tracking' },
        { role: 'Direct Buyer', icon: '🏬', action: 'Pre-books produce, funds 100% bank escrow, verifies QR batch upon arrival' },
        { role: 'Spoke Node (Admin)', icon: '🏛️', action: 'Operates IoT digital scale, validates weight slip, triggers automated Aadhaar DBT payout' }
      ],
      when: [
        { time: 'T-7 to T-14 Days', phase: 'Pre-Harvest', trigger: 'AI scans 6 demand drivers, recommends fair rate band, buyers lock forward contracts' },
        { time: '06:00 AM Harvest Day', phase: 'Harvesting', trigger: 'Farmers harvest exact confirmed lot sizes, completely preventing unsold mandi gluts' },
        { time: '07:30 AM Morning', phase: 'Aggregation', trigger: 'Produce delivered to Village Spoke; IoT digital scale generates tamper-proof QR weight slip' },
        { time: '08:30 AM Morning', phase: 'Smart Transit', trigger: 'Consolidated EV carrier departs on TSP route, saving 280 km & 8.3 hours spoilage time' },
        { time: '11:00 AM Midday', phase: 'Direct Delivery', trigger: 'Buyer scans QR barcode, verifies Grade-A specs, approves instant electronic receipt' },
        { time: 'Within 2 Hours', phase: 'Settlement', trigger: 'Smart bank escrow releases direct Aadhaar DBT to farmer bank accounts with zero commission' }
      ],
      how: [
        { pillar: 'AI Demand Forecasting', icon: '🤖', mechanism: '6-factor ML model (past sales, seasonal cycles, rainfall, wholesale mandi deficit, festival calendar, pre-orders)' },
        { pillar: 'Disintermediation Engine', icon: '⚖️', mechanism: 'Bypasses 5 middleman cuts (₹15➔₹20➔₹25➔₹35➔₹40), giving farmers ₹18–₹23/kg (+20%) and consumers ₹24–₹28/kg (-30%)' },
        { pillar: 'TSP Route Optimization', icon: '🗺️', mechanism: 'Dynamic Traveling Salesperson algorithm consolidates multi-pickup routes, cutting 34% transit distance & fuel' },
        { pillar: '100% Escrow & Aadhaar DBT', icon: '🔒', mechanism: 'Upfront buyer funds held in escrow, released directly to farmer bank account upon IoT digital weight validation' }
      ]
    },

    // 6. Guided Step-by-Step Flow Definitions with WHO, WHEN, and HOW
    stakeholderGuidedFlows: {
      farmer: {
        role: 'FARMER',
        title: 'Farmer Execution Pipeline (किसान परिचालन प्रवाह)',
        currentStep: 1,
        steps: [
          { num: 1, id: 'REC', title: 'AI Demand & Price Floor', icon: '🤖', who: 'Farmer & AI Model', when: 'T-7d Pre-Harvest', how: '6 AI factors predict 5,000 kg Jaipur demand @ ₹18-₹23.50/kg', desc: 'Predicted Jaipur demand: ~5,000 kg tomatoes next week @ ₹18-₹23.50/kg.' },
          { num: 2, id: 'COMPARE', title: 'Benchmark 5 Buyer Classes', icon: '⚖️', who: 'Farmer & Direct Buyers', when: 'T-5d Pre-Harvest', how: 'Supermarkets (₹22), Hotels (₹23) vs APMC Mandi (₹15 trap)', desc: 'Compare Supermarket, Hotel, and Bulk rates vs Mandi.' },
          { num: 3, id: 'DEAL', title: 'Confirm Forward Contract', icon: '📝', who: 'Farmer & Buyer', when: 'T-3d to Harvest Day', how: '100% bank escrow guarantee; order-driven harvest with 0% waste', desc: 'Lock 1,000 kg lot @ ₹18/kg with 100% escrow guarantee.' },
          { num: 4, id: 'LOGISTICS', title: 'Farm Pickup & Instant DBT', icon: '🚚', who: 'Fleet, IoT Spoke & Bank', when: '07:30 AM ➔ 2h to DBT', how: 'IoT scale weighs batch; TSP route dispatches; Aadhaar DBT payout', desc: 'EV pickup at farmgate, IoT digital weighing, instant DBT payout.' }
        ]
      },
      customer: {
        role: 'CONSUMER',
        title: 'Consumer Execution Pipeline (उपभोक्ता परिचालन प्रवाह)',
        currentStep: 1,
        steps: [
          { num: 1, id: 'BROWSE', title: 'Direct Farm Listings', icon: '🌾', who: 'Consumer & FPO', when: 'Daily Morning', how: 'Rajasthan FPO & Kolar direct inventory listed @ ₹18-₹25/kg', desc: 'Direct farm listings with farmer origin & harvest date.' },
          { num: 2, id: 'PRICING', title: 'Zero-Middleman Price', icon: '🔍', who: 'Consumer vs 5 Middlemen', when: 'Price Discovery', how: 'Cuts ₹15➔₹40 chain; pay ₹25/kg instead of retail ₹40/kg (-30%)', desc: 'Eliminates 5 middlemen layers; save 25-40% on produce.' },
          { num: 3, id: 'ORDER', title: 'Pooled Neighborhood Delivery', icon: '🛒', who: 'Society & Carrier', when: 'Closes 20:00 ➔ 07:00 AM', how: 'Cluster pooling unlocks free delivery & consolidated reefer EV', desc: 'Batch order with society cluster for pooled free delivery.' },
          { num: 4, id: 'TRACE', title: 'QR Origin & Cold-Chain', icon: '📱', who: 'Consumer & IoT Spoke', when: 'Upon Delivery', how: 'Scan QR to verify harvest timestamp, farm origin & temperature logs', desc: 'Verify farm origin, harvest time & transit logs via QR.' }
        ]
      },
      fpo: {
        role: 'FPO',
        title: 'FPO Aggregation Pipeline (सहकारी परिचालन प्रवाह)',
        currentStep: 1,
        steps: [
          { num: 1, id: 'FORECAST', title: 'Multi-City AI Demand Plan', icon: '📊', who: 'FPO & 242 Farmers', when: 'Weekly Cycle', how: 'Allocates harvest quotas based on 5,000 kg Jaipur demand', desc: 'Forecast 5,000 kg Jaipur tomato need to allocate member quotas.' },
          { num: 2, id: 'AGGREGATE', title: 'Smallholder Lot Consolidation', icon: '🚜', who: 'FPO Spoke & Farmers', when: '06:00 – 08:00 AM', how: 'Aggregates 10-50 kg farm lots into 1,000-5,000 kg Grade-A batches', desc: 'Combine member harvests into consolidated commercial batches.' },
          { num: 3, id: 'ROUTE', title: 'AI Route Dispatch', icon: '🗺️', who: 'FPO & Reefer Carrier', when: '08:30 AM Dispatch', how: 'TSP algorithm cuts 280 km, saving ₹7,200 fuel & ₹10,640 spoilage', desc: 'Dynamic TSP route saves 34% fuel and stops transit spoilage.' },
          { num: 4, id: 'DISBURSE', title: 'Direct Bank Escrow Settlement', icon: '🏦', who: 'FPO, Bank & Members', when: 'Within 2 Hours', how: 'Disburses 100% escrow proceeds directly to member bank accounts', desc: 'Automated 100% DBT release to member bank accounts.' }
        ]
      }
    }
  };
})();


