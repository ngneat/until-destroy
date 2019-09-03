import { Subject } from 'rxjs';

export function isFunction(target: unknown) {
  return typeof target === 'function';
}

export const DESTROY = '__destroy';

export interface UntilDestroyOptions {
  blackList?: string[];
  arrayName?: string;
  checkProperties?: boolean;
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
