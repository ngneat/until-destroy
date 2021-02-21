import { Injectable } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoggerFactory } from '../logger/logger.factory';
import { MultipleCustoMethodsComponent } from './multiple-custom-methods.component';

@Injectable({ providedIn: 'root' })
export class Issue66Service {
  private logger = this.loggerFactory.createLogger('Issue66Service', 'red');

  private host!: MultipleCustoMethodsComponent;

  constructor(private loggerFactory: LoggerFactory) {}

  setHost(host: MultipleCustoMethodsComponent) {
    this.host = host;
  }

  startFirst(): void {
    this.host.issue66Status$.next({
      ...this.host.issue66Status$.getValue(),
      firstStreamStarted: true,
      firstStreamStopped: false
    });

    interval(1000)
      .pipe(
        untilDestroyed(this, 'stopFirst'),
        finalize(() => {
          this.logger.log('.startFirst() interval stream has been unsubscribed');
          this.host.issue66Status$.next({
            ...this.host.issue66Status$.getValue(),
            firstStreamStarted: false,
            firstStreamStopped: true
          });
        })
      )
      .subscribe(value => {
        this.logger.log(`.startFirst() has emitted value ${value}`);
      });
  }

  stopFirst(): void {}

  startSecond(): void {
    this.host.issue66Status$.next({
      ...this.host.issue66Status$.getValue(),
      secondStreamStarted: true,
      secondStreamStopped: false
    });

    interval(1000)
      .pipe(
        untilDestroyed(this, 'stopSecond'),
        finalize(() => {
          this.logger.log('.startSecond() interval stream has been unsubscribed');
          this.host.issue66Status$.next({
            ...this.host.issue66Status$.getValue(),
            secondStreamStarted: false,
            secondStreamStopped: true
          });
        })
      )
      .subscribe(value => {
        this.logger.log(`.startSecond() has emitted value ${value}`);
      });
  }

  stopSecond(): void {}
}
