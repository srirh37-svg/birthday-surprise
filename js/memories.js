// Stage 3: Our Journey Memory Film Module

import gsap from 'gsap';
import confetti from 'canvas-confetti';
import stateMachine, { STATES } from './stateMachine.js';
import audioManager from './audioManager.js';
import CONFIG from './config.js';
const photosData = [
  {
    id: 0,
    caption: 'It all started with a little imagination... ❤️'
  },
  {
    id: 1,
    caption: 'Some moments become memories before we even realize it. ✨'
  },
  {
    id: 2,
    caption: 'If I could relive one day forever... it would be one like this. 🌅'
  },
  {
    id: 3,
    caption: "You don't have to try to be beautiful... you already are. ❤️"
  },
  {
    id: 4,
    caption: 'Every little moment with you becomes my favorite memory. 🍨❤️'
  }
];

export function initMemoriesStage() {
  console.log('[MemoriesStage] Initializing Stage 3 Romantic Memory Film...');

  // Start Stage 3 Memory Timeline
  startMemoriesFilmSequence();
}

function startMemoriesFilmSequence() {
  // Step 1: Intro Banner ("Our Journey ❤️ - Every picture holds a memory...")
  const introBanner = document.getElementById('memories-intro-banner');
  if (introBanner) {
    gsap.fromTo(introBanner,
      { opacity: 0, scale: 0.9, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.delayedCall(2.5, () => {
            gsap.to(introBanner, {
              opacity: 0,
              y: -20,
              duration: 0.8,
              ease: 'power2.in',
              onComplete: () => {
                // Begin sequential photo slideshow
                playPhotoScene(0);
              }
            });
          });
        }
      }
    );
  } else {
    playPhotoScene(0);
  }
}

function playPhotoScene(index) {
  if (index >= photosData.length) {
    // All 5 photos played individually -> Trigger Grand Finale Collage & Heart
    startGrandFinaleCollage();
    return;
  }

  const card = document.getElementById(`polaroid-${index}`);
  if (!card) return;

  const captionEl = card.querySelector('.caption-text');
  const cursorEl = card.querySelector('.typewriter-cursor');
  const data = photosData[index];

  // Reset card state
  card.style.display = 'flex';

  // Per-photo specific entrance animations
  let entranceTL = gsap.timeline({ defaults: { ease: 'power2.out' } });

  if (index === 0) {
    // Photo 2: Fade in, small zoom, gentle floating, tiny rotation, floating hearts
    entranceTL.fromTo(card,
      { opacity: 0, scale: 0.75, rotateZ: -4, y: 30 },
      { opacity: 1, scale: 1, rotateZ: -2, y: 0, duration: 1.4 }
    );
    triggerHeartsBurst();
  } else if (index === 1) {
    // Photo 3: Slide gently from right, sunlight glow, soft zoom, sparkles
    entranceTL.fromTo(card,
      { opacity: 0, scale: 0.85, x: 120, rotateZ: 3 },
      { opacity: 1, scale: 1, x: 0, rotateZ: 1, duration: 1.4 }
    );
    triggerSparklesBurst();
  } else if (index === 2) {
    // Photo 4: Crossfade, slight rotation, warm golden glow, slow push-in
    entranceTL.fromTo(card,
      { opacity: 0, scale: 0.9, rotateZ: 5, y: 20 },
      { opacity: 1, scale: 1, rotateZ: 2, y: 0, duration: 1.4 }
    );
  } else if (index === 3) {
    // Photo 5: Reflection sweep, subtle 3D tilt, gentle floating
    entranceTL.fromTo(card,
      { opacity: 0, scale: 0.8, rotateY: -15, rotateZ: -3 },
      { opacity: 1, scale: 1, rotateY: 0, rotateZ: -1, duration: 1.4 }
    );
  } else if (index === 4) {
    // Photo 6: Soft fade, camera zoom, floating hearts, sparkles
    entranceTL.fromTo(card,
      { opacity: 0, scale: 0.85, rotateZ: 4 },
      { opacity: 1, scale: 1, rotateZ: 1, duration: 1.4 }
    );
    triggerHeartsBurst();
  }

  // After 1 second delay, type caption using typewriter animation
  gsap.delayedCall(1.0, () => {
    if (captionEl && cursorEl) {
      animateTypewriterText(captionEl, cursorEl, data.caption, 42, () => {
        // Hold scene for 8 seconds after typing finishes
        gsap.delayedCall(7.5, () => {
          // Fade out photo before next scene
          gsap.to(card, {
            opacity: 0,
            scale: 1.05,
            duration: 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
              card.style.display = 'none';
              playPhotoScene(index + 1);
            }
          });
        });
      });
    } else {
      gsap.delayedCall(8.0, () => {
        gsap.to(card, {
          opacity: 0,
          scale: 1.05,
          duration: 0.9,
          onComplete: () => {
            card.style.display = 'none';
            playPhotoScene(index + 1);
          }
        });
      });
    }
  });
}

function animateTypewriterText(element, cursorElement, text, speed = 40, onComplete) {
  element.textContent = '';
  if (cursorElement) cursorElement.style.display = 'inline-block';
  let i = 0;

  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      if (cursorElement) {
        cursorElement.style.display = 'none'; // Remove cursor after typing
      }
      if (onComplete) onComplete();
    }
  }, speed);
}

function startGrandFinaleCollage() {
  console.log('[MemoriesStage] Starting Grand Finale Overlapping Collage...');

  const isMobile = window.innerWidth < 640;
  const baseScale = isMobile ? 0.48 : 0.68;

  // Collage Target Position Coordinates
  const collagePos = [
    { x: isMobile ? -75 : -170, y: isMobile ? -90 : -100, rotateZ: -12, scale: baseScale, zIndex: 10 },
    { x: isMobile ? 75 : 160, y: isMobile ? -95 : -110, rotateZ: 10, scale: baseScale, zIndex: 12 },
    { x: isMobile ? -85 : -110, y: isMobile ? 65 : 80, rotateZ: 6, scale: baseScale * 1.05, zIndex: 15 },
    { x: isMobile ? 85 : 120, y: isMobile ? 70 : 85, rotateZ: -8, scale: baseScale * 1.05, zIndex: 14 },
    { x: 0, y: isMobile ? -10 : -10, rotateZ: 2, scale: baseScale * 1.12, zIndex: 20 }
  ];

  // Make all 5 polaroids visible simultaneously for collage
  for (let i = 0; i < 5; i++) {
    const card = document.getElementById(`polaroid-${i}`);
    if (card) {
      card.style.display = 'flex';
      card.style.zIndex = collagePos[i].zIndex;

      // Hide individual caption elements during collage view for clean aesthetic
      const caption = card.querySelector('.polaroid-caption');
      if (caption) caption.style.opacity = '0';

      // Animate card into collage position
      gsap.fromTo(card,
        { opacity: 0, scale: 0.3, y: 80, rotateZ: 0 },
        {
          opacity: 1,
          scale: collagePos[i].scale,
          x: collagePos[i].x,
          y: collagePos[i].y,
          rotateZ: collagePos[i].rotateZ,
          duration: 1.6,
          delay: i * 0.15,
          ease: 'back.out(1.4)'
        }
      );
    }
  }

  // Slow zoom toward completed collage
  gsap.to('#memories-stage-wrapper', {
    scale: 1.08,
    duration: 3.0,
    ease: 'power1.out'
  });

  // Sparkles & floating hearts confetti
  triggerHeartsBurst();
  triggerSparklesBurst();

  // Hold collage for ~3 seconds, then trigger Heart Shape Transformation
  gsap.delayedCall(3.2, () => {
    startHeartTransformation();
  });
}

function startHeartTransformation() {
  console.log('[MemoriesStage] Transforming Collage into Heart Shape...');

  const isMobile = window.innerWidth < 640;
  const heartScale = isMobile ? 0.44 : 0.58;

  // Heart Target Coordinates
  const heartPos = [
    { x: isMobile ? -55 : -95, y: isMobile ? -70 : -90, rotateZ: -25, scale: heartScale },  // Top Left Lobe
    { x: isMobile ? 55 : 95, y: isMobile ? -70 : -90, rotateZ: 25, scale: heartScale },   // Top Right Lobe
    { x: isMobile ? -45 : -70, y: isMobile ? 30 : 35, rotateZ: -15, scale: heartScale },    // Bottom Left Side
    { x: isMobile ? 45 : 70, y: isMobile ? 30 : 35, rotateZ: 15, scale: heartScale },     // Bottom Right Side
    { x: 0, y: isMobile ? 100 : 130, rotateZ: 0, scale: heartScale }                      // Center Point of Heart
  ];

  // Animate photos to form Heart
  for (let i = 0; i < 5; i++) {
    const card = document.getElementById(`polaroid-${i}`);
    if (card) {
      gsap.to(card, {
        x: heartPos[i].x,
        y: heartPos[i].y,
        rotateZ: heartPos[i].rotateZ,
        scale: heartPos[i].scale,
        duration: 2.2,
        ease: 'power3.inOut'
      });
    }
  }

  // Soft golden glow grows behind the heart
  gsap.to('#memories-ambient-glow', {
    scale: 1.6,
    opacity: 0.85,
    duration: 2.2
  });

  // Camera zooms toward heart
  gsap.to('#memories-stage-wrapper', {
    scale: 1.15,
    duration: 3.0,
    ease: 'power2.out'
  });

  // Confetti hearts rise upward
  triggerHeartsBurst();

  // Hold magical heart moment for ~3 seconds, then show Final Message
  gsap.delayedCall(3.2, () => {
    showMemoriesFinalBanner();
  });
}

function showMemoriesFinalBanner() {
  console.log('[MemoriesStage] Revealing Final Memory Message Banner...');

  const finalBanner = document.getElementById('memories-final-banner');
  if (finalBanner) {
    gsap.fromTo(finalBanner,
      { opacity: 0, scale: 0.85, y: -20 },
      { opacity: 1, scale: 1, y: -90, duration: 1.4, ease: 'back.out(1.4)' }
    );
  }

  // Hold final message for ~3.2 seconds, then transition to Stage 4 (STATE_LETTER)
  gsap.delayedCall(3.5, () => {
    triggerStage4Transition();
  });
}

function triggerStage4Transition() {
  console.log('[MemoriesStage] Transitioning to Stage 4 (STATE_LETTER)...');


  // 1. Glowing photo heart slowly dissolves
  gsap.to('#polaroid-container', {
    opacity: 0,
    scale: 0.4,
    duration: 1.5,
    ease: 'power2.inOut'
  });

  gsap.to('#memories-final-banner', {
    opacity: 0,
    y: -30,
    duration: 1.0
  });

  // 2. Golden glow transforms naturally into luxury envelope appearing where heart was!
  const envelope = document.getElementById('envelope-transition-target');
  if (envelope) {
    gsap.fromTo(envelope,
      { opacity: 0, scale: 0.3, rotateY: 90 },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 1.6,
        ease: 'back.out(1.5)',
        onComplete: () => {
          // Transition State Machine to STATE_LETTER
          gsap.delayedCall(1.2, () => {
            stateMachine.transitionTo(STATES.LETTER);
          });
        }
      }
    );
  } else {
    stateMachine.transitionTo(STATES.LETTER);
  }
}

function triggerHeartsBurst() {
  confetti({
    particleCount: 30,
    spread: 60,
    startVelocity: 20,
    origin: { y: 0.6 },
    colors: ['#ec4899', '#f43f5e', '#a855f7', '#ffd700']
  });
}

function triggerSparklesBurst() {
  confetti({
    particleCount: 40,
    spread: 90,
    startVelocity: 30,
    origin: { y: 0.5 },
    colors: ['#ffd700', '#facc15', '#ffffff']
  });
}

export default { initMemoriesStage };
