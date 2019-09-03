export function isFunction(target: unknown): target is () => void {
  return typeof target === 'function';
}

export const DESTROY = '__destroy';

export interface UntilDestroyOptions {
  blackList?: string[];
  arrayName?: string;
}
