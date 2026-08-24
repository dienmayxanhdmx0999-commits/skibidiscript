import { appState } from '../core/app-state.js';
import { eventBus } from '../core/event-bus.js';

export class GalaxyEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.animId = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.numStars = 80;
    this.isOverdrive = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    
    eventBus.on('state:graphicsPreset', ({ value }) => {
      this.applyPreset(value);
    });

    const glow = document.getElementById('quantum-cursor-glow');
    if (glow && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        glow.style.transform = `translate(${e.clientX - 190}px, ${e.clientY - 190}px)`;
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(this.animId);
      else this.loop();
    });

    this.applyPreset(appState.get('graphicsPreset'));
    this.scheduleShootingStar();
    this.loop();
  }

  applyPreset(preset) {
    const isMobile = this.width < 768;
    switch (preset) {
      case 'LOW': this.numStars = isMobile ? 20 : 35; break;
      case 'MED': this.numStars = isMobile ? 40 : 70; break;
      case 'HIGH': this.numStars = isMobile ? 65 : 120; break;
      case 'ULTRA': default: this.numStars = isMobile ? 90 : 180; break;
    }
    this.createStars();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.applyPreset(appState.get('graphicsPreset'));
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.25 + 0.05,
        color: Math.random() > 0.6 ? '#00D9F5' : (Math.random() > 0.45 ? '#A855F7' : '#FFFFFF')
      });
    }
  }

  scheduleShootingStar() {
    if (appState.get('graphicsPreset') === 'LOW') return;
    const nextDelay = Math.random() * 8000 + 6000;
    setTimeout(() => {
      this.spawnShootingStar();
      this.scheduleShootingStar();
    }, nextDelay);
  }

  spawnShootingStar() {
    this.shootingStars.push({
      x: Math.random() * this.width * 0.8,
      y: Math.random() * (this.height * 0.4),
      length: Math.random() * 70 + 40,
      speed: Math.random() * 6 + 8,
      alpha: 1,
      angle: Math.PI / 4
    });
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.y -= this.isOverdrive ? s.speed * 6 : s.speed;
      if (s.y < 0) {
        s.y = this.height;
        s.x = Math.random() * this.width;
      }

      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = s.alpha;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    for (let j = this.shootingStars.length - 1; j >= 0; j--) {
      const ss = this.shootingStars[j];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.015;

      if (ss.alpha <= 0) {
        this.shootingStars.splice(j, 1);
        continue;
      }

      this.ctx.strokeStyle = `rgba(0, 217, 245, ${ss.alpha})`;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
    this.animId = requestAnimationFrame(() => this.loop());
  }
}
