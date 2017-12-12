"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("rxjs/Subject");
/**
 *
 * @param value
 * @returns {boolean}
 */
function isFunction(value) {
    return typeof value === 'function';
}
/**
 *
 * @param {Function} constructor
 * @constructor
 */
function TakeUntilDestroy(constructor) {
    var originalDestroy = constructor.prototype.ngOnDestroy;
    if (!isFunction(originalDestroy)) {
        console.warn(constructor.name + " is using @TakeUntilDestroy but does not implement OnDestroy");
    }
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            /**
             *
             * @type {Subject<any>}
             * @private
             */
            _this._takeUntilDestroy$ = new Subject_1.Subject();
            return _this;
        }
        Object.defineProperty(class_1.prototype, "componentDestroyed$", {
            /**
             *
             * @returns {Observable<boolean>}
             */
            get: function () {
                this._takeUntilDestroy$ = this._takeUntilDestroy$ || new Subject_1.Subject();
                return this._takeUntilDestroy$.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Call the super ngOnDestroy method and clean the observers
         */
        class_1.prototype.ngOnDestroy = function () {
            isFunction(originalDestroy) && originalDestroy.apply(this, arguments);
            this._takeUntilDestroy$.next(true);
            this._takeUntilDestroy$.complete();
        };
        return class_1;
    }(constructor));
}
exports.TakeUntilDestroy = TakeUntilDestroy;
//# sourceMappingURL=take-until-destory.js.map