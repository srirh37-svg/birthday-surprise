import gsap from 'gsap';
import confetti from 'canvas-confetti';

export function triggerConfettiBurst() {
  const count = 250;
  const defaults = {
    origin: { y: 0.65 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 35,
    startVelocity: 60,
    colors: ['#ffd700', '#facc15', '#ffffff']
  });
  fire(0.2, {
    spread: 70,
    colors: ['#ec4899', '#f43f5e', '#a855f7']
  });
  fire(0.35, {
    spread: 110,
    decay: 0.91,
    scalar: 0.9
  });
  fire(0.1, {
    spread: 130,
    startVelocity: 30,
    decay: 0.92,
    scalar: 1.3
  });
  fire(0.1, {
    spread: 140,
    startVelocity: 50
  });
}

export function animateWelcomeEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.welcome-header', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1.2 }
  )
  .fromTo('.gift-wrapper', 
    { opacity: 0, scale: 0.7, y: 40 }, 
    { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'back.out(1.7)' }, 
    '-=0.8'
  )
  .fromTo('.welcome-action', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1 }, 
    '-=0.6'
  );

  return tl;
}

export function openGiftBoxAnimation(onCompleteCallback) {
  const tl = gsap.timeline({
    onComplete: onCompleteCallback
  });

  // 1. Fade out header & action CTA
  tl.to(['.welcome-header', '.welcome-action'], {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: 'power2.in'
  })
  // 2. Realistic 3D Gift Lid Lift & Flip back
  .to('.gift-box', {
    scale: 1.1,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')
  .to('.gift-lid', {
    y: -180,
    rotateX: 65,
    rotateZ: -15,
    opacity: 0,
    duration: 0.8,
    ease: 'back.inOut(1.4)'
  })
  // 3. Inner Box Glow & Light Burst
  .to('.box-glow', {
    opacity: 1,
    duration: 0.3
  }, '-=0.5')
  .to('.light-rays', {
    opacity: 1,
    scale: 2.5,
    duration: 0.7,
    ease: 'power2.out',
    onStart: () => triggerConfettiBurst()
  }, '-=0.4')
  // 4. Reveal Premium Portrait Card (rising out of gift box)
  .fromTo('#portrait-card', 
    {
      opacity: 0,
      scale: 0.2,
      y: 100,
      rotateZ: -8,
      pointerEvents: 'none'
    },
    {
      opacity: 1,
      scale: 1,
      y: -60,
      rotateZ: 0,
      duration: 1.3,
      ease: 'back.out(1.4)',
      onStart: () => {
        const card = document.getElementById('portrait-card');
        if (card) {
          card.style.pointerEvents = 'auto';
        }
      }
    },
    '-=0.4'
  )
  // 5. Add continuous floating motion class to card
  .call(() => {
    const card = document.getElementById('portrait-card');
    if (card) card.classList.add('portrait-card-floating');
  })
  // 6. Keep scene visible for ~3 seconds while welcome music plays
  .to({}, { duration: 3.2 })
  // 7. Smooth transition fade to Stage 2
  .to('#stage-welcome', {
    opacity: 0,
    scale: 1.04,
    duration: 1.0,
    ease: 'power3.inOut'
  });

  return tl;
}
