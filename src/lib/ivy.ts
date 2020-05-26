import {
  Type,
  InjectableType,
  ɵNG_DIR_DEF,
  ɵNG_COMP_DEF,
  ɵNG_PIPE_DEF,
  ɵNG_PROV_DEF,
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  ɵPipeDef as PipeDef,
  ɵComponentDef as ComponentDef,
  ɵDirectiveDef as DirectiveDef
} from '@angular/core';

// This is done for type-safety and to make compiler happy
// because definition property names are exported as `string`,
// thus it throws `ɵNG_COMP_DEF can't be used to index type 'ɵComponentType<T>'.`
const NG_DIR_DEF = ɵNG_DIR_DEF as 'ɵdir';
const NG_COMP_DEF = ɵNG_COMP_DEF as 'ɵcmp';
const NG_PIPE_DEF = ɵNG_PIPE_DEF as 'ɵpipe';

// Angular doesn't expose publicly `PipeType` but it actually has it.
export interface PipeType<T> extends Type<T> {
  ɵpipe: never;
}

// As directive and component definitions are considered private API,
// so those properties are prefixed with Angular's marker for "private".
export function getDef<T>(
  type: PipeType<T> | ComponentType<T> | DirectiveType<T>
): PipeDef<T> | DirectiveDef<T> | ComponentDef<T> {
  return (
    (type as PipeType<T>)[NG_PIPE_DEF] ||
    (type as ComponentType<T>)[NG_COMP_DEF] ||
    (type as DirectiveType<T>)[NG_DIR_DEF]
  );
}

export function getDefName<T>(type: PipeType<T> | ComponentType<T> | DirectiveType<T>) {
  if ((type as PipeType<T>).hasOwnProperty(NG_PIPE_DEF)) {
    return NG_PIPE_DEF;
  } else if ((type as ComponentType<T>).hasOwnProperty(NG_COMP_DEF)) {
    return NG_COMP_DEF;
  } else {
    return NG_DIR_DEF;
  }
}

// Determines whether the provided `target` is some function
// decorated with `@Injectable()`.
export function isInjectableType(target: any): target is InjectableType<never> {
  return !!target[ɵNG_PROV_DEF];
}
