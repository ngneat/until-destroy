import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DESTROY, isFunction } from './internals';

function createSubjectOnTheInstance(instance: any): void {
  if (!instance[DESTROY]) {
    instance[DESTROY] = new Subject<void>();
  }
}

function overrideNonDirectiveInstanceMethod(instance: any, destroyMethodName: string): void {
  const originalDestroy = instance[destroyMethodName];

  if (isFunction(originalDestroy) === false) {
    throw new Error(
      `${
        instance.constructor.name
      } is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }

  createSubjectOnTheInstance(instance);
  instance[destroyMethodName] = function() {
    isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
    instance[DESTROY].next();
    instance[DESTROY].complete();
  };
}

export function untilDestroyed(instance: any, destroyMethodName?: string) {
  return <T>(source: Observable<T>) => {
    // If `destroyMethodName` is passed then the developers uses
    // this operator outside of component/directive
    if (typeof destroyMethodName === 'string') {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName);
    } else {
      createSubjectOnTheInstance(instance);
    }

    return source.pipe(takeUntil<T>(instance[DESTROY]));
  };
}
