import { isObservable, Observable } from 'rxjs';

import { untilDestroyed } from './take-until-destroy';

/**
 * Automatically unsubscribes from pipe when component destroyed.
 *
 * @example
 * ```ts
 * @Component({...})
 * class MyComponent implements OnDestroy {
 *   @WithUntilDestroyed()
 *   stream$ = new Observable(...);
 *
 *   // OnDestroy method is required by Angular Compiler
 *   ngOnDestroy() {}
 * }
 * ```
 *
 * Uses {@link untilDestroyed} operator on the pipe.
 *
 * Do not forget to implement {@link OnDestroy} life-cycle hook.
 */
export function WithUntilDestroyed(destroyMethodName?: string): PropertyDecorator {
  return function(target, propKey) {
    const valKey = `__WithUntilDestroyed:${String(propKey)}__`;

    function getter() {
      return this[valKey];
    }

    function setter(newVal) {
      if (isObservable(newVal)) {
        delete this[valKey];
        Object.defineProperty(this, valKey, {
          configurable: true,
          enumerable: false,
          value: newVal.pipe(untilDestroyed(this, destroyMethodName)),
        });
      } else {
        throw Error(
          `WithUntilDestroyed: Property ${String(propKey)} on ${
            target.constructor.name
          } is not Observable!`,
        );
      }
    }

    if (delete target[propKey]) {
      Object.defineProperty(target, propKey, {
        enumerable: true,
        configurable: true,
        set: setter,
        get: getter,
      });
    }
  };
}
