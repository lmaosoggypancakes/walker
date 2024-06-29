"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (x) => {
    const sin = Math.sin;
    return sin(x) + sin(3 * x) / 3 + sin(5 * x) / 5 + sin(7 * x) / 7;
};
