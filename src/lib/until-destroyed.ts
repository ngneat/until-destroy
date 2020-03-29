import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  DESTROY,
  isFunction,
  createSubjectOnTheInstance,
  completeSubjectOnTheInstance,
  ensureClassIsDecorated
} from './internals';

function overrideNonDirectiveInstanceMethod(instance: any, destroyMethodName: string): void {
  const originalDestroy = instance[destroyMethodName];

  if (isFunction(originalDestroy) === false) {
    throw new Error(
      `${instance.constructor.name} is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }

  createSubjectOnTheInstance(instance);

  instance[destroyMethodName] = function() {
    isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
    completeSubjectOnTheInstance(this);
    // We also have to re-assign this property back to the original value,
    // thus in the future if `untilDestroyed` is called for the same instance
    // again, we will be able to get the original method again and not the patched one.
    instance[destroyMethodName] = originalDestroy;
  };
}

export function untilDestroyed(instance: any, destroyMethodName?: string) {
  return <T>(source: Observable<T>) => {
    // If `destroyMethodName` is passed then the developer applies
    // this operator to something non-related to Angular DI system
    if (typeof destroyMethodName === 'string') {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName);
    } else {
      ensureClassIsDecorated(instance);
      createSubjectOnTheInstance(instance);
    }

    return source.pipe(takeUntil<T>(instance[DESTROY]));
  };
}
