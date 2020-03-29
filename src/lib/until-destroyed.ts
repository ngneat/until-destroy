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
    // We have to re-assign this property back to the original value.
    // If the `untilDestroyed` operator is called for the same instance
    // multiple times, then we will be able to get the original
    // method again and not the patched one.
    instance[destroyMethodName] = originalDestroy;
  };
}

export function untilDestroyed<T>(instance: T, destroyMethodName?: keyof T) {
  return <U>(source: Observable<U>) => {
    // If `destroyMethodName` is passed then the developer applies
    // this operator to something non-related to Angular DI system
    if (typeof destroyMethodName === 'string') {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName);
    } else {
      ensureClassIsDecorated(instance);
      createSubjectOnTheInstance(instance);
    }

    return source.pipe(takeUntil<U>((instance as any)[DESTROY]));
  };
}
