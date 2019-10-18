import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  ɵComponentDef as ComponentDef,
  ɵDirectiveDef as DirectiveDef
} from '@angular/core';
import { Subject } from 'rxjs';

export function isFunction(target: unknown) {
  return typeof target === 'function';
}

/**
 * Applied to instances and stores `Subject` instance
 */
export const DESTROY: unique symbol = Symbol('__destroy');

/**
 * Applied to definitions and informs that class is decorated
 */
export const DECORATOR_APPLIED: unique symbol = Symbol('__decoratorApplied');

export interface UntilDestroyOptions {
  blackList?: string[];
  arrayName?: string;
  checkProperties?: boolean;
}

export function ensureDirectiveIsDecorated(instance: any): never | void {
  const def = getDef(instance.constructor);
  const missingDecorator = !(def as any)[DECORATOR_APPLIED];

  if (missingDecorator) {
    throw new Error(
      'untilDestroyed operator cannot be used inside directives or ' +
        'components that are not decorated with UntilDestroy decorator'
    );
  }
}

export function createSubjectOnTheInstance(instance: any): void {
  if (!instance[DESTROY]) {
    instance[DESTROY] = new Subject<void>();
  }
}

export function completeSubjectOnTheInstance(instance: any): void {
  if (instance[DESTROY]) {
    instance[DESTROY].next();
    instance[DESTROY].complete();
  }
}

/**
 * As directive and component definitions are considered private API,
 * so those properties are prefixed with Angular's marker for "private"
 */
export function getDef<T>(
  type: DirectiveType<T> | ComponentType<T>
): DirectiveDef<T> | ComponentDef<T> {
  return (type as DirectiveType<T>).ɵdir || (type as ComponentType<T>).ɵcmp;
}
