import {
  InjectableType,
  ɵPipeDef as PipeDef,
  ɵComponentDef as ComponentDef,
  ɵDirectiveDef as DirectiveDef
} from '@angular/core';
import { Subject } from 'rxjs';

import { getDef, isInjectableType, getDirectiveDef } from './ivy';

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

export function missingDecorator<T>(
  providerOrDef: InjectableType<T> | PipeDef<T> | ComponentDef<T> | DirectiveDef<T>
): boolean {
  return !(providerOrDef as any)[DECORATOR_APPLIED];
}

/**
 * When we inherit from an abstract component that is defined with @Directive() decorator empty
 * as is proposed by Angular, the child component will have a DirectiveDef referencing the parent
 * and we have to check if has the decorator applied.
 */
export function missingParentDecorator<T>(
  providerOrDef: InjectableType<T> | PipeDef<T> | ComponentDef<T> | DirectiveDef<T>
): boolean {
  return !getDirectiveDef((providerOrDef as any).type)[DECORATOR_APPLIED];
}

/**
 *
 * When we inherit from an abstract component that is not decorated with @Directive()
 * we have to check if the prototype has the decorator applied.
 */
export function missingPrototypeDecorator<T>(
  providerOrDef: InjectableType<T> | PipeDef<T> | ComponentDef<T> | DirectiveDef<T>
): boolean {
  return (providerOrDef as any)?.type?.prototype?.__proto__[DECORATOR_APPLIED];
}

export function markAsDecorated<T>(
  providerOrDef: InjectableType<T> | PipeDef<T> | ComponentDef<T> | DirectiveDef<T>
): void {
  (providerOrDef as any)[DECORATOR_APPLIED] = true;
}

export interface UntilDestroyOptions {
  blackList?: string[];
  arrayName?: string;
  checkProperties?: boolean;
}

export function ensureClassIsDecorated(instance: any): never | void {
  const constructor = instance.constructor;
  const providerOrDef = isInjectableType(constructor) ? constructor : getDef(constructor);

  if (
    missingDecorator(providerOrDef) &&
    missingParentDecorator(providerOrDef) &&
    missingPrototypeDecorator(providerOrDef)
  ) {
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
