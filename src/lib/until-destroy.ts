import {
  InjectableType,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType
} from '@angular/core';
import { SubscriptionLike } from 'rxjs';

import {
  getSymbol,
  isFunction,
  markAsDecorated,
  missingDecorator,
  UntilDestroyOptions,
  completeSubjectOnTheInstance
} from './internals';
import { PipeType, getDef, getDefName, isInjectableType } from './ivy';

function unsubscribe(property: SubscriptionLike | undefined): void {
  property && isFunction(property.unsubscribe) && property.unsubscribe();
}

function unsubscribeIfPropertyIsArrayLike(property: any[]): void {
  Array.isArray(property) && property.forEach(unsubscribe);
}

function decorateNgOnDestroy(
  ngOnDestroy: (() => void) | null | undefined,
  { arrayName, checkProperties, blackList }: UntilDestroyOptions
) {
  return function(this: any) {
    // Invoke the original `ngOnDestroy` if it exists
    ngOnDestroy && ngOnDestroy.call(this);

    // It's important to use `this` instead of caching instance
    // that may lead to memory leaks
    completeSubjectOnTheInstance(this, getSymbol());

    // Check if subscriptions are pushed to some array
    if (arrayName) {
      return unsubscribeIfPropertyIsArrayLike(this[arrayName]);
    }

    // Loop through the properties and find subscriptions
    if (checkProperties) {
      for (const property in this) {
        if (blackList && blackList.includes(property)) {
          continue;
        }

        unsubscribe(this[property]);
      }
    }
  };
}

/**
 * Services do not have definitions, thus we just have to override the
 * prototype property in Ivy
 */
function decorateProvider(type: InjectableType<unknown>, options: UntilDestroyOptions): void {
  type.prototype.ngOnDestroy = decorateNgOnDestroy(type.prototype.ngOnDestroy, options);
  markAsDecorated(type);
}

/**
 * https://github.com/ngneat/until-destroy/issues/78
 * Some declared components or directives may be compiled asynchronously in JIT,
 * especially those that're lazy-loaded. And thus may have their
 * definition not accessible yet.
 */
function decorateDeclarableJIT<T>(
  type: PipeType<T> | ComponentType<T> | DirectiveType<T>,
  options: UntilDestroyOptions
) {
  const defName = getDefName(type);
  const getter = Object.getOwnPropertyDescriptor(type, defName)!.get!;

  Object.defineProperty(type, defName, {
    get() {
      const def = getter();

      if (missingDecorator(def)) {
        (def as { onDestroy: () => void }).onDestroy = decorateNgOnDestroy(
          def.onDestroy,
          options
        );
        markAsDecorated(def);
      }

      return def;
    }
  });
}

function decorateDeclarable<T>(
  type: PipeType<T> | ComponentType<T> | DirectiveType<T>,
  options: UntilDestroyOptions
) {
  const isJIT = type.hasOwnProperty('__annotations__');

  if (isJIT) {
    decorateDeclarableJIT(type, options);
  } else {
    const def = getDef(type);
    (def as { onDestroy: () => void }).onDestroy = decorateNgOnDestroy(def.onDestroy, options);
    markAsDecorated(def);
  }
}

export function UntilDestroy(options: UntilDestroyOptions = {}): ClassDecorator {
  return (target: any) => {
    if (isInjectableType(target)) {
      decorateProvider(target, options);
    } else {
      decorateDeclarable(target, options);
    }
  };
}
