import { appState } from '../core/app-state.js';
import { logger } from '../core/logger.js';
import { eventBus } from '../core/event-bus.js';

export class DevBypassManager {
  constructor() {
    this.modal = document.getElementById('dev-bypass-modal');
    this.logContainer = document.getElementById('dev-terminal-logs');
    this.isBypassing = false;
  }

  init() {
    const bypassBtn = document.getElementById('btn-dev-bypass-prompt');
    const closeBtn = document.getElementById('btn-close-bypass');

    if (bypassBtn) bypassBtn.addEventListener('click', () => this.openDialog());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDialog());
  }

  openDialog() {
    if (this.modal) this.modal.style.display = 'flex';
    this.renderLog('[SECURITY] PROMPT DEVELOPER IDENTITY VERIFICATION.');
    this.mountGoogleAuth();
  }

  closeDialog() {
    if (this.modal) this.modal.style.display = 'none';
  }

  renderLog(msg) {
    if (!this.logContainer) return;
    const div = document.createElement('div');
    div.textContent = msg;
    this.logContainer.appendChild(div);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  mountGoogleAuth() {
    if (typeof google === 'undefined' || !google.accounts) return;
    const mount = document.getElementById('dev-google-login-mount');
    if (mount && !mount.hasChildNodes()) {
      google.accounts.id.renderButton(mount, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'signin_with'
      });
    }
  }

  async handleDevCredential(email, credential) {
    this.renderLog(`[AUTH] VERIFYING IDENTITY FOR: ${email}...`);

    try {
      const response = await fetch('/api/verify-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credential })
      });

      const result = await response.json();

      if (result.authorized) {
        this.renderLog('[SECURITY] ACCESS GRANTED.');
        this.runSciFiBootSequence();
      } else {
        this.renderLog('[SECURITY] ACCESS DENIED: INSUFFICIENT PERMISSIONS.');
      }
    } catch (err) {
      this.renderLog('[ERROR] VERIFICATION GATEWAY UNREACHABLE.');
      logger.error('DevBypass', err.message);
    }
  }

  runSciFiBootSequence() {
    const steps = [
      'AUTHENTICATING DEVELOPER CLEARANCE...',
      'INITIALIZING NOX GALAXY CORE ARCHITECTURE...',
      'SYNCHRONIZING SECURE REPOSITORIES...',
      'ELEVATING RUNTIME PERMISSIONS TO [DEV]...',
      'WELCOME, DEVELOPER. ASCENSION CORE READY.'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        this.renderLog(`> ${steps[stepIndex]}`);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.closeDialog();
          appState.update({ isMaintenanceActive: false, isDevBypassed: true, userRole: 'DEV' });
          eventBus.emit('app:devUnlocked');
        }, 600);
      }
    }, 450);
  }
}
