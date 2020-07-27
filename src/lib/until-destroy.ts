import {
  InjectableType,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType
} from '@angular/core';
import { SubscriptionLike } from 'rxjs';

import { PipeType, isPipe } from './ivy';
import {
  getSymbol,
  isFunction,
  UntilDestroyOptions,
  completeSubjectOnTheInstance,
  markAsDecorated
} from './internals';

function unsubscribe(property: SubscriptionLike | undefined): void {
  property && isFunction(property.unsubscribe) && property.unsubscribe();
}

function unsubscribeIfPropertyIsArrayLike(property: any[]): void {
  Array.isArray(property) && property.forEach(unsubscribe);
}

function decorateNgOnDestroy(
  ngOnDestroy: (() => void) | null | undefined,
  options: UntilDestroyOptions
) {
  return function(this: any) {
    // Invoke the original `ngOnDestroy` if it exists
    ngOnDestroy && ngOnDestroy.call(this);

    // It's important to use `this` instead of caching instance
    // that may lead to memory leaks
    completeSubjectOnTheInstance(this, getSymbol());

    // Check if subscriptions are pushed to some array
    if (options.arrayName) {
      return unsubscribeIfPropertyIsArrayLike(this[options.arrayName]);
    }

    // Loop through the properties and find subscriptions
    if (options.checkProperties) {
      for (const property in this) {
        if (options.blackList?.includes(property)) {
          continue;
        }

        unsubscribe(this[property]);
      }
    }
  };
}

function decorateProviderDirectiveOrComponent<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
  options: UntilDestroyOptions
): void {
  type.prototype.ngOnDestroy = decorateNgOnDestroy(type.prototype.ngOnDestroy, options);
}

function decoratePipe<T>(type: PipeType<T>, options: UntilDestroyOptions): void {
  const def = type.ɵpipe;
  def.onDestroy = decorateNgOnDestroy(def.onDestroy, options);
}

export function UntilDestroy(options: UntilDestroyOptions = {}): ClassDecorator {
  return (type: any) => {
    if (isPipe(type)) {
      decoratePipe(type, options);
    } else {
      decorateProviderDirectiveOrComponent(type, options);
    }

    markAsDecorated(type);
  };
}
