import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function isFunction(value) {
  return typeof value === 'function';
}

export const untilDestroyed = (
  componentInstance,
  destroyMethodName = 'ngOnDestroy'
) => <T>(source: Observable<T>) => {
  const originalDestroy = componentInstance[destroyMethodName];
  if (isFunction(originalDestroy) === false) {
    throw new Error(
      `${
        componentInstance.constructor.name
      } is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }
  componentInstance['__takeUntilDestroy'] =
    componentInstance['__takeUntilDestroy'] || new Subject();

  componentInstance[destroyMethodName] = function() {
    componentInstance['__takeUntilDestroy'].next(true);
    componentInstance['__takeUntilDestroy'].complete();
    isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
  };

  return source.pipe(takeUntil<T>(componentInstance['__takeUntilDestroy']));
};
