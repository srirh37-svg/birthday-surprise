// Canvas ambient particle system (stars, hearts, soft glowing floating particles)

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 60;
    this.animationFrameId = null;

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    this.createParticles();
    this.render();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createParticles() {
    this.particles = [];
    const types = ['star', 'heart', 'circle'];

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 4 + 1.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        type: types[Math.floor(Math.random() * types.length)],
        color: Math.random() > 0.4 ? 'rgba(255, 215, 0, ' : 'rgba(236, 72, 153, '
      });
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const d = size * 1.5;
    ctx.moveTo(x, y + d / 4);
    ctx.quadraticCurveTo(x, y, x - d / 2, y);
    ctx.quadraticCurveTo(x - d, y, x - d, y + d / 2);
    ctx.quadraticCurveTo(x - d, y + d, x, y + d * 1.3);
    ctx.quadraticCurveTo(x + d, y + d, x + d, y + d / 2);
    ctx.quadraticCurveTo(x + d, y, x + d / 2, y);
    ctx.quadraticCurveTo(x, y, x, y + d / 4);
    ctx.fill();
  }

  drawStar(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        x + Math.cos(((18 + i * 72) * Math.PI) / 180) * size,
        y + Math.sin(((18 + i * 72) * Math.PI) / 180) * size
      );
      ctx.lineTo(
        x + Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2),
        y + Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2)
      );
    }
    ctx.closePath();
    ctx.fill();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      // Movement
      p.y += p.speedY;
      p.x += p.speedX;

      // Wrap around bounds
      if (p.y < -20) p.y = this.height + 20;
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;

      // Opacity pulse
      p.opacity += p.pulseSpeed * p.pulseDirection;
      if (p.opacity >= 0.85 || p.opacity <= 0.15) {
        p.pulseDirection *= -1;
      }

      this.ctx.fillStyle = `${p.color}${p.opacity.toFixed(2)})`;

      if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.drawStar(this.ctx, p.x, p.y, p.size * 1.8);
      } else if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.render);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resize);
  }
}

export default ParticleSystem;
