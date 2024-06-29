import type { FunctionMeta } from "../../types"

const fourier =  (x: number) => {
    const sin = Math.sin
    return sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7;
}

const f: FunctionMeta = {
    f: fourier,
    name: "Squiggly Square",
}

export default f