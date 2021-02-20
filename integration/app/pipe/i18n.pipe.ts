import { Host, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { PipeComponent } from './pipe.component';
import { LoggerFactory } from '../logger/logger.factory';

@UntilDestroy()
@Pipe({ name: 'i18n', pure: false })
export class I18nPipe implements PipeTransform {
  constructor(@Host() host: PipeComponent, loggerFactory: LoggerFactory) {
    host.pipeUnsubscribed$.next(false);

    const logger = loggerFactory.createLogger('I18nPipe', 'green');

    new Subject()
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          host.pipeUnsubscribed$.next(true);
          logger.log('subject has been unsubscribed');
        })
      )
      .subscribe();
  }

  transform(): string {
    return 'I have been piped';
  }
}
