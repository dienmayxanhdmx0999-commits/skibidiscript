import { eventBus } from './event-bus.js';

class AppState {
  constructor() {
    this.state = {
      isMaintenanceActive: true,
      isDevBypassed: false,
      currentUser: null,
      userRole: 'GUEST',
      activeModel: '3.4',
      language: localStorage.getItem('nox_lang') || 'vi',
      graphicsPreset: localStorage.getItem('nox_graphics_preset') || 'HIGH',
      networkState: navigator.onLine ? 'ONLINE' : 'OFFLINE',
      pingMs: 18,
      activeFeedTab: 'pane-link'
    };
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    if (this.state[key] !== value) {
      const prev = this.state[key];
      this.state[key] = value;
      eventBus.emit(`state:${key}`, { value, prev });
      eventBus.emit('state:change', { key, value, prev });
    }
  }

  update(patch) {
    Object.entries(patch).forEach(([key, val]) => this.set(key, val));
  }
}

export const appState = new AppState();
