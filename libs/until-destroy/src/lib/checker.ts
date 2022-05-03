import {
  NgZone,
  ElementRef,
  ɵgetLContext,
  ɵɵdirectiveInject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  asapScheduler,
  EMPTY,
  from,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
} from 'rxjs';
import { catchError, filter, mergeMap, observeOn } from 'rxjs/operators';

import { getSymbol } from './internals';

const CLEANUP = 7;

/**
 * This function is used within the `UntilDestroy` decorator and returns a
 * new class that setups a checker that the `destroy$` subject doesn't have
 * observers (usually `takeUntil`) once the view is removed.
 * Note: this code will not be shipped into production since it's guarded with `ngDevMode`,
 * this means it'll exist only in development mode.
 */
export function createSubjectUnsubscribedChecker(type: any) {
  if (isAngularInTestMode()) {
    return type;
  }

  return class SubjectUnsubscribedChecker extends type {
    constructor(...args: any[]) {
      super(...args);

      try {
        const ngZone = ɵɵdirectiveInject(NgZone);
        const platformId = ɵɵdirectiveInject(PLATFORM_ID);
        const { nativeElement } = ɵɵdirectiveInject(ElementRef);

        // The checker should be executed only in the browser.
        if (isPlatformServer(platformId)) {
          return;
        }

        ngZone.runOutsideAngular(() =>
          from(Promise.resolve())
            .pipe(
              mergeMap(() => {
                const lContext = ɵgetLContext(nativeElement);
                if (lContext === null) {
                  return EMPTY;
                }

                const lCleanup = lContext.lView[CLEANUP] || (lContext.lView[CLEANUP] = []);
                const cleanupHasBeenExecuted$ = new Subject<
                  Subject<void> | null | undefined
                >();
                lCleanup.push(() => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore Type 'symbol' cannot be used as an index type.
                  const destroy$: Subject<void> | null | undefined = this[getSymbol()];
                  cleanupHasBeenExecuted$.next(destroy$);
                  cleanupHasBeenExecuted$.complete();
                });
                return cleanupHasBeenExecuted$;
              }),
              filter((destroy$): destroy$ is Subject<void> => destroy$ != null),
              leaveNgZone(ngZone),
              observeOn(asapScheduler),
              catchError(() => EMPTY)
            )
            .subscribe(destroy$ => {
              // Note: The `observed` property is available only in RxJS@7.2.0, which will throw
              // an error in lower versions; that's why it's wrapped into braces. The `observers`
              // property is also being deprecated.
              const observed = destroy$['observed'] ?? destroy$['observers'].length > 0;
              if (observed) {
                console.warn(createMessage(this));
              }
            })
        );
      } catch {
        // Leave the catch statement as empty since we don't have to execute any error handling logic here.
      }
    }
  };
}

function createMessage(context: any): string {
  return `
  The ${context.constructor.name} still has subscriptions that haven't been unsubscribed.
  This may happen if the class extends another class decorated with @UntilDestroy().
  The child class implements its own ngOnDestroy() method but doesn't call super.ngOnDestroy().
  Let's look at the following example:

  @UntilDestroy()
  @Directive()
  export abstract class BaseDirective {}

  @Component({ template: '' })
  export class ConcreteComponent extends BaseDirective implements OnDestroy {
    constructor() {
      super();

      someObservable$.pipe(untilDestroyed(this)).subscribe();
    }

    ngOnDestroy(): void {
      // Some logic here...
    }
  }

  The BaseDirective.ngOnDestroy() will not be called since Angular will call ngOnDestroy()
  on the ConcreteComponent, but not on the BaseDirective.

  One of the solutions is to declare an empty ngOnDestroy method on the BaseDirective:

  @UntilDestroy()
  @Directive()
  export abstract class BaseDirective {
    ngOnDestroy(): void {}
  }

  @Component({ template: '' })
  export class ConcreteComponent extends BaseDirective implements OnDestroy {
    constructor() {
      super();

      someObservable$.pipe(untilDestroyed(this)).subscribe();
    }

    ngOnDestroy(): void {
      // Some logic here...
      super.ngOnDestroy();
    }
  }
  `;
}

/** Gets whether the code is currently running in a test environment. */
function isAngularInTestMode(): boolean {
  // We can't use `declare const` because it causes conflicts inside Google with the real typings
  // for these symbols and we can't read them off the global object, because they don't appear to
  // be attached there for some runners like Jest.
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (typeof __karma__ !== 'undefined' && !!__karma__) ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (typeof jasmine !== 'undefined' && !!jasmine) ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (typeof jest !== 'undefined' && !!jest) ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (typeof Mocha !== 'undefined' && !!Mocha)
  );
}

function leaveNgZone<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return function leaveNgZoneOperator(source: Observable<T>) {
    return new Observable(observer =>
      source.subscribe(value => ngZone.runOutsideAngular(() => observer.next(value)))
    );
  };
}
