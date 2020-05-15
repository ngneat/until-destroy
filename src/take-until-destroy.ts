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
  const subjectName = '__takeUntilDestroy_' + destroyMethodName;
  if (!componentInstance[subjectName]) {
    componentInstance[subjectName] = new Subject();

    componentInstance[destroyMethodName] = function() {
      isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
      componentInstance[subjectName].next(true);
      componentInstance[subjectName].complete();
    };
  }
  return source.pipe(takeUntil<T>(componentInstance[subjectName]));
};
