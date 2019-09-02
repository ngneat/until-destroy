import { ɵComponentDef as ComponentDef, ɵDirectiveDef as DirectiveDef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const TAKE_UNTIL_DESTROY = '__takeUntilDestroy';

function overrideNonDirectiveInstanceMethod(instance: any, destroyMethodName: string): void {
  const originalDestroy = instance[destroyMethodName];

  if (isFunction(originalDestroy) === false) {
    throw new Error(
      `${
        instance.constructor.name
      } is using untilDestroyed but doesn't implement ${destroyMethodName}`
    );
  }

  if (!instance[TAKE_UNTIL_DESTROY]) {
    instance[TAKE_UNTIL_DESTROY] = new Subject<void>();
    instance[destroyMethodName] = function() {
      isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
      instance[TAKE_UNTIL_DESTROY].next();
      instance[TAKE_UNTIL_DESTROY].complete();
    };
  }
}

function getDef(instance: any): DirectiveDef<unknown> | ComponentDef<unknown> {
  const constructor = instance.constructor;
  return constructor.ngDirectiveDef || constructor.ngComponentDef;
}

function overrideDef(instance: any): void {
  const def = getDef(instance);
  // Cache the original `ngOnDestroy`
  const onDestroy: (() => void) | null = def.onDestroy;
  instance[TAKE_UNTIL_DESTROY] = new Subject<void>();
  def.onDestroy = function() {
    // Invoke the original `ngOnDestroy` if it exists
    onDestroy && onDestroy.call(this);
    // It's important to use `this` instead of `instance`
    this[TAKE_UNTIL_DESTROY].next();
    this[TAKE_UNTIL_DESTROY].complete();
    // Restore to the original value thus we won't get access
    // to the overridden value next time
    def.onDestroy = onDestroy;
  };
}

export function untilDestroyed(instance: any, destroyMethodName?: string) {
  return <T>(source: Observable<T>) => {
    // If `destroyMethodName` is passed then the developers uses
    // this operator outside of component/directive
    if (isString(destroyMethodName)) {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName);
    } else {
      overrideDef(instance);
    }

    return source.pipe(takeUntil<T>(instance[TAKE_UNTIL_DESTROY]));
  };
}
