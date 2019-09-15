import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType
} from '@angular/core';

import {
  getDef,
  isFunction,
  UntilDestroyOptions,
  completeSubjectOnTheInstance,
  DECORATOR_APPLIED
} from './internals';

function unsubscribe(property: any): void {
  property && isFunction(property.unsubscribe) && property.unsubscribe();
}

function unsubscribeIfPropertyIsArrayLike(property: any[]): void {
  Array.isArray(property) && property.forEach(unsubscribe);
}

export function UntilDestroy({
  blackList,
  arrayName,
  checkProperties
}: UntilDestroyOptions = {}): ClassDecorator {
  return (target: any) => {
    const type: DirectiveType<unknown> | ComponentType<unknown> = target;
    const def = getDef(type);

    // Cache the original `ngOnDestroy`
    const onDestroy: (() => void) | null = def.onDestroy;

    def.onDestroy = function(this: any) {
      // Invoke the original `ngOnDestroy` if it exists
      onDestroy && onDestroy.call(this);

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

    (def as any)[DECORATOR_APPLIED] = true;
  };
}
