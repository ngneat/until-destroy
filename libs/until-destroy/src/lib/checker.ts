import { ɵglobal, ɵgetLContext, ɵLContext } from '@angular/core';
import { EMPTY, from, Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// `LView` is an array where each index matches the specific data structure.
// The 7th element in an `LView` is an array of cleanup listeners. They are
// invoked when the view is removed (similar to `ComponentRef.onDestroy`).
const CLEANUP = 7;

const CheckerHasBeenSet = Symbol('CheckerHasBeenSet');

export function setupSubjectUnsubscribedChecker(instance: any, destroy$: Subject<void>): void {
  // This function is used within the `untilDestroyed` operator and setups a function that
  // listens for the view removal and checks if the `destroy$` subject has any observers (usually `takeUntil`).
  // Note: this code will not be shipped into production since it's guarded with `ngDevMode`,
  // this means it'll exist only in development mode.

  if (instance[CheckerHasBeenSet]) {
    return;
  }

  runOutsideAngular(() =>
    from(Promise.resolve())
      .pipe(
        mergeMap(() => {
          let lContext: ɵLContext | null;

          try {
            // The `ɵgetLContext` might not work for a pipe, because it's not a component nor a directive,
            // which means there's no `RNode` for an instance.
            lContext = ɵgetLContext(instance);
          } catch {
            lContext = null;
          }

          const lView = lContext?.lView;

          if (lView == null) {
            return EMPTY;
          }

          const lCleanup = lView[CLEANUP] || (lView[CLEANUP] = []);
          const cleanupHasBeenExecuted$ = new Subject<void>();
          // Note: this function is named for debugging purposes.
          lCleanup.push(function untilDestroyedLCleanup() {
            // We leave the Angular zone, so RxJS will also call subsequent `next` functions
            // outside of the Angular zone, which is done to avoid scheduling a microtask (through
            // `asapScheduler`) within the Angular zone.
            runOutsideAngular(() => {
              cleanupHasBeenExecuted$.next();
              cleanupHasBeenExecuted$.complete();
            });
          });
          return cleanupHasBeenExecuted$;
        }),
        observeOnPromise()
      )
      .subscribe(() => {
        // Note: The `observed` property is available only in RxJS@7.2.0, which will throw
        // an error in lower versions. We have integration test with RxJS@6 to ensure we don't
        // import operators from `rxjs`; that's why it's wrapped into braces. The `observers`
        // property is also being deprecated.
        const observed = destroy$['observed'] ?? destroy$['observers'].length > 0;
        if (observed) {
          console.warn(createMessage(instance));
        }
      })
  );

  instance[CheckerHasBeenSet] = true;
}

// We can't use `observeOn(asapScheduler)` because this might break the app's change detection.
// RxJS schedulers coalesce tasks and then flush the queue, which means our task might be scheduled
// within the root zone, and then all of the tasks (that were set up by developers in the Angular zone)
// will also be flushed in the root zone.
function observeOnPromise<T>() {
  return (source: Observable<T>) =>
    new Observable(observer =>
      source.subscribe({
        next: value => Promise.resolve().then(() => observer.next(value)),
      })
    );
}

function runOutsideAngular<T>(fn: () => T): T {
  // We cannot inject the `NgZone` class when running the checker. The `__ngContext__` is read
  // for the first time within a microtask which triggers change detection; we want to avoid that.
  // The `Zone` is always available globally when the `zone.js` is imported. Otherwise, it may be
  // nooped through bootstrap options. The `NgZone.runOutsideAngular` calls `Zone.root.run`, so we're
  // safe calling that function directly.
  const Zone = ɵglobal.Zone;
  const isNgZoneEnabled = !!Zone && typeof Zone.root?.run === 'function';
  return isNgZoneEnabled ? Zone.root.run(fn) : fn();
}

function createMessage(instance: any): string {
  return `
  The ${instance.constructor.name} still has subscriptions that haven't been unsubscribed.
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
