You are an award-winning Frontend Engineer, Creative Developer, Senior UI/UX Designer, Motion Designer, JavaScript Animation Expert, and Awwwards-level Interactive Experience Designer.

Your objective is to create a cinematic, emotionally engaging, production-quality Happy Birthday web experience that feels like an award-winning interactive website rather than a normal greeting page.

The final experience should feel luxurious, magical, premium, polished, and memorable.

The user should feel like they are progressing through a beautiful interactive story.

====================================================
PROJECT STRUCTURE
====================================================

Create a professional project with the following structure.

birthday-surprise/

│

├── index.html

├── css/

│     style.css

│

├── js/

│     config.js

│     stateMachine.js

│     audioManager.js

│     animations.js

│     particles.js

│     memories.js

│     cake.js

│     letter.js

│     main.js

│

├── assets/

│     images/

│         photo1.jpg

│         photo2.jpg

│         photo3.jpg

│         photo4.jpg

│         photo5.jpg

│         photo6.jpg

│

│     music/

│         welcome.mp3

│         cake.mp3

│         memories.mp3

│         letter.mp3

│

└── README.md

After everything is complete and production ready, generate a fully self-contained SINGLE HTML version containing everything.

====================================================
TECH STACK
====================================================

Use

HTML5

Modern CSS

Tailwind CSS CDN

Vanilla JavaScript

No React

No Vue

No Angular

No Bootstrap

No jQuery

====================================================
ALLOWED LIBRARIES
====================================================

Use free CDN versions of

GSAP

Lenis

SplitType

Canvas Confetti

Google Fonts

Lucide Icons

====================================================
STATE MACHINE
====================================================

Implement a modular state machine.

STATE_WELCOME

STATE_CAKE

STATE_MEMORIES

STATE_LETTER

Only allow progressing after the previous interaction has completed successfully.

====================================================
CONFIG
====================================================

At the top of config.js create

const CONFIG = {

recipientName:"",

senderName:"",

birthdayMessage:"",

musicEnabled:true,

memories:[

{

title:"",

date:"",

message:"",

image:""

}

]

};

No names should be hardcoded anywhere else.

====================================================
STAGE 1
WELCOME
====================================================

Dark luxury animated background.

Animated stars.

Floating hearts.

Moving gradient blobs.

Soft particles.

Parallax movement.

Premium 3D gift box.

Luxury glow.

Breathing animation.

Hover animation.

Floating effect.

Text

"A special delivery awaits..."

"Tap to open"

When clicked

Camera zoom

Gift lid opens

Particle burst

Canvas Confetti explosion

Camera shake

Sparkles

Light rays

Smooth cinematic transition

Background music

welcome.mp3

====================================================
STAGE 2
CAKE
====================================================

Create a beautiful birthday cake using HTML CSS SVG only.

Multiple cake layers.

Dripping icing.

Plate.

Shadow.

Multiple glowing candles.

Animated flames.

Allow TWO interaction modes.

Primary

Microphone permission.

Detect blowing into microphone.

Fallback

Click each candle.

Each candle

Glow

Flame

Smoke animation

Sparkles

Tiny pop

Warm lighting

When every candle is out

Camera slowly zooms

Display

"Make a Wish..."

Pause

Transition to next stage.

Background music

cake.mp3

====================================================
STAGE 3
MEMORY JOURNEY
====================================================

Load six photos automatically from

assets/images/

Each memory appears as a floating Polaroid.

When clicked

Lift

Rotate

Flip in 3D

Sparkles

Expand into fullscreen

Reveal

Photo

Date

Story

Funny memory

Secret message

Floating hearts

Close animation

Support

Swipe

Keyboard

Touch

Smooth scrolling

Stack beautifully on mobile.

Background music

memories.mp3

====================================================
STAGE 4
LETTER
====================================================

Envelope animation.

Wax seal.

Paper unfolds.

Paper texture.

Glassmorphism.

Soft shadows.

Elegant typography.

Typewriter animation.

Blinking cursor.

Letter types character by character.

Ink handwriting signature.

At the end display

With Love ❤️

Harsha

Petals floating.

Soft glow.

Background music

letter.mp3

====================================================
AUDIO MANAGER
====================================================

Create an audio manager.

Features

Play

Pause

Mute

Replay

Loop

Volume slider

Crossfade

Fade In

Fade Out

Smooth transition between stage music.

Never autoplay before user interaction.

====================================================
GLOBAL BACKGROUND
====================================================

Throughout every stage

Floating balloons

Stars

Hearts

Particles

Gradient blobs

Soft glow

Parallax movement

Animated lights

====================================================
ANIMATIONS
====================================================

Target 60 FPS.

Use

transform

translate3d

opacity

scale

requestAnimationFrame

Hardware accelerated animations.

Respect prefers-reduced-motion.

====================================================
RESPONSIVENESS
====================================================

Design mobile first.

Support

320

375

390

412

768

1024

Desktop

No horizontal scrolling.

Large touch targets.

====================================================
ACCESSIBILITY
====================================================

Semantic HTML

Keyboard navigation

ARIA labels

Visible focus states

Readable contrast

Accessible buttons

====================================================
PERFORMANCE
====================================================

Lazy load images.

Preload upcoming stage assets.

Dispose unnecessary event listeners.

Avoid layout thrashing.

Passive listeners.

Efficient DOM updates.

Optimize animations.

No memory leaks.

====================================================
FINAL FINALE
====================================================

After the letter

Massive fireworks.

Heart rain.

Confetti.

Floating balloons.

Photo collage.

Golden glow.

Happy Birthday title.

Replay Journey button.

====================================================
AUTOMATIC QUALITY ASSURANCE
====================================================

After completing the project

Run it.

Inspect for

JavaScript errors

Console errors

Broken animations

Overflow

Responsive issues

Alignment issues

Performance problems

Accessibility issues

Cross-browser issues

Automatically fix every issue.

Run again.

Repeat until

Zero console errors

Zero visual bugs

Smooth animations

Responsive on all screen sizes

Production-quality polish

Do not stop after the first implementation.

Keep refining until the experience is comparable to an Awwwards-quality interactive landing page.

Only stop when every interaction, animation, transition, and layout feels complete and polished.

Finally generate

1. Multi-file production project

2. Optimized self-contained single HTML version

3. README explaining how to replace photos and songs.