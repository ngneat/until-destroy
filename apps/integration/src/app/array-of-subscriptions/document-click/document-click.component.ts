import { ChangeDetectionStrategy, Component, Host } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, fromEvent, Subject, Subscription } from 'rxjs';
import { pluck, finalize, take } from 'rxjs/operators';

import { LoggerFactory } from '../../logger/logger.factory';
import { ArrayOfSubscriptionsComponent } from '../array-of-subscriptions.component';

@UntilDestroy({
  checkProperties: true,
  arrayName: 'subscriptions',
})
@Component({
  selector: 'app-document-click',
  templateUrl: './document-click.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentClickComponent {
  clientX$ = new BehaviorSubject<number>(0);

  subscription: Subscription;
  subscriptions: Subscription[] = [];

  private standaloneSubjectHasBeenUnsubsibed$ = new Subject<true>();
  private subjectWithinArrayHasBeneUnsubscribed$ = new Subject<true>();

  constructor(loggerFactory: LoggerFactory, @Host() host: ArrayOfSubscriptionsComponent) {
    host.documentClickUnsubscribed$.next(false);

    const logger = loggerFactory.createLogger('DocumentClickComponent', '#ed33b9');

    this.subscription = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        pluck('clientX'),
        finalize(() => {
          logger.log('standalone fromEvent has been unsubscribed');
          this.standaloneSubjectHasBeenUnsubsibed$.next(true);
        })
      )
      .subscribe(clientX => {
        logger.log(`You've clicked on the document and clientX is ${clientX}`);
        this.clientX$.next(clientX);
      });

    this.subscriptions.push(
      fromEvent<MouseEvent>(document, 'click')
        .pipe(
          pluck('clientX'),
          finalize(() => {
            logger.log('fromEvent within array has been unsubscribed');
            this.subjectWithinArrayHasBeneUnsubscribed$.next(true);
          })
        )
        .subscribe(clientX => {
          logger.log(`You've clicked on the document and clientX is ${clientX}`);
          this.clientX$.next(clientX);
        })
    );

    combineLatest([
      this.standaloneSubjectHasBeenUnsubsibed$,
      this.subjectWithinArrayHasBeneUnsubscribed$,
    ])
      .pipe(take(1))
      .subscribe(() => {
        host.documentClickUnsubscribed$.next(true);
      });
  }
}
