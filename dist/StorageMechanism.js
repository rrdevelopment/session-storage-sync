"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StorageMechanism = (function () {
    function StorageMechanism(storage) {
        this._storage = storage;
    }
    Object.defineProperty(StorageMechanism.prototype, "length", {
        get: function () {
            var _a;
            return (_a = this._storage) === null || _a === void 0 ? void 0 : _a.length;
        },
        enumerable: true,
        configurable: true
    });
    StorageMechanism.prototype.get = function (key) {
        var _a;
        var value = (_a = this._storage) === null || _a === void 0 ? void 0 : _a.getItem(key);
        return value;
    };
    StorageMechanism.prototype.set = function (key, value) {
        var _a;
        (_a = this._storage) === null || _a === void 0 ? void 0 : _a.setItem(key, value);
    };
    StorageMechanism.prototype.remove = function (key) {
        var _a;
        (_a = this._storage) === null || _a === void 0 ? void 0 : _a.removeItem(key);
    };
    StorageMechanism.prototype.clear = function () {
        var _a;
        (_a = this._storage) === null || _a === void 0 ? void 0 : _a.clear();
    };
    StorageMechanism.prototype.key = function (index) {
        var _a;
        var value = (_a = this._storage) === null || _a === void 0 ? void 0 : _a.key(index);
        return value && value;
    };
    return StorageMechanism;
}());
exports.StorageMechanism = StorageMechanism;
