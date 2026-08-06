import Lenis from '@studio-freight/lenis';
import { createIcons, Volume2, VolumeX, Play, Pause, Sparkles, Heart } from 'lucide';
import CONFIG from './config.js';
import stateMachine, { STATES } from './stateMachine.js';
import audioManager from './audioManager.js';
import ParticleSystem from './particles.js';
import { animateWelcomeEntrance, openGiftBoxAnimation } from './animations.js';
import { initMemoriesStage } from './memories.js';
import { initLetterStage } from './letter.js';
import { initCakeStage } from './cake.js';
let lenis = null;
let particleSystem = null;
let giftBoxOpened = false;
let audioInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  console.log('[App] Initializing Birthday Experience...');

  // 1. Populate dynamic config values
  populateConfigValues();

  // 2. Initialize Lucide Icons
  createIcons({
    icons: {
      Volume2,
      VolumeX,
      Play,
      Pause,
      Sparkles,
      Heart
    }
  });

  // 3. User interaction listener to initialize audio context
  setupUserInteractionAudioInit();

  // 4. Initialize Lenis Smooth Scroll
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (err) {
    console.warn('[Lenis] Smooth scroll init skipped:', err);
  }

  // 5. Initialize Particle System
  particleSystem = new ParticleSystem('particle-canvas');

  // 6. Setup Audio Overlay Controls (Play/Pause, Mute, Volume)
  setupAudioControls();

  // 7. Setup Stage 1 (Welcome) Interaction
  setupWelcomeStage();

  // 8. Subscribe StateMachine transitions
  stateMachine.subscribe((newState, oldState) => {
    handleStateTransition(newState, oldState);
  });

  // 9. Entrance Animation
  animateWelcomeEntrance();
}

function populateConfigValues() {
  const recipientEls = document.querySelectorAll('.recipient-name');
  recipientEls.forEach(el => {
    el.textContent = CONFIG.recipientName || 'Someone Special';
  });

  const portraitQuote = document.getElementById('portrait-quote');
  if (portraitQuote) {
    portraitQuote.textContent = `"${CONFIG.birthdayMessage || 'May your special day be filled with magic and joy!'}"`;
  }
}

function setupUserInteractionAudioInit() {
  const initAudio = () => {
    if (audioInitialized) return;
    audioInitialized = true;

    // Load track silently if audio enabled
    if (CONFIG.musicEnabled && !audioManager.currentTrack) {
      audioManager.audioElement.src = audioManager.tracks.welcome;
      audioManager.audioElement.load();
    }

    window.removeEventListener('pointerdown', initAudio);
    window.removeEventListener('keydown', initAudio);
  };

  window.addEventListener('pointerdown', initAudio, { once: true });
  window.addEventListener('keydown', initAudio, { once: true });
}

function setupAudioControls() {
  const playPauseBtn = document.getElementById('audio-play-pause');
  const muteBtn = document.getElementById('audio-toggle');
  const volumeSlider = document.getElementById('audio-volume');

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (!audioManager.currentTrack) {
        audioManager.playTrack('welcome', 0.5, 500);
      } else {
        audioManager.togglePlay();
      }
      updateAudioUI();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audioManager.toggleMute();
      updateAudioUI();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audioManager.setVolume(e.target.value);
    });
  }
}

function updateAudioUI() {
  const playIconContainer = document.getElementById('audio-play-icon');
  const muteIconContainer = document.getElementById('audio-icon');

  if (playIconContainer) {
    if (audioManager.isPlaying) {
      playIconContainer.setAttribute('data-lucide', 'pause');
    } else {
      playIconContainer.setAttribute('data-lucide', 'play');
    }
  }

  if (muteIconContainer) {
    if (audioManager.isMuted) {
      muteIconContainer.setAttribute('data-lucide', 'volume-x');
    } else {
      muteIconContainer.setAttribute('data-lucide', 'volume-2');
    }
  }

  createIcons({
    icons: { Volume2, VolumeX, Play, Pause, Sparkles, Heart }
  });
}

function setupWelcomeStage() {
  const giftTrigger = document.getElementById('gift-box-trigger');
  if (!giftTrigger) return;

  const handleOpenGift = () => {
    if (giftBoxOpened) return;
    giftBoxOpened = true;

    if (CONFIG.musicEnabled) {
      audioManager.playTrack('welcome', 0.6, 500);
      updateAudioUI();
    }

    openGiftBoxAnimation(() => {
      console.log('[WelcomeStage] Gift Box Sequence finished - Transitioning to Stage 2...');
      stateMachine.transitionTo(STATES.CAKE);
    });
  };

  giftTrigger.addEventListener('click', handleOpenGift);
  giftTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenGift();
    }
  });
}

function handleStateTransition(newState, oldState) {
  console.log(`[App] Transitioned state: ${oldState} -> ${newState}`);

  if (newState === STATES.CAKE) {
    // Audio Crossfade: welcome.mp3 -> cake.mp3 over 1 second
    if (CONFIG.musicEnabled) {
      audioManager.playTrack('cake', 0.5, 1000);
      updateAudioUI();
    }

    const welcomeSec = document.getElementById('stage-welcome');
    const cakeSec = document.getElementById('stage-cake');

    if (welcomeSec) {
      welcomeSec.classList.remove('active');
      welcomeSec.classList.add('hidden');
    }

    if (cakeSec) {
      cakeSec.classList.remove('hidden');
      cakeSec.classList.add('active');
      cakeSec.style.opacity = '1';
      cakeSec.style.scale = '1';

      // Initialize Stage 2 Cake
      initCakeStage();
    }
  } else if (newState === STATES.MEMORIES) {
    console.log('[App] Transitioned state to Stage 3 (STATE_MEMORIES)');

    // Audio Crossfade: cake.mp3 -> memories.mp3 over 1 second
    if (CONFIG.musicEnabled) {
      audioManager.playTrack('memories', 0.5, 1000);
      updateAudioUI();
    }

    const cakeSec = document.getElementById('stage-cake');
    const memoriesSec = document.getElementById('stage-memories');

    if (cakeSec) {
      cakeSec.classList.remove('active');
      cakeSec.classList.add('hidden');
    }

    if (memoriesSec) {
      memoriesSec.classList.remove('hidden');
      memoriesSec.classList.add('active');
      memoriesSec.style.opacity = '1';
      memoriesSec.style.scale = '1';

      // Initialize Stage 3 Memories
      initMemoriesStage();
    }
  } else if (newState === STATES.LETTER) {
    console.log('[App] Transitioned state to Stage 4 (STATE_LETTER)');

    // Audio Crossfade: memories.mp3 -> letter.mp3 over 1 second
    if (CONFIG.musicEnabled) {
      audioManager.playTrack('letter', 0.5, 1000);
      updateAudioUI();
    }

    const memoriesSec = document.getElementById('stage-memories');
    const letterSec = document.getElementById('stage-letter');

    if (memoriesSec) {
      memoriesSec.classList.remove('active');
      memoriesSec.classList.add('hidden');
    }

    if (letterSec) {
      letterSec.classList.remove('hidden');
      letterSec.classList.add('active');
      letterSec.style.opacity = '1';
      letterSec.style.scale = '1';

      // Initialize Stage 4 Letter & Grand Finale
      initLetterStage();
    }
  }
}
