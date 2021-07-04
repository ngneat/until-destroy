import { Host, Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LoggerFactory } from '../../logger/logger.factory';
import { DestroyableProviderComponent } from '../destroyable-provider.component';

@UntilDestroy({ checkProperties: true })
@Injectable()
export class ConnectionService {
  subscription: Subscription;

  private logger = this.loggerFactory.createLogger('ConnectionService', '#009688');

  constructor(
    private loggerFactory: LoggerFactory,
    @Host() host: DestroyableProviderComponent
  ) {
    host.providerStatus$.next({
      subjectIsUnsubscribed: false,
      subscriptionIsUnsubscribed: false
    });

    this.subscription = new Subject()
      .pipe(
        finalize(() => {
          this.logger.log('The first ConnectionService subject has been unsubscribed');
          host.providerStatus$.next({
            ...host.providerStatus$.getValue(),
            subscriptionIsUnsubscribed: true
          });
        })
      )
      .subscribe();

    new Subject()
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.logger.log('The second ConnectionService subject has been unsubscribed');
          host.providerStatus$.next({
            ...host.providerStatus$.getValue(),
            subjectIsUnsubscribed: true
          });
        })
      )
      .subscribe();
  }
}
