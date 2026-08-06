// Stage 4: The Letter & Grand Finale Module

import gsap from 'gsap';
import confetti from 'canvas-confetti';
import stateMachine, { STATES } from './stateMachine.js';
import audioManager from './audioManager.js';
import CONFIG from './config.js';

let letterOpened = false;
let fireworksInterval = null;

export function initLetterStage() {
  console.log('[LetterStage] Initializing Stage 4 The Letter & Grand Finale...');

  letterOpened = false;
  populateRecipientNames();
  bindOpenLetterEvents();
  animateEnvelopeEntrance();
}

function populateRecipientNames() {
  const recipientEls = document.querySelectorAll('#stage-letter .recipient-name');
  recipientEls.forEach(el => {
    el.textContent = CONFIG.recipientName || 'Raksha';
  });
}

function animateEnvelopeEntrance() {

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });

  // Start from the current visible position
  tl.to({}, {
    duration: 0.8
  })

    // Move the SAME envelope smoothly to the left
    .to("#letter-wrapper", {
      x: window.innerWidth >= 768 ? -120 : 0,
      duration: 2.5,
      ease: "expo.inOut"
    });

  // Floating animation
  gsap.to("#letter-wrapper", {
    y: "-=5",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Wax seal heartbeat
  gsap.to("#wax-seal", {
    scale: 1.08,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

}
function bindOpenLetterEvents() {
  const waxSeal = document.getElementById("wax-seal");

  if (!waxSeal) {
    console.error("[LetterStage] Wax seal not found!");
    return;
  }

  waxSeal.style.cursor = "pointer";
  waxSeal.style.pointerEvents = "auto";

  const handleOpen = () => {
    if (letterOpened) return;

    letterOpened = true;

    console.log("[LetterStage] Wax seal clicked");

    startLetterOpeningSequence();
  };

  waxSeal.addEventListener("click", handleOpen);
}
function startLetterOpeningSequence() {
  console.log("startLetterOpeningSequence called");
  console.log("[LetterStage] Opening Envelope & Unfolding Letter...");

  // Prevent clicking again
  gsap.killTweensOf("#wax-seal");

  const tl = gsap.timeline({
    defaults: {
      ease: "power2.inOut"
    }
  });

  // 1. Crack & remove wax seal
  tl.to("#wax-seal", {
    scale: 1.35,
    rotation: 25,
    opacity: 0,
    duration: 0.45,
    onComplete: () => {
      triggerGoldenParticleBurst();
    }
  })

    // 2. Open the envelope flap
    .to("#envelope-flap", {
      rotateX: 180,
      transformOrigin: "top center",
      duration: 0.9,
      ease: "power2.inOut"
    }, "-=0.15")

    // 3. Pull the letter out
    .fromTo(
      "#letter-paper",
      {
        opacity: 0,
        scale: 0.92,
        x: 0,
        y: 0
      },
      {
        opacity: 1,
        scale: 1,

        // Desktop
        x: window.innerWidth >= 768 ? 180 : 0,

        // Mobile
        y: window.innerWidth >= 768 ? 0 : 180,

        duration: 1.5,
        ease: "power3.out"
      },
      "-=0.2"
    )
    // 4. Tiny camera zoom
    .to(
      "#letter-wrapper",
      {
        scale: 1.02,
        duration: 1,
        ease: "power2.out"
      },
      "-=0.9"
    )

    // 5. Start typing
    .call(() => {
      startLetterTypewriter();
    });
}
function startLetterTypewriter() {
  const textEl = document.getElementById('letter-text');
  const cursorEl = document.getElementById('letter-cursor');
  const message = CONFIG.birthdayMessage;

  if (!textEl) return;

  textEl.textContent = '';
  if (cursorEl) cursorEl.style.display = 'inline-block';
  let i = 0;

  const timer = setInterval(() => {
    if (i < message.length) {
      textEl.textContent += message.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      if (cursorEl) cursorEl.style.display = 'none'; // Remove cursor after typing

      // Pause for 2 seconds after letter finishes typing
      gsap.delayedCall(2.2, () => {
        foldAndDissolveEnvelope();
      });
    }
  }, 42);
}

function foldAndDissolveEnvelope() {
  console.log('[LetterStage] Folding letter & dissolving envelope...');

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

  // 1. Paper slides back toward envelope
  tl.to('#letter-paper', {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0.85,
    duration: 1.0
  })
    // 2. Envelope flap closes
    .to('#envelope-flap', {
      rotateX: 0,
      duration: 0.6
    }, '-=0.4')
    // 3. Envelope dissolves into golden particles
    .to('#envelope-card', {
      scale: 0.3,
      opacity: 0,
      duration: 2.2,
      onStart: () => {
        triggerGoldenParticleBurst();
      },
      onComplete: () => {
        const wrapper = document.getElementById('letter-wrapper');
        if (wrapper) wrapper.style.display = 'none';

        // Immediately start Final Celebration
        startFinalCelebration();
      }
    });

}

function startFinalCelebration() {
  console.log('[LetterStage] Starting Grand Final Celebration...');

  // 1. Display 🎉 Happy Birthday Raksha ❤️ Overlay
  const celebrationOverlay = document.getElementById('celebration-overlay');
  if (celebrationOverlay) {
    gsap.fromTo(celebrationOverlay,
      { opacity: 0, scale: 0.8, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'back.out(1.4)' }
    );
  }

  // 2. Continuous Fireworks & Confetti Celebration Loop
  startContinuousFireworks();

  // 3. Keep letter.mp3 playing continuously

  // 4. After 5 seconds, reveal Hidden Surprise Glowing Heart
  gsap.delayedCall(5.0, () => {
    revealSurpriseHeartTrigger();
  });
}

function startContinuousFireworks() {
  let count = 0;
  fireworksInterval = setInterval(() => {
    triggerFireworksBurst();
    count++;
    if (count > 12) {
      clearInterval(fireworksInterval);
    }
  }, 800);
}

function triggerFireworksBurst() {
  const x = Math.random() * 0.8 + 0.1;
  const y = Math.random() * 0.4 + 0.2;

  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 40,
    origin: { x, y },
    colors: ['#ffd700', '#facc15', '#ffffff', '#ec4899', '#f43f5e', '#a855f7']
  });
}

function triggerGoldenParticleBurst() {
  confetti({
    particleCount: 150,
    spread: 140,
    startVelocity: 45,
    origin: { y: 0.5 },
    colors: ['#ffd700', '#facc15', '#ffffff', '#fbbf24']
  });
}

function revealSurpriseHeartTrigger() {
  console.log('[LetterStage] Revealing Hidden Surprise Glowing Heart...');

  const heartTrigger = document.getElementById('surprise-heart-trigger');
  if (!heartTrigger) return;

  heartTrigger.style.pointerEvents = 'auto';

  gsap.fromTo(heartTrigger,
    { opacity: 0, scale: 0.6, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'back.out(1.5)' }
  );

  const handleHeartClick = () => {
    heartTrigger.style.pointerEvents = 'none';
    startRomanticRevealSequence();
  };

  heartTrigger.addEventListener('click', handleHeartClick);
}

function startRomanticRevealSequence() {
  console.log('[LetterStage] Revealing Hidden Romantic Message...');

  const tl = gsap.timeline();

  // 1. Heart expands with golden pulse
  const surpriseHeart = document.getElementById('surprise-heart');
  if (surpriseHeart) {
    tl.to(surpriseHeart, {
      scale: 3.5,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out'
    }, 0);
  }

  tl.to('#surprise-heart-trigger p', {
    opacity: 0,
    duration: 0.5
  }, 0);

  // 2. Golden particle burst
  tl.call(() => {
    triggerGoldenParticleBurst();
  }, null, 0.4);

  // 3. Background softly darkens
  tl.to('#letter-ambient-glow', {
    scale: 2.2,
    opacity: 0.95,
    duration: 2.0,
    ease: 'power2.out'
  }, 0.3);

  // Hide celebration overlay to make room for romantic reveal
  tl.to('#celebration-overlay', {
    opacity: 0,
    scale: 0.9,
    duration: 0.8,
    ease: 'power2.in'
  }, 0.2);

  // 4. Increase floating hearts (second burst of confetti with heart shapes)
  tl.call(() => {
    confetti({
      particleCount: 40,
      spread: 160,
      startVelocity: 20,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#ec4899', '#f43f5e', '#ffd700'],
      gravity: 0.3,
      ticks: 200
    });
  }, null, 1.0);

  // 5. Reveal romantic container (centered)
  const romanticContainer = document.getElementById('romantic-reveal-container');
  if (romanticContainer) {
    romanticContainer.style.pointerEvents = 'auto';

    tl.to(romanticContainer, {
      opacity: 1,
      scale: 1,
      duration: 1.4,
      ease: 'power2.out'
    }, 1.2);

    // 6. Lines fade in with pauses between each
    const lineDelays = [2.0, 3.6, 5.2, 6.8];
    const lines = ['#line-1', '#line-2', '#line-3', '#line-4'];
    lines.forEach((lineId, idx) => {
      tl.fromTo(lineId,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out'
        },
        lineDelays[idx]
      );
    });

    // 7. Relive Our Journey button appears after all lines
    tl.call(() => {
      const reliveBtn = document.getElementById('relive-journey-btn');
      if (reliveBtn) {
        reliveBtn.style.pointerEvents = 'auto';
        gsap.fromTo(reliveBtn,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'back.out(1.4)' }
        );

        reliveBtn.addEventListener('click', () => {
          console.log('[App] Restarting experience from Stage 1...');
          location.reload();
        });
      }
    }, null, 8.5);
  }

  // Keep fireworks running in the background throughout
  startContinuousFireworks();
}

export default { initLetterStage };
