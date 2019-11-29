import {
  InjectableType,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType
} from '@angular/core';

import {
  getDef,
  isFunction,
  UntilDestroyOptions,
  completeSubjectOnTheInstance,
  isInjectableType,
  markAsDecorated
} from './internals';

function unsubscribe(property: any): void {
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
    completeSubjectOnTheInstance(this);

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

function decorateDirective(
  type: DirectiveType<unknown> | ComponentType<unknown>,
  options: UntilDestroyOptions
): void {
  const def = getDef(type);
  def.onDestroy = decorateNgOnDestroy(def.onDestroy, options);
  markAsDecorated(def);
}

export function UntilDestroy(options: UntilDestroyOptions = {}): ClassDecorator {
  return (target: any) => {
    if (isInjectableType(target)) {
      decorateProvider(target, options);
    } else {
      decorateDirective(target, options);
    }
  };
}
