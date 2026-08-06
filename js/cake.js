// Stage 2: Interactive Birthday Cake Module (Refined Click-Only Experience)

import gsap from 'gsap';
import confetti from 'canvas-confetti';
import stateMachine, { STATES } from './stateMachine.js';
import audioManager from './audioManager.js';
import CONFIG from './config.js';

let currentActiveIndex = 0;
let extinguishedCount = 0;

export function initCakeStage() {
  console.log('[CakeStage] Initializing Stage 2 Interactive Cake...');

  currentActiveIndex = 0;
  extinguishedCount = 0;

  // 1. Set up initial candle active states
  updateCandleStates();

  // 2. Bind candle click & keyboard events
  bindCandleEvents();

  // 3. Entrance GSAP Animation for Stage 2 Cake & Icing Text
  animateCakeEntrance();
}

function updateCandleStates() {
  const badge = document.getElementById('candle-progress-badge');
  if (badge) {
    badge.textContent = `${extinguishedCount} / 5 Candles`;
  }

  for (let i = 0; i < 5; i++) {
    const candleEl = document.getElementById(`candle-${i}`);
    if (!candleEl) continue;

    const indicator = candleEl.querySelector('.active-guide-indicator');

    if (i < extinguishedCount) {
      // Extinguished candle
      candleEl.classList.add('extinguished');
      candleEl.classList.remove('active-candle');
      if (indicator) indicator.classList.add('hidden');
    } else if (i === currentActiveIndex) {
      // Current active candle
      candleEl.classList.add('active-candle');
      candleEl.classList.remove('extinguished');
      if (indicator) indicator.classList.remove('hidden');
    } else {
      // Inactive upcoming candle
      candleEl.classList.remove('active-candle', 'extinguished');
      if (indicator) indicator.classList.add('hidden');
    }
  }

  const guidanceText = document.getElementById('cake-guidance-text');
  if (guidanceText) {
    if (extinguishedCount < 5) {
      guidanceText.textContent = `Tap candle ${currentActiveIndex + 1} of 5 to blow it out ✨`;
    } else {
      guidanceText.textContent = `All candles blown out! ✨`;
    }
  }
}

function bindCandleEvents() {
  for (let i = 0; i < 5; i++) {
    const candleEl = document.getElementById(`candle-${i}`);
    if (!candleEl) continue;

    candleEl.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(`[CakeStage] Candle ${i} clicked! currentActiveIndex = ${currentActiveIndex}`);
      if (i === currentActiveIndex && i < 5 && !candleEl.classList.contains('extinguished')) {
        extinguishCandle(i);
      }
    };

    candleEl.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        console.log(`[CakeStage] Candle ${i} keydown! currentActiveIndex = ${currentActiveIndex}`);
        if (i === currentActiveIndex && i < 5 && !candleEl.classList.contains('extinguished')) {
          extinguishCandle(i);
        }
      }
    };
  }
}

function extinguishCandle(index) {
  const candleEl = document.getElementById(`candle-${index}`);
  if (!candleEl || candleEl.classList.contains('extinguished')) return;

  candleEl.classList.add('extinguished');
  extinguishedCount++;
  if (currentActiveIndex < 4) {
    currentActiveIndex++;
  }
  updateCandleStates();

  const flameEl = candleEl.querySelector('.candle-flame');
  const glowEl = candleEl.querySelector('.candle-glow');
  const smokeEl = candleEl.querySelector('.candle-smoke');

  const tl = gsap.timeline({
    onComplete: () => {
      if (extinguishedCount === 5) {
        triggerWishSequence();
      }
    }
  });

  // 1. Natural flame shrink & disappear
  if (flameEl) {
    tl.to(flameEl, {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in'
    });
  }

  // 2. Glow disappears
  if (glowEl) {
    tl.to(glowEl, {
      opacity: 0,
      duration: 0.25
    }, '-=0.2');
  }

  // 3. Smoke rises & fades
  if (smokeEl) {
    tl.fromTo(smokeEl, 
      { y: 0, opacity: 0.8, scale: 0.6 },
      { y: -45, opacity: 0, scale: 2.2, duration: 1.1, ease: 'power1.out' },
      '-=0.15'
    );
  }

  // 4. Tiny sparkle pop burst
  triggerCandlePopSparkle(candleEl);
}

function triggerCandlePopSparkle(candleEl) {
  const rect = candleEl.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 3) / window.innerHeight;

  confetti({
    particleCount: 25,
    spread: 50,
    startVelocity: 25,
    origin: { x, y },
    colors: ['#ffd700', '#facc15', '#ffffff', '#ec4899']
  });
}

function animateCakeEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#cake-header-container', 
    { opacity: 0, y: -30 }, 
    { opacity: 1, y: 0, duration: 1.0 }
  )
  .fromTo('#cake-wrapper', 
    { opacity: 0, scale: 0.7, y: 50 }, 
    { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.5)' }, 
    '-=0.7'
  )
  .fromTo('#cake-icing-message', 
    { opacity: 0, scale: 0.85, y: 5 }, 
    { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 
    '-=0.8'
  );
}

function triggerWishSequence() {
  console.log('[CakeStage] All 5 candles blown out! Starting final transition sequence...');

  // Step 1: Wait ~1 second after 5th candle
  gsap.delayedCall(1.0, () => {
    
    // Step 2: Hide top header & guidance
    gsap.to('#cake-header-container', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.in'
    });

    // Step 3: Keep & brighten background rays & magical glow around cake
    gsap.to('#cake-light-rays', {
      opacity: 0.85,
      duration: 1.2,
      ease: 'power2.out'
    });

    gsap.to('#cake-ambient-glow', {
      scale: 1.4,
      opacity: 0.65,
      duration: 1.5
    });

    // Step 4: Display new two-line final message ("Before we continue...\nthere's something I want to show you. ❤️")
    const wishBanner = document.getElementById('wish-banner-container');
    if (wishBanner) {
      gsap.fromTo(wishBanner, 
        { opacity: 0, scale: 0.85, y: -20 },
        { opacity: 1, scale: 1, y: -85, duration: 1.4, ease: 'back.out(1.4)' }
      );
    }

    // Step 5: Floating sparkles & heart confetti explosion
    confetti({
      particleCount: 160,
      spread: 110,
      startVelocity: 45,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#facc15', '#ffffff', '#ec4899', '#a855f7']
    });

    // Step 6: Slowly zoom toward cake while keeping cake.mp3 playing
    gsap.to('#cake-3d', {
      scale: 1.15,
      y: -15,
      duration: 2.8,
      ease: 'power2.out'
    });

    // Step 7: Hold this emotional scene for ~3.2 seconds, then smoothly transition to Stage 3 (STATE_MEMORIES)
    gsap.delayedCall(3.2, () => {
      console.log('[CakeStage] Transitioning from Stage 2 (Cake) to Stage 3 (Memories)...');

      // Fade out Stage 2 smoothly
      gsap.to('#stage-cake', {
        opacity: 0,
        scale: 1.05,
        duration: 1.0,
        ease: 'power3.inOut',
        onComplete: () => {
          stateMachine.transitionTo(STATES.MEMORIES);
        }
      });
    });

  });
}

export default { initCakeStage };
