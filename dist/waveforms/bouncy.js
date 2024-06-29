"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (x) => {
    const up = 8 * Math.sin(x);
    if (up >= 0)
        return up;
    return Math.sin(6 * x);
};
