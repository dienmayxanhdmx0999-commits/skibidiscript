import { eventBus } from './event-bus.js';

class SystemLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  log(level, module, message) {
    const entry = {
      timestamp: new Date().toISOString().substring(11, 19),
      level,
      module,
      message: typeof message === 'object' ? JSON.stringify(message) : message
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) this.logs.pop();

    eventBus.emit('system:log', entry);

    if (level === 'CRITICAL' || level === 'ERROR') {
      console.error(`[${entry.timestamp}] [${module}] ${message}`);
    } else if (level === 'WARN') {
      console.warn(`[${entry.timestamp}] [${module}] ${message}`);
    }
  }

  info(module, msg) { this.log('INFO', module, msg); }
  warn(module, msg) { this.log('WARN', module, msg); }
  error(module, msg) { this.log('ERROR', module, msg); }
  success(module, msg) { this.log('SUCCESS', module, msg); }
}

export const logger = new SystemLogger();
