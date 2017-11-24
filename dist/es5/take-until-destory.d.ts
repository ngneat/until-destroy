import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
/**
 *
 * @param {Function} constructor
 * @constructor
 */
export declare function TakeUntilDestroy<T extends {
    new (...args: any[]): {};
}>(constructor: T): {
    new (...args: any[]): {
        _takeUntilDestroy$: Subject<boolean>;
        readonly componentDestroyed$: Observable<boolean>;
        ngOnDestroy(): void;
    };
} & T;
