export class CountdownEngine {
  constructor(targetIsoDate, onTick, onComplete) {
    this.targetTime = new Date(targetIsoDate).getTime();
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.intervalId = null;
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  update() {
    const now = Date.now();
    const diff = this.targetTime - now;

    if (diff <= 0) {
      this.stop();
      if (this.onComplete) this.onComplete();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (this.onTick) {
      this.onTick({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }
  }
}
