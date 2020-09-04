import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  getSymbol,
  isFunction,
  createSubjectOnTheInstance,
  completeSubjectOnTheInstance,
  ensureClassIsDecorated
} from './internals';

function overrideNonDirectiveInstanceMethod(
  instance: any,
  destroyMethodName: string,
  symbol: symbol
): void {
  const originalDestroy = instance[destroyMethodName];

  if (isFunction(originalDestroy) === false) {
    throw new Error(
      `${instance.constructor.name} is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }

  createSubjectOnTheInstance(instance, symbol);

  instance[destroyMethodName] = function() {
    isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
    completeSubjectOnTheInstance(this, symbol);
    // We have to re-assign this property back to the original value.
    // If the `untilDestroyed` operator is called for the same instance
    // multiple times, then we will be able to get the original
    // method again and not the patched one.
    instance[destroyMethodName] = originalDestroy;
  };
}

export function untilDestroyed<T>(instance: T, destroyMethodName?: keyof T) {
  return <U>(source: Observable<U>) =>
    untilDestroyedOfObservable(source, instance, destroyMethodName);
}

export function untilDestroyedOfObservable<T, U>(
  source: Observable<U>,
  instance: T,
  destroyMethodName?: keyof T
) {
  const symbol = getSymbol<T>(destroyMethodName);

  // If `destroyMethodName` is passed then the developer applies
  // this operator to something non-related to Angular DI system
  if (typeof destroyMethodName === 'string') {
    overrideNonDirectiveInstanceMethod(instance, destroyMethodName, symbol);
  } else {
    ensureClassIsDecorated(instance);
    createSubjectOnTheInstance(instance, symbol);
  }
  return source.pipe(takeUntil<U>((instance as any)[symbol]));
}

// Compose the operator:
function untilDestroyedExtension<T, U>(
  this: Observable<U>,
  instance: T,
  destroyMethodName?: keyof T
): Observable<U> {
  return untilDestroyedOfObservable(this, instance, destroyMethodName);
}

// Add the operator to the Observable prototype:

Observable.prototype.untilDestroyed = untilDestroyedExtension;

// Extend the TypeScript interface for Observable to include the operator:

declare module 'rxjs/internal/Observable' {
  interface Observable<T> {
    untilDestroyed: typeof untilDestroyedExtension;
  }
}
