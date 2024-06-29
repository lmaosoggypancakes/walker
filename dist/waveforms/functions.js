"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.f = void 0;
const f = (fn, amplitude, freq) => {
    return (x) => {
        return amplitude * fn(freq * x);
    };
};
exports.f = f;
