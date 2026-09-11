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
    ]
  };
})();

