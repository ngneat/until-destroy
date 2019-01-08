import { untilDestroyed } from './take-until-destroy';

/**
 * Autamatically unsubscribes from pipe when component destroyed.
 *
 * @example
 * ```ts
 * @Component({...})
 * class MyComponent implements OnDestroy {
 *   @AutoUnsubscribe()
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
export function AutoUnsubscribe(destroyMethodName?: string): PropertyDecorator {
  return (target, propKey) => {
    const originalProp = target[propKey];

    if (delete target[propKey]) {
      Object.defineProperty(target, propKey, {
        enumerable: true,
        configurable: true,
        value: (originalProp as Observable<any>).pipe(untilDestroyed(target)),
      });
    }
  };
}
