import { Component, Injectable } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoggerFactory } from '../../logger/logger.factory';

@Injectable({ providedIn: 'root' })
export class Issue66Service {
  private logger = this.loggerFactory.createLogger('Issue66Service', 'red');

  constructor(private loggerFactory: LoggerFactory) {}

  startFirst(): void {
    interval(1000)
      .pipe(
        untilDestroyed(this, 'stopFirst'),
        finalize(() => this.logger.log('.startFirst() interval stream has been unsubscribed'))
      )
      .subscribe(value => this.logger.log(`.startFirst() has emitted value ${value}`));
  }

  stopFirst(): void {}

  startSecond(): void {
    interval(1000)
      .pipe(
        untilDestroyed(this, 'stopSecond'),
        finalize(() => this.logger.log('.startSecond() interval stream has been unsubscribed'))
      )
      .subscribe(value => this.logger.log(`.startSecond() has emitted value ${value}`));
  }

  stopSecond(): void {}
}

@Component({
  selector: 'app-issue-66',
  templateUrl: './issue-66.component.html'
})
export class Issue66Component {
  constructor(private issue66Service: Issue66Service) {}

  startFirst(): void {
    this.issue66Service.startFirst();
  }

  stopFirst(): void {
    this.issue66Service.stopFirst();
  }

  startSecond(): void {
    this.issue66Service.startSecond();
  }

  stopSecond(): void {
    this.issue66Service.stopSecond();
  }
}
