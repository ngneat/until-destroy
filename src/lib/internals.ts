export function isFunction(target: unknown) {
  return typeof target === 'function';
}

export const DESTROY = '__destroy';

export interface UntilDestroyOptions {
  blackList?: string[];
  arrayName?: string;
}
