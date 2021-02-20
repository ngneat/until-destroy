import { Directive, Component, Host } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoggerFactory } from '../../logger/logger.factory';
import { InheritanceComponent } from '../inheritance.component';

@Directive()
export abstract class Issue61BaseDirective {
  constructor(loggerFactory: LoggerFactory, host: InheritanceComponent) {
    host.issue61Status$.next({
      ...host.issue61Status$.getValue(),
      directiveUnsubscribed: false
    });

    const logger = loggerFactory.createLogger('Issue61BaseDirective', '#f58900');

    interval(1000)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          logger.log('interval has been unsubscribed');
          host.issue61Status$.next({
            ...host.issue61Status$.getValue(),
            directiveUnsubscribed: true
          });
        })
      )
      .subscribe(value => logger.log(`has emitted value ${value}`));
  }
}

@UntilDestroy()
@Component({
  selector: 'app-issue-61',
  template: ''
})
export class Issue61Component extends Issue61BaseDirective {
  constructor(loggerFactory: LoggerFactory, @Host() host: InheritanceComponent) {
    super(loggerFactory, host);

    host.issue61Status$.next({
      ...host.issue61Status$.getValue(),
      componentUnsubscribed: false
    });

    const logger = loggerFactory.createLogger('Issue61Component', '#f58900');

    interval(1000)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          logger.log('subject has been unsubscribed');
          host.issue61Status$.next({
            ...host.issue61Status$.getValue(),
            componentUnsubscribed: true
          });
        })
      )
      .subscribe(value => {
        logger.log(`has emitted value ${value}`);
      });
  }
}
