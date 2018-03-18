import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';

export interface OnDestroy {
  readonly destroyed$?: Observable<boolean>;
  ngOnDestroy(): void;
}

/**
 *
 * @param value
 * @returns {boolean}
 */
function isFunction( value ) {
  return typeof value === 'function';
}

/**
 *
 * @param destroyMethodName
 */
export function TakeUntilDestroy(destroyMethodName = 'ngOnDestroy') {

  return function<T extends { new( ...args: any[] ): {} }>(constructor: T) {

    const originalDestroy = constructor.prototype[destroyMethodName];

    if( !isFunction(originalDestroy) ) {
      console.warn(`${constructor.name} is using @TakeUntilDestroy but does not implement ${destroyMethodName}`);
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
    }
  }
}

export const untilDestroyed = that => <T>(source: Observable<T>) => {
  if (!('destroyed$' in that)) {
    console.warn(`'destroyed$' property does not exist on ${that.constructor.name}. Did you decorate the class with '@TakeUntilDestroy()'?`);
    return source;
  }

  return source.pipe(takeUntil<T>(that.destroyed$));
};
