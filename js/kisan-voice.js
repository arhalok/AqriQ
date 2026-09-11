/**
 * FarmFlow Kisan - "Kisan Vani" Voice & Audio Assistant (किसान वाणी)
 * Web Speech Synthesis & Voice Navigation for Farmer Accessibility
 */

(function () {
  'use strict';

  window.FF_VOICE = {
    isSpeaking: false,
    synth: ('speechSynthesis' in window) ? window.speechSynthesis : null,

    // Speak a localized message
    speak(text, langCode) {
      if (!this.synth) {
        console.warn('Speech synthesis not supported in this browser environment.');
        return false;
      }

      // Cancel ongoing speech
      this.synth.cancel();

      const lang = langCode || window.FF_I18N.currentLang;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly relaxed pace for farmer clarity
      utterance.pitch = 1.0;

      // Assign appropriate language voice code
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'kn') utterance.lang = 'kn-IN';
      else if (lang === 'ta') utterance.lang = 'ta-IN';
      else if (lang === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';

      const btn = document.getElementById('btn-kisan-vani');
      if (btn) btn.classList.add('speaking');
      this.isSpeaking = true;

      utterance.onend = () => {
        if (btn) btn.classList.remove('speaking');
        this.isSpeaking = false;
      };

      utterance.onerror = (e) => {
        console.warn('Voice playback error or interrupted:', e);
        if (btn) btn.classList.remove('speaking');
        this.isSpeaking = false;
      };

      this.synth.speak(utterance);
      return true;
    },

    stop() {
      if (this.synth) {
        this.synth.cancel();
        this.isSpeaking = false;
        const btn = document.getElementById('btn-kisan-vani');
        if (btn) btn.classList.remove('speaking');
      }
    },

    // Read the daily farmer broadcast
    readDailyAdvisory() {
      if (this.isSpeaking) {
        this.stop();
        if (window.FF_APP) window.FF_APP.showToast('Voice playback stopped.', 'info');
        return;
      }

      const text = window.FF_I18N.get('voiceAdvisory');
      this.speak(text);
      if (window.FF_APP) {
        window.FF_APP.showToast('🔊 Kisan Vani: Playing today\'s market advisory audio...', 'success');
      }
    }
  };
})();
