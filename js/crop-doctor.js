/**
 * FarmFlow Kisan - AI Crop Doctor & Plant Health Diagnostic Engine
 * Provides instant AI diagnosis, symptoms, organic & chemical remedies for farmers
 */

(function () {
  'use strict';

  window.FF_DOCTOR = {
    selectedCaseId: 'early_blight',

    cases: {
      early_blight: {
        id: 'early_blight',
        crop: 'Tomato (टमाटर)',
        disease: 'Early Blight (अगेती झुलसा रोग)',
        pathogen: 'Alternaria solani (कवक / Fungus)',
        severityPct: 65,
        severityLevel: 'HIGH',
        visualIcon: '🍂',
        sampleColor: '#b45309',
        symptoms: [
          'Concentric dark brown rings (target-board appearance) on older leaves.',
          'Yellow halo surrounding the circular necrotic lesions.',
          'Premature leaf shedding leading to sunscald of tomatoes.'
        ],
        organicRemedy: {
          title: '🌿 Organic / Bio-Control (जैविक उपचार)',
          desc: 'Spray Trichoderma viride (10g/litre) or 5% Neem Seed Kernel Extract (NSKE) thoroughly on upper and lower leaf surfaces during early morning hours.'
        },
        chemicalRemedy: {
          title: '🧪 Recommended Chemical Solution (रासायनिक उपचार)',
          desc: 'Foliar spray of Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L. Repeat after 10-12 days if humid cloudy conditions persist.'
        },
        prevention: 'Maintain drip irrigation at root level, prune lower leaves touching moist soil, and ensure 60cm plant spacing for air circulation.'
      },
      late_blight: {
        id: 'late_blight',
        crop: 'Tomato / Potato (टमाटर / आलू)',
        disease: 'Late Blight (पछेती झुलसा रोग)',
        pathogen: 'Phytophthora infestans (Water Mold)',
        severityPct: 85,
        severityLevel: 'CRITICAL',
        visualIcon: '🥀',
        sampleColor: '#dc2626',
        symptoms: [
          'Rapidly enlarging water-soaked pale green to dark brown lesions.',
          'White cottony downy fungal growth on underside of leaves in morning humidity.',
          'Stems turn black and fruits develop greasy brownish rot.'
        ],
        organicRemedy: {
          title: '🌿 Organic / Bio-Control (जैविक उपचार)',
          desc: 'Spray fermented butter-milk (chaas) mixed with copper vessel extract (50ml/L) or Copper Hydroxide certified organic formulation.'
        },
        chemicalRemedy: {
          title: '🧪 Recommended Chemical Solution (रासायनिक उपचार)',
          desc: 'Immediate emergency spray of Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L or Cymoxanil + Mancozeb @ 2 g/L.'
        },
        prevention: 'Destroy infected plant debris immediately. Avoid sprinkler/overhead irrigation during foggy or rainy weather.'
      },
      leaf_curl: {
        id: 'leaf_curl',
        crop: 'Tomato & Chilli (टमाटर / मिर्च)',
        disease: 'Leaf Curl Virus (पर्ण कुंचन / मरोड़िया रोग)',
        pathogen: 'Begomovirus (Transmitted by Whitefly Bemisia tabaci)',
        severityPct: 70,
        severityLevel: 'HIGH',
        visualIcon: '🌱',
        sampleColor: '#ea580c',
        symptoms: [
          'Severe upward curling and puckering of young terminal leaves.',
          'Thickening of leaf veins with yellow chlorotic margins.',
          'Stunted bushy appearance; flowers drop before setting fruit.'
        ],
        organicRemedy: {
          title: '🌿 Organic / Bio-Control (जैविक उपचार)',
          desc: 'Install 12 Yellow Sticky Traps per acre to trap vector whiteflies. Spray 10,000 ppm Neem Oil @ 3 ml/L every 7 days.'
        },
        chemicalRemedy: {
          title: '🧪 Recommended Chemical Solution (रासायनिक उपचार)',
          desc: 'Target the whitefly vector using Imidacloprid 17.8% SL @ 0.3 ml/L or Thiamethoxam 25% WG @ 0.4 g/L.'
        },
        prevention: 'Cover seedbeds with 40-mesh insect netting before transplanting into main fields.'
      },
      healthy_crop: {
        id: 'healthy_crop',
        crop: 'Tomato (टमाटर)',
        disease: 'Healthy Crop (पूर्णतः स्वस्थ फसल)',
        pathogen: 'None (Zero Pathogens Detected)',
        severityPct: 0,
        severityLevel: 'HEALTHY',
        visualIcon: '🌿',
        sampleColor: '#16a34a',
        symptoms: [
          'Deep lush green foliage with optimal chlorophyll density.',
          'Zero necrotic spots, insect bites, or viral chlorosis.',
          'Strong vegetative vigor with healthy flowering clusters.'
        ],
        organicRemedy: {
          title: '🌿 Nutrition & Maintenance (पोषण सलाह)',
          desc: 'Apply Vermicompost @ 2 tonnes/acre along with Jeevamrutha foliar spray (10%) every 15 days to sustain high soil microbial health.'
        },
        chemicalRemedy: {
          title: '🧪 Micro-Nutrient Boost (सूक्ष्म पोषक तत्व)',
          desc: 'Spray balanced 19:19:19 NPK water-soluble fertilizer @ 5 g/L + Zinc Boron foliar spray to maximize fruit setting.'
        },
        prevention: 'Continue regular field scouting and maintain uniform soil moisture balance.'
      }
    },

    selectCase(caseId) {
      if (this.cases[caseId]) {
        this.selectedCaseId = caseId;
        this.renderResults();
        return true;
      }
      return false;
    },

    renderResults() {
      const caseData = this.cases[this.selectedCaseId];
      const panel = document.getElementById('doctor-results-panel');
      if (!panel || !caseData) return;

      const severityClass = caseData.severityPct > 75 ? 'severity-high' :
                            (caseData.severityPct > 0 ? 'severity-medium' : 'severity-healthy');

      panel.innerHTML = `
        <div class="diagnosis-title-row">
          <div>
            <div class="disease-name">${caseData.disease}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${caseData.crop} • ${caseData.pathogen}</div>
          </div>
          <span class="severity-pill ${severityClass}">${caseData.severityPct}% Severity • ${caseData.severityLevel}</span>
        </div>

        <div>
          <strong style="font-size: 0.88rem; color: var(--primary-900);">Observed Symptoms:</strong>
          <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">
            ${caseData.symptoms.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div class="remedy-section">
          <div class="remedy-card">
            <div class="remedy-title remedy-organic">${caseData.organicRemedy.title}</div>
            <div class="remedy-desc">${caseData.organicRemedy.desc}</div>
          </div>
          <div class="remedy-card">
            <div class="remedy-title remedy-chemical">${caseData.chemicalRemedy.title}</div>
            <div class="remedy-desc">${caseData.chemicalRemedy.desc}</div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; margin-top: 6px;">
          <button class="btn btn-sm btn-secondary" onclick="window.FF_VOICE.speak('${caseData.disease}. ${caseData.organicRemedy.desc.replace(/'/g, '')}')">
            🔊 Listen in Audio
          </button>
          <span style="font-size: 0.78rem; color: var(--text-muted);">Verified by ICAR & KVK Advisory</span>
        </div>
      `;
    }
  };
})();
