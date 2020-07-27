import { InjectableType, ɵDirectiveType, ɵComponentType } from '@angular/core';
import { Subject } from 'rxjs';

import { PipeType } from './ivy';

export function isFunction(target: unknown) {
  return typeof target === 'function';
}

/**
 * Applied to instances and stores `Subject` instance when
 * no custom destroy method is provided.
 */
const DESTROY: unique symbol = Symbol('__destroy');

/**
 * Applied to definitions and informs that class is decorated
 */
const DECORATOR_APPLIED: unique symbol = Symbol('__decoratorApplied');

/**
 * If we use the `untilDestroyed` operator multiple times inside the single
 * instance providing different `destroyMethodName`, then all streams will
 * subscribe to the single subject. If any method is invoked, the subject will
 * emit and all streams will be unsubscribed. We wan't to prevent this behavior,
 * thus we store subjects under different symbols.
 */
export function getSymbol<T>(destroyMethodName?: keyof T): symbol {
  if (typeof destroyMethodName === 'string') {
    return Symbol(`__destroy__${destroyMethodName}`);
  } else {
    return DESTROY;
  }
}

export function markAsDecorated<T>(
  type: InjectableType<T> | PipeType<T> | ɵDirectiveType<T> | ɵComponentType<T>
): void {
  // Store this property on the prototype if it's an injectable class, component or directive.
  // We will be able to handle class extension this way.
  type.prototype[DECORATOR_APPLIED] = true;
}

export interface UntilDestroyOptions {
  blackList?: string[];
  arrayName?: string;
  checkProperties?: boolean;
}

export function ensureClassIsDecorated(instance: any): never | void {
  if (missingDecorator(instance.constructor)) {
    throw new Error(
      'untilDestroyed operator cannot be used inside directives or ' +
        'components or providers that are not decorated with UntilDestroy decorator'
    );
  }
}

export function createSubjectOnTheInstance(instance: any, symbol: symbol): void {
  if (!instance[symbol]) {
    instance[symbol] = new Subject<void>();
  }
}

export function completeSubjectOnTheInstance(instance: any, symbol: symbol): void {
  if (instance[symbol]) {
    instance[symbol].next();
    instance[symbol].complete();
    // We also have to re-assign this property thus in the future
    // we will be able to create new subject on the same instance.
    instance[symbol] = null;
  }
}

function missingDecorator<T>(
  type: InjectableType<T> | PipeType<T> | ɵDirectiveType<T> | ɵComponentType<T>
): boolean {
  return !(DECORATOR_APPLIED in type.prototype);
}
