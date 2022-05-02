import {
  InjectableType,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { PipeType, isPipe } from './ivy';
import { createSubjectUnsubscribedChecker } from './checker';
import {
  getSymbol,
  UntilDestroyOptions,
  completeSubjectOnTheInstance,
  markAsDecorated,
} from './internals';

// This will be provided through Terser global definitions by Angular CLI. This will
// help to tree-shake away the code unneeded for production bundles.
declare const ngDevMode: boolean;

function unsubscribe(property: unknown): void {
  if (property instanceof Subscription) {
    property.unsubscribe();
  }
}

function unsubscribeIfPropertyIsArrayLike(property: unknown[]): void {
  Array.isArray(property) && property.forEach(unsubscribe);
}

function decorateNgOnDestroy(
  ngOnDestroy: (() => void) | null | undefined,
  options: UntilDestroyOptions
) {
  return function (this: any) {
    // Invoke the original `ngOnDestroy` if it exists
    ngOnDestroy && ngOnDestroy.call(this);

    // It's important to use `this` instead of caching instance
    // that may lead to memory leaks
    completeSubjectOnTheInstance(this, getSymbol());

    // Check if subscriptions are pushed to some array
    if (options.arrayName) {
      unsubscribeIfPropertyIsArrayLike(this[options.arrayName]);
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore The TS compiler throws 'typeof SubjectUnsubscribedChecker' is assignable to the constraint of type
  // 'TFunction', but 'TFunction' could be instantiated with a different subtype of constraint 'Function'.
  return (type: any) => {
    if (isPipe(type)) {
      decoratePipe(type, options);
    } else {
      decorateProviderDirectiveOrComponent(type, options);
    }

    markAsDecorated(type);

    if (ngDevMode) {
      return createSubjectUnsubscribedChecker(type);
    }
  };
}
