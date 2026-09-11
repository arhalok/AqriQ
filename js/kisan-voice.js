/**
 * FarmFlow Kisan - "Kisan Vani" Voice & Audio Assistant (किसान वाणी)
 * Web Speech Synthesis + Web Audio API Chimes + Interactive Floating Subtitle Bar
 * Aligned to SIH 2026 Problem Statement 33 (Zero Middlemen, Transparent Realization)
 */

(function () {
  'use strict';

  window.FF_VOICE = {
    isSpeaking: false,
    synth: ('speechSynthesis' in window) ? window.speechSynthesis : null,
    audioCtx: null,
    currentText: '',
    voices: [],

    init() {
      if (this.synth) {
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
    },

    loadVoices() {
      if (this.synth) {
        this.voices = this.synth.getVoices() || [];
      }
    },

    // Audio Context chime synthesizer (guaranteed audio feedback in all browsers)
    playChime() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) {
          this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;
        // Warm 3-tone ascending chime (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.001, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.1 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.22);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.25);
        });
      } catch (err) {
        console.warn('Audio chime notice:', err);
      }
    },

    // Render / update the interactive floating voice bar
    showFloatingVoiceBar(text, title = 'किसान वाणी (Kisan Vani)') {
      let bar = document.getElementById('kisan-floating-voice-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'kisan-floating-voice-bar';
        bar.className = 'kisan-floating-voice-bar';
        document.body.appendChild(bar);
      }

      bar.innerHTML = `
        <div class="voice-bar-inner">
          <div class="voice-bar-left">
            <div class="voice-wave-anim">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </div>
            <div class="voice-bar-text-area">
              <div class="voice-bar-title">
                <span>🎙️ ${title}</span>
                <span class="voice-status-pill">● Audio Active</span>
              </div>
              <div class="voice-bar-subtitle">${text}</div>
            </div>
          </div>
          <div class="voice-bar-controls">
            <button class="btn-voice-ctrl" onclick="window.FF_VOICE.replayCurrent()" title="फिर से सुनें (Replay)">
              <span>🔁</span>
              <span>Replay</span>
            </button>
            <button class="btn-voice-ctrl btn-voice-stop" onclick="window.FF_VOICE.stop()" title="रोकें (Stop)">
              <span>⏹️</span>
              <span>Stop</span>
            </button>
            <button class="btn-voice-close" onclick="window.FF_VOICE.hideFloatingVoiceBar()" title="बंद करें">✕</button>
          </div>
        </div>
      `;

      bar.classList.add('visible');
    },

    hideFloatingVoiceBar() {
      const bar = document.getElementById('kisan-floating-voice-bar');
      if (bar) {
        bar.classList.remove('visible');
      }
    },

    replayCurrent() {
      if (this.currentText) {
        this.speak(this.currentText);
      }
    },

    // Main Speak function with cross-browser and Linux robustness
    speak(text, langCode) {
      this.currentText = text;
      this.isSpeaking = true;

      // Always play acoustic chime first
      this.playChime();

      // Display the interactive floating voice subtitle bar
      const isHi = (langCode || window.FF_I18N.currentLang) === 'hi';
      this.showFloatingVoiceBar(text, isHi ? 'किसान वाणी बोल रही है...' : 'Kisan Vani Speaking...');

      // Highlight header and hero buttons
      const btnHeader = document.getElementById('btn-kisan-vani');
      if (btnHeader) btnHeader.classList.add('speaking');

      if (!this.synth) {
        console.warn('SpeechSynthesis unavailable; fallback audio & visual subtitle bar displayed.');
        return;
      }

      try {
        // Cancel ongoing utterance
        this.synth.cancel();

        if (this.synth.paused) {
          this.synth.resume();
        }

        // Chromium bug fix: wait 60ms after cancel before invoking speak
        setTimeout(() => {
          try {
            const lang = langCode || window.FF_I18N.currentLang;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.92; // Deliberate relaxed pace for clear comprehension
            utterance.pitch = 1.05;

            // Pick matching voice
            if (this.voices.length === 0) {
              this.loadVoices();
            }

            if (lang === 'hi') {
              utterance.lang = 'hi-IN';
              const hiVoice = this.voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi'));
              if (hiVoice) utterance.voice = hiVoice;
            } else if (lang === 'kn') {
              utterance.lang = 'kn-IN';
              const knVoice = this.voices.find(v => v.lang.includes('kn') || v.name.includes('Kannada'));
              if (knVoice) utterance.voice = knVoice;
            } else {
              utterance.lang = 'en-IN';
              const inVoice = this.voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
              if (inVoice) utterance.voice = inVoice;
            }

            utterance.onend = () => {
              this.isSpeaking = false;
              if (btnHeader) btnHeader.classList.remove('speaking');
              const waveAnim = document.querySelector('.voice-wave-anim');
              if (waveAnim) waveAnim.classList.add('paused');
              const statusPill = document.querySelector('.voice-status-pill');
              if (statusPill) {
                statusPill.textContent = '✓ Completed';
                statusPill.style.background = '#16a34a';
              }
            };

            utterance.onerror = (err) => {
              console.warn('Speech synthesis event notice:', err);
              this.isSpeaking = false;
              if (btnHeader) btnHeader.classList.remove('speaking');
            };

            this.synth.speak(utterance);
          } catch (e) {
            console.warn('Utterance execution notice:', e);
          }
        }, 60);

      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
      }
    },

    stop() {
      if (this.synth) {
        try {
          this.synth.cancel();
        } catch (e) {}
      }
      this.isSpeaking = false;
      const btnHeader = document.getElementById('btn-kisan-vani');
      if (btnHeader) btnHeader.classList.remove('speaking');
      this.hideFloatingVoiceBar();
      if (window.FF_APP) window.FF_APP.showToast('आवाज रोक दी गई है (Voice Stopped).', 'info');
    },

    // Primary entry point called from Hero Advisory Bar
    playAdvisory() {
      this.readDailyAdvisory();
    },

    // Read the daily farmer broadcast (aligned to SIH 2026 PS 33)
    readDailyAdvisory() {
      const lang = window.FF_I18N.currentLang;
      let text = '';

      if (lang === 'hi') {
        text = 'नमस्ते रमेश जी! फार्मफ्लो में आज आपका स्वागत है। ई-नाम और कोलार मंडी में बिचौलियों के कारण टमाटर केवल 11 रुपये बिक रहा है, लेकिन फार्मफ्लो पर फ्रेशमार्ट को सीधे बेचकर आपको 23 रुपये 50 पैसे प्रति किलो मिलेंगे। नीचे हरा बटन दबाकर सीधे बेचें, या नीला बटन दबाकर 15 मिनट में अपने खेत पर गाड़ी बुलाएं। धर्मकांटे पर तौल होते ही पूरे पैसे 2 घंटे में सीधे आपके स्टेट बैंक खाते में जमा हो जाएंगे।';
      } else if (lang === 'kn') {
        text = 'ನಮಸ್ಕಾರ ರಮೇಶ್ ಪಟೇಲ್ ಅವರೇ! ಫಾರ್ಮ್‌ಫ್ಲೋಗೆ ಸುಸ್ವಾಗತ. ಕೋಲಾರ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ಕೇವಲ 11 ರೂಪಾಯಿಗೆ ಮಾರಾಟವಾಗುತ್ತಿದೆ, ಆದರೆ ಫಾರ್ಮ್‌ಫ್ಲೋ ನೇರ ಮಾರಾಟದಲ್ಲಿ ನಿಮಗೆ 23 ರೂಪಾಯಿ 50 ಪೈಸೆ ಸಿಗುತ್ತದೆ. ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಲು ಹಸಿರು ಬಟನ್ ಒತ್ತಿ.';
      } else {
        text = 'Welcome Ramesh Patel! While APMC Mandi brokers pay only 11 rupees per kg for tomato, FarmFlow guarantees you 23 rupees 50 paise net take-home by selling directly to FreshMart. Tap the green card to lock your contract or tap the blue card to dispatch an EV loader to your farmgate in 15 minutes. 100% bank DBT escrow settlement within 2 hours.';
      }

      this.speak(text, lang);
      if (window.FF_APP) {
        window.FF_APP.showToast('🔊 किसान वाणी: आज का सीधा भाव और बिचौलिया-मुक्त सलाह शुरू...', 'success');
      }
    },

    // Narrate specific action card for illiterate farmers
    narrateCard(cardKey) {
      const lang = window.FF_I18N.currentLang;
      const dict = (window.FF_DATA.kisanVoiceAdvisories && window.FF_DATA.kisanVoiceAdvisories[lang]) 
        || (window.FF_DATA.kisanVoiceAdvisories && window.FF_DATA.kisanVoiceAdvisories['hi'])
        || {};

      let text = dict[cardKey];
      if (!text) {
        if (cardKey === 'sell') {
          text = 'फसल बेचें: यहाँ आप सीधे सुपरमार्केट और सोसायटियों को बिना किसी आढ़तिया कमीशन के अपनी फसल बेच सकते हैं। 100% बैंक एस्क्रो गारंटी के साथ ₹23.50 प्रति किलो का पक्का भाव पाएं।';
        } else if (cardKey === 'transport') {
          text = 'खेत से गाड़ी बुलाएं: 15 मिनट में आपके खेत के दरवाजे पर महिंद्रा ई-लोडर पिकअप आ जाएगा। छोटे किसानों के लिए साझा भाड़ा मात्र 150 रुपये है। मंडी के महंगे भाड़े से ₹350 प्रति क्विंटल बचाएं।';
        } else if (cardKey === 'weighbridge') {
          text = 'डिजिटल धर्मकांटा व बैंक खाता: विलेज स्पोक पर डिजिटल कांटे से तौल कराएं। मंडी में होने वाली 2.5 किलो की वजन चोरी से बचें। तौल पर्ची कटते ही पूरे पैसे 2 घंटे में सीधे आपके एसबीआई खाते में आएंगे।';
        } else if (cardKey === 'storage') {
          text = 'संकट बिक्री सुरक्षा व 70% लोन: मंडी में आज भाव गिरकर 9 रुपये हो गए हैं। घाटे में सड़क पर टमाटर न फेंकें। विलेज सोलर कोल्ड रूम में फसल रखें और 70% नकद अग्रिम ऋण तुरंत अपने बैंक खाते में पाएं।';
        } else if (cardKey === 'doctor') {
          text = 'फसल डॉक्टर: खराब या बीमार पत्ते की फोटो खींचें और 2 सेकंड में आईसीएआर प्रमाणित जैविक खाद और घरेलू उपचार जानें।';
        } else {
          text = 'फार्मफ्लो किसान में आपका स्वागत है। बिचौलियों से मुक्ति और पारदर्शी भाव का डिजिटल मंच।';
        }
      }

      this.speak(text, lang);
      if (window.FF_APP) {
        window.FF_APP.showToast(`🔊 किसान वाणी: ${text.slice(0, 60)}...`, 'info');
      }
    }
  };

  // Initialize on script load
  if (typeof window !== 'undefined') {
    window.FF_VOICE.init();
  }
})();
