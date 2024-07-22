import type { FunctionMeta } from "../../types"

const unbalanced_square =  (x: number) => {
    const m = x % Math.PI
    if (0 <= m && m <=3*Math.PI/4) {
        return 5;
    }
    else {
        return -10;
    }
}

const f: FunctionMeta = {
    f: unbalanced_square,
    name: "Unbalanced Square",
}

export default f