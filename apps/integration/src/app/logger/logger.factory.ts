import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerFactory {
  createLogger(name: string, color: string): Pick<Console, 'log'> {
    return {
      log: (messages: Parameters<Console['log']>) =>
        console.log(`%c[${name}] ${messages}`, `font-size: 12px; color: ${color}`)
    };
  }
}
