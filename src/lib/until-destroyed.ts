import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  DESTROY,
  isFunction,
  createSubjectOnTheInstance,
  completeSubjectOnTheInstance,
  ensureDirectiveIsDecorated
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
  };
}

export function untilDestroyed(instance: any, destroyMethodName?: string) {
  return <T>(source: Observable<T>) => {
    // If `destroyMethodName` is passed then the developers uses
    // this operator outside of component/directive
    if (typeof destroyMethodName === 'string') {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName);
    } else {
      ensureDirectiveIsDecorated(instance);
      createSubjectOnTheInstance(instance);
    }

    return source.pipe(takeUntil<T>(instance[DESTROY]));
  };
}
