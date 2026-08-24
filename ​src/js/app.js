import { appState } from './core/app-state.js';
import { logger } from './core/logger.js';
import { eventBus } from './core/event-bus.js';
import { GalaxyEngine } from './galaxy/galaxy-engine.js';
import { CountdownEngine } from './maintenance/countdown.js';
import { DevBypassManager } from './maintenance/dev-bypass.js';
import { AIEngine } from './ai/ai-engine.js';
import { CommandPalette } from './ui/command-palette.js';

class Application {
  constructor() {
    this.galaxy = null;
    this.countdown = null;
    this.devBypass = null;
    this.aiEngine = null;
    this.commandPalette = null;
  }

  async bootstrap() {
    logger.info('System', 'Booting NOX GALAXY ASCENSION CORE...');

    // 1. Initialize Visual Background Engine
    this.galaxy = new GalaxyEngine('cosmic-canvas');

    // 2. Initialize Maintenance Gateway (Target: Dec 25, 2026 00:00:00)
    const targetDate = '2026-12-25T00:00:00';
    this.countdown = new CountdownEngine(
      targetDate,
      (digits) => this.updateCountdownUI(digits),
      () => this.onMaintenanceEnded()
    );
    this.countdown.start();

    // 3. Initialize Developer Bypass Terminal
    this.devBypass = new DevBypassManager();
    this.devBypass.init();

    // 4. Setup Global Event Subscriptions
    this.bindGlobalEvents();

    logger.info('System', 'Maintenance Gate active. Awaiting unlock or developer authorization.');
  }

  bindGlobalEvents() {
    eventBus.on('app:devUnlocked', () => this.unlockWorkspace());

    eventBus.on('ui:toast', (message) => {
      const toast = document.getElementById('toast-banner');
      const text = document.getElementById('toast-msg-text');
      if (toast && text) {
        text.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }
    });

    eventBus.on('ui:openModal', (modalId) => {
      const target = document.getElementById(modalId);
      if (target) target.classList.add('is-active');
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.target);
        if (modal) modal.classList.remove('is-active');
      });
    });

    const openPaletteBtn = document.getElementById('btn-open-palette');
    if (openPaletteBtn) {
      openPaletteBtn.addEventListener('click', () => this.commandPalette?.open());
    }
  }

  updateCountdownUI({ days, hours, minutes, seconds }) {
    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-minutes');
    const s = document.getElementById('cd-seconds');
    if (d) d.textContent = days;
    if (h) h.textContent = hours;
    if (m) m.textContent = minutes;
    if (s) s.textContent = seconds;
  }

  onMaintenanceEnded() {
    logger.info('Maintenance', 'Target date reached. Opening system workspace.');
    appState.set('isMaintenanceActive', false);
    this.unlockWorkspace();
  }

  unlockWorkspace() {
    const maintenanceOverlay = document.getElementById('maintenance-overlay');
    const workspace = document.getElementById('app-workspace');

    if (maintenanceOverlay) maintenanceOverlay.style.display = 'none';
    if (workspace) workspace.style.display = 'block';

    // Lazy load and instantiate feature modules only when entering the workspace
    if (!this.aiEngine) {
      this.aiEngine = new AIEngine();
      this.aiEngine.init();
    }

    if (!this.commandPalette) {
      this.commandPalette = new CommandPalette();
    }

    if (appState.get('userRole') === 'DEV') {
      const devGroup = document.getElementById('dev-menu-editor-group');
      if (devGroup) devGroup.style.display = 'flex';
    }

    eventBus.emit('ui:toast', 'Chào mừng trở lại NOX GALAXY CORE.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  app.bootstrap();
});
