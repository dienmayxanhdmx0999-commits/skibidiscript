import { appState } from '../core/app-state.js';

export class QuotaManager {
  static limits = { '3.4': 20, '3.1': 60, '2.5': 9999 };
  static windowMs = 5 * 60 * 60 * 1000;

  static async verifyQuota(modelTier) {
    if (appState.get('userRole') === 'DEV') {
      return { allowed: true, remaining: 'UNLIMITED' };
    }

    const config = MODEL_REGISTRY[modelTier];
    if (!config.requiresAuth) {
      return { allowed: true, remaining: 9999 };
    }

    const user = appState.get('currentUser');
    if (!user || user.role === 'GUEST') {
      return { allowed: false, reason: 'AUTH_REQUIRED' };
    }

    const safeKey = user.email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
    const quotaRef = firebase.database().ref(`nox_ai_quotas/${safeKey}/${modelTier}`);
    const now = Date.now();
    const maxLimit = this.limits[modelTier];

    try {
      const snap = await quotaRef.once('value');
      const timestamps = snap.val() || [];
      const valid = timestamps.filter(ts => (now - ts) < this.windowMs);

      if (valid.length >= maxLimit) {
        const resetMinutes = Math.ceil((this.windowMs - (now - valid[0])) / 60000);
        return { allowed: false, reason: 'LIMIT_REACHED', resetsIn: resetMinutes };
      }

      valid.push(now);
      await quotaRef.set(valid);
      return { allowed: true, remaining: maxLimit - valid.length };
    } catch (err) {
      return { allowed: true, remaining: 10 };
    }
  }
}
