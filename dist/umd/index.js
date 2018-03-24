(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./take-until-destory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var take_until_destory_1 = require("./take-until-destory");
    exports.TakeUntilDestroy = take_until_destory_1.TakeUntilDestroy;
    exports.untilDestroyed = take_until_destory_1.untilDestroyed;
});
//# sourceMappingURL=index.js.map