import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
export interface OnDestroy {
    readonly destroyed$: Observable<boolean>;
    ngOnDestroy(): void;
}
/**
 *
 * @param destroyMethodName
 */
export declare function TakeUntilDestroy(destroyMethodName?: string): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        _takeUntilDestroy$: Subject<boolean>;
        readonly destroyed$: Observable<boolean>;
    };
} & T;
