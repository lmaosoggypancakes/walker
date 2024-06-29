import type { FunctionMeta } from "../../types"

const bouncy = (x: number) => {
    const up = 8 * Math.sin(x);
    if (up >= 0) return up;
    return Math.sin(6*x);
}

const f: FunctionMeta = {
    f: bouncy,
    name: "Bouncy",
}

export default f