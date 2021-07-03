import { ChangeDetectionStrategy, Component, Host } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { pluck, finalize } from 'rxjs/operators';

import { LoggerFactory } from '../../logger/logger.factory';
import { ArrayOfSubscriptionsComponent } from '../array-of-subscriptions.component';

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-document-click',
  templateUrl: './document-click.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentClickComponent {
  clientX$ = new BehaviorSubject<number>(0);

  subscriptions: Subscription[] = [];

  constructor(loggerFactory: LoggerFactory, @Host() host: ArrayOfSubscriptionsComponent) {
    host.documentClickUnsubscribed$.next(false);

    const logger = loggerFactory.createLogger('DocumentClickComponent', '#b100aa');

    this.subscriptions.push(
      fromEvent<KeyboardEvent>(document, 'click')
        .pipe(
          pluck<KeyboardEvent, number>('clientX'),
          finalize(() => {
            logger.log('fromEvent has been unsubscribed');
            host.documentClickUnsubscribed$.next(true);
          })
        )
        .subscribe(clientX => {
          logger.log(`You've clicked on the document and clientX is ${clientX}`);
          this.clientX$.next(clientX);
        })
    );
  }
}
