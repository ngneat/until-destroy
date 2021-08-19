import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { pluck, debounceTime, finalize, map } from 'rxjs/operators';

import { IntervalService } from './interval.service';
import { LoggerFactory } from '../logger/logger.factory';
import { NotificationClass, NotificationText } from '../enums/notification.enum';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-custom-method',
  templateUrl: './custom-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMethodComponent implements OnDestroy {
  valueFromIntervalService$ = new BehaviorSubject<number>(0);

  subscription = fromEvent<MouseEvent>(document, 'mousemove')
    .pipe(
      debounceTime(200),
      pluck('clientX'),
      finalize(() => this.logger.log('fromEvent has been unsubscribed'))
    )
    .subscribe(clientX => {
      this.logger.log(`Mouse clientX position is ${clientX}`);
    });

  intervalServiceUnsubscribed$ = new BehaviorSubject<boolean>(false);

  intervalServiceUnsubscribedClass$ = this.intervalServiceUnsubscribed$.pipe(
    map(intervalServiceUnsubscribed =>
      intervalServiceUnsubscribed ? NotificationClass.Success : NotificationClass.Danger
    )
  );

  intervalServiceUnsubscribedText$ = this.intervalServiceUnsubscribed$.pipe(
    map(intervalServiceUnsubscribed =>
      intervalServiceUnsubscribed ? NotificationText.Unsubscribed : NotificationText.Subscribed
    )
  );

  private intervalService = new IntervalService(
    this.loggerFactory,
    this.intervalServiceUnsubscribed$
  );

  private logger = this.loggerFactory.createLogger('CustomMethodComponent', '#2452ff');

  constructor(private loggerFactory: LoggerFactory) {
    this.intervalService.interval$
      .pipe(
        untilDestroyed(this),
        finalize(() => this.logger.log('intervalService.interval$ has been unsubscribed'))
      )
      .subscribe(value => {
        this.logger.log(
          `intervalService.interval$ has emitted value inside component ${value}`
        );
        this.valueFromIntervalService$.next(value);
      });
  }

  destroyService(): void {
    this.intervalService.destroy();
  }

  ngOnDestroy(): void {
    this.intervalService.destroy();
  }
}
