import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface OnDestroy {
  readonly destroyed$?: Observable<boolean>;
  ngOnDestroy(): void;
}

function isFunction(value) {
  return typeof value === 'function';
}

export const untilDestroyed = (
  componentInstance,
  destroyMethodName = 'ngOnDestroy'
) => <T>(source: Observable<T>) => {
  const originalDestroy = componentInstance[destroyMethodName];

  componentInstance['__takeUntilDestroy'] =
    componentInstance._takeUntilDestroy$ ||
    componentInstance['__takeUntilDestroy'] ||
    new Subject();

  if (!componentInstance.istud) {
    componentInstance[destroyMethodName] = function() {
      isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
      componentInstance['__takeUntilDestroy'].next(true);
      componentInstance['__takeUntilDestroy'].complete();
    };
  }

  return source.pipe(takeUntil<T>(componentInstance['__takeUntilDestroy']));
};

export function TakeUntilDestroy(destroyMethodName = 'ngOnDestroy') {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    constructor.prototype.istud = () => true;
    const originalDestroy = constructor.prototype[destroyMethodName];

    if (!isFunction(originalDestroy)) {
      console.warn(
        `${
          constructor.name
        } is using @TakeUntilDestroy but does not implement ${destroyMethodName}`
      );
    }

    return class extends constructor {
      /**
       *
       * @type {Subject<any>}
       * @private
       */
      _takeUntilDestroy$: Subject<boolean> = new Subject();

      /**
       *
       * @returns {Observable<boolean>}
       */
      get destroyed$() {
        this._takeUntilDestroy$ = this._takeUntilDestroy$ || new Subject();
        return this._takeUntilDestroy$.asObservable();
      }

      /**
       * Call the super destroyMethodName method and clean the observers
       */
      [destroyMethodName]() {
        isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
        this._takeUntilDestroy$.next(true);
        this._takeUntilDestroy$.complete();
      }
    };
  };
}
