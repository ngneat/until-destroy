import { Directive, Component, Host } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { LoggerFactory } from '../../logger/logger.factory';
import { InheritanceComponent } from '../inheritance.component';

@UntilDestroy()
@Directive()
export abstract class Issue97Directive {}

@Component({
  selector: 'app-issue-97',
  template: ''
})
export class Issue97Component extends Issue97Directive {
  constructor(loggerFactory: LoggerFactory, @Host() host: InheritanceComponent) {
    super();

    host.issue97Status$.next({
      componentUnsubscribed: false
    });

    const logger = loggerFactory.createLogger('Issue97Component', '#bfb200');

    new Subject()
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          logger.log('subject has been unsubscribed');
          host.issue97Status$.next({
            componentUnsubscribed: true
          });
        })
      )
      .subscribe();
  }
}
