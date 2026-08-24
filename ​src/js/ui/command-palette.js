import { eventBus } from '../core/event-bus.js';
import { appState } from '../core/app-state.js';

export class CommandPalette {
  constructor() {
    this.modal = document.getElementById('command-palette-modal');
    this.input = document.getElementById('palette-search-box');
    this.list = document.getElementById('palette-results-list');

    this.commands = [
      { title: ' ● Mở AI GalaxyZ-3.4 Pro', action: () => eventBus.emit('ui:openModal', 'modal-noxgpt') },
      { title: ' ● Mở Global Chatroom', action: () => eventBus.emit('ui:openModal', 'modal-noxchat') },
      { title: ' ● Mở Kho Script Vault', action: () => eventBus.emit('ui:openModal', 'modal-script-vault') },
      { title: ' ● Đổi ngôn ngữ giao diện (VN / EN)', action: () => eventBus.emit('i18n:toggle') },
      { title: ' ● Đặt đồ họa: LOW Mode', action: () => appState.set('graphicsPreset', 'LOW') },
      { title: ' ● Đặt đồ họa: ULTRA Mode', action: () => appState.set('graphicsPreset', 'ULTRA') },
      { title: '⚙ Mở Dev Control Center', action: () => {
        if (appState.get('userRole') === 'DEV') eventBus.emit('ui:openModal', 'modal-dev-control');
        else eventBus.emit('ui:toast', 'Yêu cầu quyền Administrator!');
      }}
    ];

    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape') this.close();
    });

    if (this.input) {
      this.input.addEventListener('input', (e) => this.render(e.target.value));
    }
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('is-active');
    this.input.value = '';
    this.render('');
    setTimeout(() => this.input.focus(), 100);
  }

  close() {
    if (this.modal) this.modal.classList.remove('is-active');
  }

  render(query) {
    if (!this.list) return;
    this.list.innerHTML = '';
    const q = query.toLowerCase().trim();

    this.commands
      .filter(cmd => !q || cmd.title.toLowerCase().includes(q))
      .forEach(cmd => {
        const item = document.createElement('div');
        item.className = 'palette-item';
        item.textContent = cmd.title;
        item.addEventListener('click', () => {
          this.close();
          cmd.action();
        });
        this.list.appendChild(item);
      });
  }
}
