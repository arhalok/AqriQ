/**
 * FarmFlow - Enterprise Multilingual Localization System
 * Clean, consistent translations for English (en), Hindi (hi), and Kannada (kn).
 * Zero character corruption and reliable fallback.
 */

(function () {
  'use strict';

  window.FF_I18N = {
    currentLang: 'en',

    translations: {
      en: {
        // Brand & System
        appTitle: 'FarmFlow',
        appSub: 'Demand-Driven Agri-Supply Chain & Direct Coordination Network',
        ribbonText: 'Enterprise Supply Chain Coordination Network • Active Corridors • 100% Escrow Backed',
        ribbonBtn: '📊 Operations Control Tower (Admin)',
        systemStatus: 'Network Live • Bengaluru-Kolar Cold Corridor • 100% Escrow Backed',
        voiceBtn: 'Kisan Vani (Audio Advisory)',

        // Navigation Tabs
        navFarmer: 'Farmer Portal (किसान)',
        navConsumer: 'Consumer Store (उपभोक्ता)',
        navLogistics: 'Reefer Fleet & Logistics (लॉजिस्टिक्स)',
        navFPO: 'FPO Operations Desk (सहकारी)',
        navBuyer: 'B2B Buyer (थोक खरीदार)',
        navAdmin: 'Operations Control Tower (Admin)',

        // Farmer Portal Minimal Homepage
        farmerGreeting: 'Welcome back, Ramesh Patel',
        farmerHeroSub: 'Direct-to-buyer farmgate sales with zero middlemen, instant digital scale certification, and guaranteed bank payment.',
        netRateCard: 'Today\'s Net Take-Home',
        walletCard: 'Pending Bank Settlement',
        activeDealsCard: 'Active Forward Deals',
        todayMandiRate: 'vs APMC Mandi: ₹11.00/kg',

        // Quick Action Tiles
        actionSell: 'Sell My Harvest',
        actionBookTransport: 'Book Farmgate Pickup',
        actionWhereToSell: 'Where to Sell?',
        actionMandi: 'Mandi vs Direct',
        actionDoctor: 'AI Crop Doctor',
        actionCold: 'Cold Storage',
        actionPayout: 'Scale Slips & DBT',

        // Harvest Journey
        journeyTitle: 'My Active Harvest & Spoke Intake Journey',
        journeySub: 'Contract #HVT-2026-8812 • 650 kg Native Tomatoes for FreshMart Hypermarket',
        journeyStep1: 'Direct Deal Locked',
        journeyStep2: 'Farmgate Transport Picked',
        journeyStep3: 'Digital Weighbridge & Brix',
        journeyStep4: 'Instant Bank DBT Deposited',
        btnTrackReefer: '📡 Live Vehicle Telemetry',
        btnScaleSlip: '📄 View Weighbridge Slip',
        btnCallDriver: '📞 Call Driver (Kiran)',

        // Where to Sell & Mandi
        whereToSellTitle: '"Where Should I Sell?" Smart Multi-Market Logistics Advisor',
        whereToSellSub: 'Compare real take-home earnings across local, city, and direct spoke destinations including freight tariffs and transit spoilage.',
        mandiCompTitle: 'Live APMC Mandi vs FarmFlow Direct Net Realization',
        mandiCompSub: 'See how much money you actually take home after deducting middleman commissions and transit loss.',
        mandiHeadline: 'Traditional APMC Mandi',
        farmFlowHeadline: 'FarmFlow Direct Contract',
        takeHomeText: 'Actual Farmer Take-Home',
        gainText: 'Net Income Advantage',

        // On-Demand Farm Logistics
        logisticsTitle: 'Cold-Chain Telemetry & On-Demand Farm Logistics',
        logisticsSub: 'On-demand farmgate pickup (Porter/Blinkit for agriculture), line-haul reefer corridors, and transporter partner earnings.',
        tabCorridor: 'Corridor Route Schematic',
        tabBookPickup: 'Book Farmgate Transport',
        tabPartnerDesk: 'Transporter Partner Desk',
        tabSpoilageSim: 'Heat & Delay Spoilage Lab',

        bookTransportTitle: 'Instant Farmgate Agricultural Transport Booking',
        bookTransportSub: 'Book electric loaders, insulated pickups, or refrigerated trucks right to your farm gate in 15 minutes.',
        fieldPickupLabel: 'Pickup Location / Farmgate:',
        destHubLabel: 'Destination Spoke / Hub:',
        cratesLabel: 'Produce Quantity (Crates / kg):',
        vehicleSelectLabel: 'Select Vehicle Type:',
        confirmBookingBtn: '⚡ Confirm Transport Booking',

        partnerDeskTitle: 'Transporter & Driver Partner Board',
        partnerDeskSub: 'Nearby harvest loads available for pickup. Accept loads, deliver to collection spokes, and earn instant daily payouts.',
        statusOnline: '🟢 You are Online (Receiving Trip Requests)',
        statusOffline: '🔴 You are Offline',
        acceptTripBtn: 'Accept Trip & Navigate',

        spoilageLabTitle: 'Ambient Heat & Delay Transit Spoilage Simulator',
        spoilageLabSub: 'Simulate how scorching summer temperatures and Bangalore traffic delays cause massive rot in open trucks vs FarmFlow refrigerated line-haul.',

        // FPO Practical Desks
        fpoTitle: 'GreenRoots Kisan Producer Co. (FPO Operations Desk)',
        fpoSub: 'Coordinating 242 smallholder farmers across Kolar agro-corridor under NABARD & SFAC guidelines.',
        fpoTabQuota: '1. Member Quota Allocation',
        fpoTabIntake: '2. Digital Weighbridge & Intake Desk',
        fpoTabInputs: '3. Farm Machinery (CHC) & Inputs',
        fpoTabLedger: '4. Financial Ledger & Dividends',

        // Store
        storeTitle: 'Fresh Harvest From Kolar Farmers to Your Kitchen',
        storeSub: 'Shop fresh produce harvested this morning. 20-25% lower prices than supermarkets, 100% transparent pricing, and 70%+ goes directly to smallholder farmers.',
        addToBasket: 'Add to Basket',
        farmBasket: 'Farm Basket',

        // Control Tower (Admin)
        adminTitle: 'Operations Control Tower & System Architecture',
        adminSub: 'Demand-driven coordination replacing speculative intermediary trading with predictable, low-waste physical distribution.',

        // Buyer Demand Board
        buyerDemandTitle: 'Live Direct Buyer Demand Board (सीधे खरीदार मांग)',
        buyerDemandSub: 'Verified purchase orders from supermarkets, food processors & consumer housing societies with 100% bank escrow guarantee.',
        acceptDemandBtn: '🤝 Accept Offer & Sell Produce',
        demandGainPill: 'Higher than Mandi',

        // Distress Sale Protection Shield
        distressTitle: 'Automated Distress Sale & Price Crash Protection Shield',
        distressSub: 'APMC Mandi prices crashed? Do not sell at a loss! Store in nearby solar cold room and receive 70% instant e-NWR cash advance in your bank.',
        btnClaimShield: '🛡️ Store in Cold Room & Get 70% Advance Loan',

        // Society Group Buy & Transparency
        societyGroupBuyTitle: 'Apartment & Neighborhood Group-Buy Hub',
        societyGroupBuySub: 'Pool orders with your society neighbors to unlock wholesale farmgate rates with zero retailer markups.',
        btnChangeSociety: 'Change Society Hub',
        priceTransparencyTitle: 'Where Does Every ₹100 of Yours Go?',
        priceTransparencySub: 'Transparent breakdown proving how 70%+ of your rupee goes directly to the farmer who harvested it.',

        // Voice Message
        voiceAdvisory: 'Welcome to FarmFlow. Today, Tomato Grade A is selling at 26 rupees directly to FreshMart. You take home 23 rupees 50 paise in your bank account, compared to only 11 rupees in Kolar Mandi.'
      },

      hi: {
        // Brand & System
        appTitle: 'फार्मफ्लो',
        appSub: 'मांग-आधारित कृषि आपूर्ति श्रृंखला एवं प्रत्यक्ष बाजार समन्वय मंच',
        ribbonText: 'एंटरप्राइज कृषि आपूर्ति श्रृंखला समन्वय नेटवर्क • सक्रिय कॉरिडोर • 100% बैंक एस्क्रो सुरक्षित',
        ribbonBtn: '📊 ऑपरेशंस कंट्रोल टॉवर (एडमिन)',
        systemStatus: 'नेटवर्क सक्रिय • बेंगलुरु-कोलार कोल्ड कॉरिडोर • 100% एस्क्रो सुरक्षित',
        voiceBtn: 'किसान वाणी (ऑडियो सलाह)',

        // Navigation Tabs
        navFarmer: 'किसान मंच (Farmer)',
        navConsumer: 'उपभोक्ता स्टोर (Consumer)',
        navLogistics: 'रीफर फ्लीट व लॉजिस्टिक्स',
        navFPO: 'एफपीओ सहकारी डेस्क',
        navBuyer: 'थोक खरीदार (B2B)',
        navAdmin: 'कंट्रोल टॉवर (एडमिन)',

        // Farmer Portal Minimal Homepage
        farmerGreeting: 'स्वागत है, रमेश पटेल जी',
        farmerHeroSub: 'सीधे खरीदारों को फसल बेचें। शून्य बिचौलिए, प्रमाणित डिजिटल धर्मकांटा और गारंटीड बैंक भुगतान।',
        netRateCard: 'आज का शुद्ध भाव (प्रति किग्रा)',
        walletCard: 'बैंक भुगतान शेष',
        activeDealsCard: 'सक्रिय सौदे',
        todayMandiRate: 'मंडी भाव: ₹11.00/किग्रा',

        // Quick Action Tiles
        actionSell: 'फसल बेचें',
        actionBookTransport: 'खेत से गाड़ी बुक करें',
        actionWhereToSell: 'कहाँ बेचें?',
        actionMandi: 'मंडी vs सीधा सौदा',
        actionDoctor: 'फसल डॉक्टर',
        actionCold: 'कोल्ड स्टोरेज',
        actionPayout: 'कांटा पर्ची व बैंक खाते',

        // Harvest Journey
        journeyTitle: 'मेरी सक्रिय फसल एवं स्पोक आवक यात्रा',
        journeySub: 'अनुबंध #HVT-2026-8812 • फ्रेशमार्ट हेतु 650 किग्रा देशी टमाटर',
        journeyStep1: 'सीधा सौदा पक्का हुआ',
        journeyStep2: 'खेत से लोडिंग पूर्ण',
        journeyStep3: 'धर्मकांटा व ब्रिक्स जांच',
        journeyStep4: 'बैंक में DBT राशि जमा',
        btnTrackReefer: '📡 वाहन लाइव ट्रैकिंग',
        btnScaleSlip: '📄 कांटा पर्ची देखें',
        btnCallDriver: '📞 ड्राइवर को फोन करें (किरण)',

        // Where to Sell & Mandi
        whereToSellTitle: '"कहाँ बेचें?" स्मार्ट मल्टी-मार्केट लॉजिस्टिक्स सलाहकार',
        whereToSellSub: 'किराया, आढ़तिया कमीशन और रास्ते की बर्बादी काटकर देखें कि किस मंडी में आपको वास्तव में सबसे अधिक पैसा मिलेगा।',
        mandiCompTitle: 'लाइव एपीएमसी मंडी vs फार्मफ्लो सीधा शुद्ध मुनाफा',
        mandiCompSub: 'बिचौलियों के कमीशन और बर्बादी कटने के बाद वास्तव में आपके हाथ में कितना पैसा आता है, यहाँ देखें।',
        mandiHeadline: 'पारंपरिक एपीएमसी मंडी',
        farmFlowHeadline: 'फार्मफ्लो सीधा खरीदार सौदा',
        takeHomeText: 'किसान का वास्तविक शुद्ध मुनाफा',
        gainText: 'शुद्ध आमदनी में बढ़ोतरी',

        // On-Demand Farm Logistics
        logisticsTitle: 'कोल्ड-चेन टेलीमेट्री एवं ऑन-डिमांड फार्म लॉजिस्टिक्स',
        logisticsSub: 'खेत से त्वरित पिकअप (कृषि हेतु पोर्टर/ब्लिंकिट), रीफर लाइन-हॉल एवं ट्रांसपोर्टर पार्टनर कमाई।',
        tabCorridor: 'कॉरिडोर रूट स्कीमेटिक',
        tabBookPickup: 'खेत से गाड़ी बुक करें',
        tabPartnerDesk: 'ट्रांसपोर्टर पार्टनर डेस्क',
        tabSpoilageSim: 'गर्मी व बर्बादी लैब',

        bookTransportTitle: 'खेत से तुरंत कृषि परिवहन बुकिंग',
        bookTransportSub: 'ई-लोडर, पिकअप या रीफर ट्रक मात्र 15 मिनट में अपने खेत पर बुलाएं।',
        fieldPickupLabel: 'पिकअप स्थान / खेत:',
        destHubLabel: 'गंतव्य स्पोक / केंद्र:',
        cratesLabel: 'उपज मात्रा (क्रेट / किग्रा):',
        vehicleSelectLabel: 'वाहन का प्रकार चुनें:',
        confirmBookingBtn: '⚡ गाड़ी बुक करें',

        partnerDeskTitle: 'ट्रांसपोर्टर व ड्राइवर पार्टनर बोर्ड',
        partnerDeskSub: 'आसपास के खेतों में उपलब्ध लोड। पिकअप स्वीकार करें, स्पोक पर पहुंचाएं और तुरंत भुगतान पाएं।',
        statusOnline: '🟢 आप ऑनलाइन हैं (ट्रिप उपलब्ध हैं)',
        statusOffline: '🔴 आप ऑफलाइन हैं',
        acceptTripBtn: 'लोड स्वीकार करें',

        spoilageLabTitle: 'तापमान व देरी से बर्बादी सिमुलेटर',
        spoilageLabSub: 'देखें कि तेज गर्मी और ट्रैफिक जाम में खुली गाड़ी में 30% तक उपज सड़ जाती है, जबकि फार्मफ्लो रीफर में शून्य नुकसान होता है।',

        // FPO Practical Desks
        fpoTitle: 'ग्रीनरूट्स किसान उत्पादक कंपनी (एफपीओ ऑपरेशंस डेस्क)',
        fpoSub: 'नाबार्ड एवं एसएफएसी के तहत कोलार क्षेत्र के 242 छोटे किसानों का सामूहिक प्रबंधन।',
        fpoTabQuota: '1. सदस्य कोटा आवंटन',
        fpoTabIntake: '2. डिजिटल धर्मकांटा व आवक डेस्क',
        fpoTabInputs: '3. कृषि मशीनरी (CHC) व खाद-बीज',
        fpoTabLedger: '4. वित्तीय बहीखाता व लाभांश',

        // Store
        storeTitle: 'कोलार के खेतों से सीधे आपकी रसोई तक ताजी फसल',
        storeSub: 'आज सुबह कटी ताजी सब्जियां। सुपरमार्केट से 20-25% कम दाम, पारदर्शी मूल्य और 70%+ राशि सीधे किसान के बैंक में।',
        addToBasket: 'बास्केट में जोड़ें',
        farmBasket: 'फार्म बास्केट',

        // Control Tower (Admin)
        adminTitle: 'ऑपरेशंस कंट्रोल टॉवर एवं सिस्टम आर्किटेक्चर',
        adminSub: 'पारंपरिक बिचौलियों की व्यवस्था को हटाकर मांग-आधारित प्रत्यक्ष समन्वय: किसान की आय दुगुनी और खाद्य बर्बादी न्यूनतम।',

        // Buyer Demand Board
        buyerDemandTitle: 'लाइव सीधे खरीदार मांग बोर्ड (Live Buyer Demands)',
        buyerDemandSub: 'सुपरमार्केट्स, खाद्य प्रसंस्करण इकाइयों एवं सोसायटियों से सत्यापित खरीद मांग। 100% बैंक एस्क्रो गारंटी।',
        acceptDemandBtn: '🤝 सौदा स्वीकार करें व फसल बेचें',
        demandGainPill: 'मंडी से अधिक',

        // Distress Sale Protection Shield
        distressTitle: 'संकट बिक्री सुरक्षा (डिस्ट्रेस सेल शील्ड) - दाम गिरने से बचाव',
        distressSub: 'मंडी में दाम गिर गए हैं? घाटे में न बेचें! सौर कोल्ड रूम में फसल रखें और 70% तुरंत अग्रिम ऋण (e-NWR) खाते में पाएं।',
        btnClaimShield: '🛡️ कोल्ड स्टोरेज में रखें एवं 70% अग्रिम ऋण पाएं',

        // Society Group Buy & Transparency
        societyGroupBuyTitle: 'हाउसिंग सोसायटी सामूहिक खरीद हब (Group-Buy)',
        societyGroupBuySub: 'सोसायटी के पड़ोसियों के साथ मिलकर सीधे खेत से थोक भाव पर ताजी सब्जियां मंगवाएं।',
        btnChangeSociety: 'सोसायटी हब बदलें',
        priceTransparencyTitle: 'आपका ₹100 वास्तव में कहाँ जाता है?',
        priceTransparencySub: 'पारदर्शी ब्योरा जो साबित करता है कि आपके पैसे का 70%+ हिस्सा सीधे किसान को मिलता है।',

        // Voice Message
        voiceAdvisory: 'फार्मफ्लो में आपका स्वागत है। आज टमाटर ग्रेड-ए 26 रुपये में सीधे फ्रेशमार्ट को बिक रहा है। बिचौलियों को हटाकर आपके बैंक में 23 रुपये 50 पैसे आएंगे, जबकि मंडी में केवल 11 रुपये मिलते।'
      },

      kn: {
        // Brand & System
        appTitle: 'ಫಾರ್ಮ್‌ಫ್ಲೋ',
        appSub: 'ಬೇಡಿಕೆ ಆಧಾರಿತ ಕೃಷಿ ಪೂರೈಕೆ ಜಾಲ ಮತ್ತು ನೇರ ಮಾರುಕಟ್ಟೆ ಸಮನ್ವಯ',
        ribbonText: 'ಉದ್ದಿಮೆ ಕೃಷಿ ಸರಬರಾಜು ಜಾಲ • ಸಕ್ರಿಯ ಕೋಲ್ಡ್ ಕಾರಿಡಾರ್ • 100% ಬ್ಯಾಂಕ್ ಎಸ್ಕ್ರೋ ರಕ್ಷಿತ',
        ribbonBtn: '📊 ಕಾರ್ಯಾಚರಣೆ ನಿಯಂತ್ರಣ ಗೋಪುರ (ಅಡ್ಮಿನ್)',
        systemStatus: 'ಜಾಲ ಸಕ್ರಿಯ • ಬೆಂಗಳೂರು-ಕೋಲಾರ ಕೋಲ್ಡ್ ಕಾರಿಡಾರ್ • 100% ಎಸ್ಕ್ರೋ ರಕ್ಷಿತ',
        voiceBtn: 'ಕಿಸಾನ್ ವಾಣಿ (ಧ್ವನಿ ಸಲಹೆ)',

        // Navigation Tabs
        navFarmer: 'ರೈತರ ಪೋರ್ಟಲ್ (Farmer)',
        navConsumer: 'ಗ್ರಾಹಕರ ಅಂಗಡಿ (Consumer)',
        navLogistics: 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ವಾಹನ ಪಡೆ',
        navFPO: 'ಎಫ್‌ಪಿಒ ಸಹಕಾರ ಡೆಸ್ಕ್',
        navBuyer: 'ಸಗಟು ಖರೀದಿದಾರ (B2B)',
        navAdmin: 'ನಿಯಂತ್ರಣ ಗೋಪುರ (ಅಡ್ಮಿನ್)',

        // Farmer Portal Minimal Homepage
        farmerGreeting: 'ಸ್ವಾಗತ, ರಮೇಶ್ ಪಟೇಲ್ ಅವರೇ',
        farmerHeroSub: 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಖರೀದಿದಾರರಿಗೆ ಬೆಳೆ ಮಾರಿ. ಗ್ಯಾರಂಟಿ ಡಿಜಿಟಲ್ ತೂಕ ಮತ್ತು ನೇರ ಬ್ಯಾಂಕ್ ಜಮೆ.',
        netRateCard: 'ಇಂದಿನ ನಿವ್ವಳ ದರ (ಪ್ರತಿ ಕೆ.ಜಿ)',
        walletCard: 'ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರಬೇಕಾದ ಹಣ',
        activeDealsCard: 'ಸಕ್ರಿಯ ಒಪ್ಪಂದಗಳು',
        todayMandiRate: 'ಮಂಡಿ ದರ: ₹11.00/ಕೆಜಿ',

        // Quick Action Tiles
        actionSell: 'ಬೆಳೆ ಮಾರಿ',
        actionBookTransport: 'ತೋಟದಿಂದ ವಾಹನ ಬುಕ್ ಮಾಡಿ',
        actionWhereToSell: 'ಎಲ್ಲಿ ಮಾರಬೇಕು?',
        actionMandi: 'ಮಂಡಿ vs ನೇರ ಮಾರಾಟ',
        actionDoctor: 'ಬೆಳೆ ವೈದ್ಯ',
        actionCold: 'ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್',
        actionPayout: 'ತೂಕದ ರಶೀದಿ & ಬ್ಯಾಂಕ್ ಜಮೆ',

        // Harvest Journey
        journeyTitle: 'ನನ್ನ ಸಕ್ರಿಯ ಬೆಳೆ ಮತ್ತು ಕೇಂದ್ರ ಪ್ರವೇಶ ಪಯಣ',
        journeySub: 'ಒಪ್ಪಂದ #HVT-2026-8812 • ಫ್ರೆಶ್‌ಮಾರ್ಟ್‌ಗಾಗಿ 650 ಕೆಜಿ ಟೊಮ್ಯಾಟೊ',
        journeyStep1: 'ನೇರ ಒಪ್ಪಂದ ಅಂತಿಮಗೊಂಡಿದೆ',
        journeyStep2: 'ತೋಟದಿಂದ ವಾಹನ ಲೋಡಿಂಗ್ ಮುಗಿದಿದೆ',
        journeyStep3: 'ಡಿಜಿಟಲ್ ತೂಕ & ಬ್ರಿಕ್ಸ್ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ',
        journeyStep4: 'ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಡಿಬಿಟಿ ಜಮೆಯಾಗಿದೆ',
        btnTrackReefer: '📡 ವಾಹನ ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
        btnScaleSlip: '📄 ತೂಕದ ಚೀಟಿ ವೀಕ್ಷಿಸಿ',
        btnCallDriver: '📞 ಚಾಲಕನಿಗೆ ಕರೆ ಮಾಡಿ (ಕಿರಣ್)',

        // Where to Sell & Mandi
        whereToSellTitle: '"ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು?" ಸ್ಮಾರ್ಟ್ ಮಾರುಕಟ್ಟೆ ಸಲಹೆಗಾರ',
        whereToSellSub: 'ಸಾರಿಗೆ ಬಾಡಿಗೆ, ದಲ್ಲಾಳಿ ಕಮಿಷನ್ ಮತ್ತು ಕೊಳೆಯುವ ನಷ್ಟವನ್ನು ಕಳೆದು ನಿಮಗೆ ಹೆಚ್ಚು ಲಾಭ ತರುವ ಕೇಂದ್ರವನ್ನು ಪರಿಶೀಲಿಸಿ.',
        mandiCompTitle: 'ಲೈವ್ ಎಪಿಎಂಸಿ ಮಂಡಿ vs ಫಾರ್ಮ್‌ಫ್ಲೋ ನೇರ ನಿವ್ವಳ ಲಾಭ',
        mandiCompSub: 'ದಲ್ಲಾಳಿಗಳ ಕಮಿಷನ್ ಮತ್ತು ವ್ಯರ್ಥ ನಷ್ಟದ ನಂತರ ನಿಮ್ಮ ಕೈಗೆ ಸಿಗುವ ನಿಜವಾದ ಹಣವನ್ನು ನೋಡಿ.',
        mandiHeadline: 'ಸಾಂಪ್ರದಾಯಿಕ ಎಪಿಎಂಸಿ ಮಂಡಿ',
        farmFlowHeadline: 'ಫಾರ್ಮ್‌ಫ್ಲೋ ನೇರ ಖರೀದಿದಾರ ಒಪ್ಪಂದ',
        takeHomeText: 'ರೈತರ ಕೈಗೆ ಸಿಗುವ ನಿವ್ವಳ ಆದಾಯ',
        gainText: 'ಹೆಚ್ಚುವರಿ ನಿವ್ವಳ ಲಾಭ',

        // On-Demand Farm Logistics
        logisticsTitle: 'ಕೋಲ್ಡ್-ಚೈನ್ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಕೃಷಿ ಸಾರಿಗೆ ಸೇವೆ',
        logisticsSub: 'ತೋಟದಿಂದ ಕ್ಷಿಪ್ರ ವಾಹನ ಬುಕಿಂಗ್, ಶೈತ್ಯೀಕರಿಸಿದ ಹೈವೇ ಕಾರಿಡಾರ್ ಮತ್ತು ಚಾಲಕ ಪಾಲುದಾರರ ಆದಾಯ.',
        tabCorridor: 'ಕಾರಿಡಾರ್ ಮಾರ್ಗ ಸ್ಕೀಮ್ಯಾಟಿಕ್',
        tabBookPickup: 'ತೋಟದಿಂದ ವಾಹನ ಬುಕ್ ಮಾಡಿ',
        tabPartnerDesk: 'ಟ್ರಾನ್ಸ್‌ಪೋರ್ಟರ್ ಪಾಲುದಾರ ಡೆಸ್ಕ್',
        tabSpoilageSim: 'ತಾಪಮಾನ ಮತ್ತು ನಷ್ಟ ಲ್ಯಾಬ್',

        bookTransportTitle: 'ತೋಟದಿಂದ ತಕ್ಷಣದ ಕೃಷಿ ವಾಹನ ಬುಕಿಂಗ್',
        bookTransportSub: 'ಇ-ಲೋಡರ್, ಪಿಕಪ್ ಅಥವಾ ರೆಫ್ರಿಜರೇಟೆಡ್ ಟ್ರಕ್ 15 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ತೋಟಕ್ಕೆ ಬರುತ್ತದೆ.',
        fieldPickupLabel: 'ಪಿಕಪ್ ಸ್ಥಳ / ತೋಟ:',
        destHubLabel: 'ಗಮ್ಯಸ್ಥಾನ ಕೇಂದ್ರ:',
        cratesLabel: 'ಬೆಳೆಯ ಪ್ರಮಾಣ (ಕ್ರೇಟ್‌ಗಳು / ಕೆ.ಜಿ):',
        vehicleSelectLabel: 'ವಾಹನ ಆಯ್ಕೆಮಾಡಿ:',
        confirmBookingBtn: '⚡ ವಾಹನ ದೃಢೀಕರಿಸಿ',

        partnerDeskTitle: 'ಟ್ರಾನ್ಸ್‌ಪೋರ್ಟರ್ ಮತ್ತು ಚಾಲಕ ಪಾಲುದಾರ ಮಂಡಳಿ',
        partnerDeskSub: 'ಹತ್ತಿರದ ತೋಟಗಳಲ್ಲಿ ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು. ಟ್ರಿಪ್ ಸ್ವೀಕರಿಸಿ, ತಲುಪಿಸಿ ಮತ್ತು ತಕ್ಷಣ ದೈನಂದಿನ ಹಣ ಪಡೆಯಿರಿ.',
        statusOnline: '🟢 ನೀವು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ (ಟ್ರಿಪ್ ಲಭ್ಯವಿದೆ)',
        statusOffline: '🔴 ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ',
        acceptTripBtn: 'ಲೋಡ್ ಸ್ವೀಕರಿಸಿ',

        spoilageLabTitle: 'ತಾಪಮಾನ ಮತ್ತು ವಿಳಂಬ ನಷ್ಟ ಸಿಮ್ಯುಲೇಟರ್',
        spoilageLabSub: 'ಬಿಸಿಲು ಮತ್ತು ಟ್ರಾಫಿಕ್ ಜಾಮ್‌ನಲ್ಲಿ ತೆರೆದ ಗಾಡಿಯಲ್ಲಿ 30% ವರೆಗೆ ಕೊಳೆಯುತ್ತದೆ, ಆದರೆ ಫಾರ್ಮ್‌ಫ್ಲೋ ಶೈತ್ಯೀಕರಿಸಿದ ವಾಹನದಲ್ಲಿ ಸೊನ್ನೆ ನಷ್ಟ.',

        // FPO Practical Desks
        fpoTitle: 'ಗ್ರೀನ್‌ರೂಟ್ಸ್ ಕಿಸಾನ್ ಪ್ರೊಡ್ಯೂಸರ್ ಕಂಪನಿ (ಎಫ್‌ಪಿಒ ಡೆಸ್ಕ್)',
        fpoSub: 'ನಬಾರ್ಡ್ ಮತ್ತು ಎಸ್‌ಎಫ್‌ಎಸಿ ಅಡಿಯಲ್ಲಿ ಕೋಲಾರದ 242 ಸಣ್ಣ ರೈತರ ಸಾಮೂಹಿಕ ಸಂಸ್ಥೆ.',
        fpoTabQuota: '1. ಸದಸ್ಯ ಕೋಟಾ ಹಂಚಿಕೆ',
        fpoTabIntake: '2. ಡಿಜಿಟಲ್ ತೂಕ ಮತ್ತು ಸ್ವೀಕಾರ ಡೆಸ್ಕ್',
        fpoTabInputs: '3. ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ (ಸಿಹೆಚ್‌ಸಿ) ಮತ್ತು ಗೊಬ್ಬರ-ಬೀಜ',
        fpoTabLedger: '4. ಹಣಕಾಸು ಲೆಕ್ಕಪತ್ರ ಮತ್ತು ಲಾಭಾಂಶ',

        // Store
        storeTitle: 'ಕೋಲಾರದ ರೈತರ ತೋಟದಿಂದ ನೇರವಾಗಿ ನಿಮ್ಮ ಅಡುಗೆಮನೆಗೆ',
        storeSub: 'ಇಂದು ಬೆಳಿಗ್ಗೆ ಕೊಯ್ಲು ಮಾಡಿದ ತಾಜಾ ತರಕಾರಿಗಳು. ಸೂಪರ್‌ಮಾರ್ಕೆಟ್‌ಗಿಂತ 20-25% ಕಡಿಮೆ ಬೆಲೆ ಮತ್ತು 70%+ ಹಣ ನೇರವಾಗಿ ರೈತರಿಗೆ.',
        addToBasket: 'ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ',
        farmBasket: 'ಫಾರ್ಮ್ ಬುಟ್ಟಿ',

        // Control Tower (Admin)
        adminTitle: 'ಕಾರ್ಯಾಚರಣೆ ನಿಯಂತ್ರಣ ಗೋಪುರ ಮತ್ತು ಸಿಸ್ಟಮ್ ಆರ್ಕಿಟೆಕ್ಚರ್',
        adminSub: 'ಮಧ್ಯವರ್ತಿಗಳನ್ನು ತಪ್ಪಿಸಿ ಬೇಡಿಕೆ ಆಧಾರಿತ ನೇರ ಸಮನ್ವಯ: ರೈತರ ಆದಾಯ ದುಪ್ಪಟ್ಟು, ಆಹಾರ ವ್ಯರ್ಥ ಶೂನ್ಯ.',

        // Buyer Demand Board
        buyerDemandTitle: 'ಲೈವ್ ನೇರ ಖರೀದಿದಾರ ಬೇಡಿಕೆ ಮಂಡಳಿ (Live Buyer Demands)',
        buyerDemandSub: 'ಸೂಪರ್‌ಮಾರ್ಕೆಟ್‌ಗಳು, ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು ಮತ್ತು ವಸತಿ ಸಮುಚ್ಚಯಗಳಿಂದ ದೃಢೀಕೃತ ಬೇಡಿಕೆಗಳು. 100% ಬ್ಯಾಂಕ್ ಎಸ್ಕ್ರೋ ಭದ್ರತೆ.',
        acceptDemandBtn: '🤝 ಆಫರ್ ಒಪ್ಪಿ ಬೆಳೆ ಮಾರಿ',
        demandGainPill: 'ಮಂಡಿಗಿಂತ ಹೆಚ್ಚು',

        // Distress Sale Protection Shield
        distressTitle: 'ಬೆಲೆ ಕುಸಿತ ರಕ್ಷಣಾ ಕವಚ (Distress Sale Shield)',
        distressSub: 'ಮಂಡಿಯಲ್ಲಿ ಬೆಲೆ ಕುಸಿದಿದೆಯೇ? ನಷ್ಟದಲ್ಲಿ ಮಾರಬೇಡಿ! ಸೌರ ಕೋಲ್ಡ್ ರೂಮ್‌ನಲ್ಲಿರಿಸಿ ಮತ್ತು 70% ತಕ್ಷಣದ ಇ-ಎನ್‌ಡಬ್ಲ್ಯೂಆರ್ ಸಾಲ ಪಡೆಯಿರಿ.',
        btnClaimShield: '🛡️ ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್‌ನಲ್ಲಿರಿಸಿ ಮತ್ತು 70% ಮುಂಗಡ ಸಾಲ ಪಡೆಯಿರಿ',

        // Society Group Buy & Transparency
        societyGroupBuyTitle: 'ವಸತಿ ಸಮುಚ್ಚಯ ಸಾಮೂಹಿಕ ಖರೀದಿ ಹಬ್ (Group-Buy)',
        societyGroupBuySub: 'ಮಧ್ಯವರ್ತಿಗಳ ಕಮಿಷನ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ತೋಟದಿಂದ ಸಗಟು ದರದಲ್ಲಿ ತಾಜಾ ತರಕಾರಿ ಪಡೆಯಲು ನೆರೆಹೊರೆಯವರೊಂದಿಗೆ ಸೇರಿ.',
        btnChangeSociety: 'ಸೊಸೈಟಿ ಹಬ್ ಬದಲಾಯಿಸಿ',
        priceTransparencyTitle: 'ನಿಮ್ಮ ಪ್ರತಿ ₹100 ಹಣ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತದೆ?',
        priceTransparencySub: 'ನಿಮ್ಮ ಹಣದ 70%+ ಭಾಗ ನೇರವಾಗಿ ಕಷ್ಟಪಟ್ಟು ಬೆಳೆದ ರೈತನಿಗೆ ತಲುಪುತ್ತದೆ ಎಂದು ಸಾಬೀತುಪಡಿಸುವ ವಿವರ.',

        // Voice Message
        voiceAdvisory: 'ಫಾರ್ಮ್‌ಫ್ಲೋಗೆ ಸ್ವಾಗತ. ಇಂದು ಟೊಮ್ಯಾಟೊ ಗ್ರೇಡ್-ಎ ಫ್ರೆಶ್‌ಮಾರ್ಟ್‌ಗೆ 26 ರೂಪಾಯಿಗೆ ಮಾರಾಟವಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ಗೆ 23 ರೂಪಾಯಿ 50 ಪೈಸೆ ಸಿಗುತ್ತದೆ, ಮಂಡಿಯಲ್ಲಿ ಕೇವಲ 11 ರೂಪಾಯಿ ಮಾತ್ರ.'
      }
    },

    get(key) {
      const lang = this.currentLang;
      if (this.translations[lang] && this.translations[lang][key]) {
        return this.translations[lang][key];
      }
      return (this.translations['en'] && this.translations['en'][key]) || key;
    },

    setLang(lang) {
      if (this.translations[lang]) {
        this.currentLang = lang;
        document.documentElement.lang = lang;
        try {
          localStorage.setItem('ff_lang', lang);
        } catch (e) {}
        return true;
      }
      return false;
    },

    init() {
      try {
        const saved = localStorage.getItem('ff_lang');
        if (saved && this.translations[saved]) {
          this.currentLang = saved;
          document.documentElement.lang = saved;
          const select = document.getElementById('lang-select');
          if (select) select.value = saved;
        }
      } catch (e) {}
    }
  };
})();
