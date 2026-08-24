import { MODEL_REGISTRY } from './model-registry.js';
import { QuotaManager } from './quota-manager.js';
import { appState } from '../core/app-state.js';
import { logger } from '../core/logger.js';
import { eventBus } from '../core/event-bus.js';

export class AIEngine {
  constructor() {
    this.messageHistory = [];
    this.isGenerating = false;
    this.activeModel = '3.4';
    this.board = document.getElementById('noxgpt-board');
    this.input = document.getElementById('noxgpt-field');
  }

  init() {
    this.bindEvents();
    this.switchModel('3.4');
  }

  bindEvents() {
    const sendBtn = document.getElementById('btn-gpt-send');
    if (sendBtn) sendBtn.addEventListener('click', () => this.submitPrompt());

    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.submitPrompt();
        }
      });
    }

    document.querySelectorAll('.ai-tier-card').forEach(card => {
      card.addEventListener('click', () => {
        const tier = card.dataset.model;
        this.switchModel(tier);
      });
    });
  }

  switchModel(tier) {
    this.activeModel = tier;
    appState.set('activeModel', tier);
    const config = MODEL_REGISTRY[tier];

    document.querySelectorAll('.ai-tier-card').forEach(c => c.classList.remove('is-active'));
    const activeCard = document.getElementById(`tier-card-${tier.replace('.', '')}`);
    if (activeCard) activeCard.classList.add('is-active');

    const title = document.getElementById('gpt-active-model-title');
    if (title) title.textContent = config.name.toUpperCase();

    this.messageHistory = [{ role: 'system', content: config.systemPrompt }];
    eventBus.emit('ui:toast', `Kích hoạt model: ${config.name}`);
  }

  async submitPrompt() {
    const text = this.input.value.trim();
    if (!text || this.isGenerating) return;

    const quota = await QuotaManager.verifyQuota(this.activeModel);
    if (!quota.allowed) {
      if (quota.reason === 'AUTH_REQUIRED') {
        eventBus.emit('ui:toast', 'Model yêu cầu đăng nhập Google.');
      } else {
        eventBus.emit('ui:toast', `Hạn mức đã hết. Reset sau ~${quota.resetsIn} phút.`);
      }
      return;
    }

    this.input.value = '';
    this.appendMessage('user', text);
    this.messageHistory.push({ role: 'user', content: text });
    this.isGenerating = true;

    const loader = this.appendLoader();
    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelTier: this.activeModel,
          messages: this.messageHistory,
          temperature: MODEL_REGISTRY[this.activeModel].temperature
        })
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const data = await response.json();
      loader.remove();

      if (data.choices && data.choices[0]?.message) {
        const reply = data.choices[0].message.content;
        this.appendMessage('other', reply, MODEL_REGISTRY[this.activeModel].name);
        this.messageHistory.push({ role: 'assistant', content: reply });
        logger.info('AIEngine', `Response received in ${Date.now() - startTime}ms`);
      }
    } catch (err) {
      loader.remove();
      this.appendMessage('other', '⚠️ Không thể kết nối Quantum Gateway. Vui lòng thử lại sau.');
      logger.error('AIEngine', err.message);
    } finally {
      this.isGenerating = false;
    }
  }

  appendMessage(type, content, sender = 'You') {
    if (!this.board) return;
    const row = document.createElement('div');
    row.className = `msg-row-block type-${type}`;
    row.innerHTML = `
      <div class="msg-meta-tag ${type === 'other' ? 'sys' : ''}">${sender}</div>
      <div class="msg-bubble-glass">${this.formatMarkdown(content)}</div>
    `;
    this.board.appendChild(row);
    this.board.scrollTop = this.board.scrollHeight;
  }

  appendLoader() {
    const row = document.createElement('div');
    row.className = 'msg-row-block type-other';
    row.innerHTML = `
      <div class="msg-meta-tag sys">${MODEL_REGISTRY[this.activeModel].name}</div>
      <div class="msg-bubble-glass">
        <div class="quantum-processing-loader">
          <div class="quantum-morph-core"></div>
          <span>QUANTUM REASONING...</span>
        </div>
      </div>
    `;
    this.board.appendChild(row);
    this.board.scrollTop = this.board.scrollHeight;
    return row;
  }

  formatMarkdown(text) {
    return text
      .replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (_, lang, code) => `
        <div class="code-block-wrapper">
          <div class="code-header"><span>${lang || 'CODE'}</span></div>
          <pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      `)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}
