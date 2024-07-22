import type { FunctionMeta } from "../../types"

const sin =  (x: number) => {
    const sin = Math.sin
    return sin(x);
}

const f: FunctionMeta = {
    f: sin,
    name: "Sine",
}

export default f