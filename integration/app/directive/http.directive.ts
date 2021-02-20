import { Directive, Host, TemplateRef, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntilDestroy } from '@ngneat/until-destroy';
import { interval, of, Subscription } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

import { LoggerFactory } from '../logger/logger.factory';
import { DirectiveComponent } from './directive.component';

class Context {
  constructor(public $implicit: string | null) {}
}

@UntilDestroy({ checkProperties: true })
@Directive({ selector: '[http]' })
export class HttpDirective {
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    loggerFactory: LoggerFactory,
    @Host() host: DirectiveComponent,
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<Context>
  ) {
    host.httpDirectiveStatus$.next({
      subscriptionIsUnsubscribed: false
    });

    const logger = loggerFactory.createLogger('HttpDirective', 'red');

    const viewRef = viewContainerRef.createEmbeddedView(templateRef, new Context(null));

    this.subscription = interval(1000)
      .pipe(
        switchMap(() =>
          this.http
            .get<object[]>('https://jsonplaceholder.typicode.com/users')
            .pipe(catchError(() => of(<object[]>[])))
        ),
        finalize(() => {
          logger.log('interval has been unsubscribed');
          host.httpDirectiveStatus$.next({
            subscriptionIsUnsubscribed: true
          });
        })
      )
      .subscribe(response => {
        viewRef.context.$implicit = `Received such number of users: ${response.length}`;
        viewRef.detectChanges();
      });
  }
}
