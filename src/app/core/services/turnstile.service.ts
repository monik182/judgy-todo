import { Injectable } from '@angular/core';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  size?: 'invisible' | 'normal' | 'compact';
}

@Injectable({ providedIn: 'root' })
export class TurnstileService {
  private readonly siteKey = '0x4AAAAAADIkjzPeSjY_tUH8';
  private verified = false;

  getToken(): Promise<string | null> {
    // Already verified this session — worker will accept without token
    if (this.verified) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      if (!window.turnstile) {
        reject(new Error('Turnstile not loaded'));
        return;
      }

      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);

      window.turnstile.render(container, {
        sitekey: this.siteKey,
        size: 'invisible',
        callback: (token: string) => {
          this.verified = true;
          container.remove();
          resolve(token);
        },
        'error-callback': () => {
          container.remove();
          reject(new Error('Turnstile challenge failed'));
        },
        'expired-callback': () => {
          container.remove();
          reject(new Error('Turnstile token expired'));
        },
      });
    });
  }
}
