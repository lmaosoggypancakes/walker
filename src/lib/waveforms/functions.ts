export const new_f = (fn: (input: number) => number, amplitude: number, freq: number, phase: number, vert: number) => {
    // period = 2pi/freq => freq = 2pi/period
    return (x: number) => {
        return amplitude * fn(freq * (x - phase)) + vert;
    }
}  

export const generateLookupTable = (fn: (input: number) => number, domain: number) => {
    //creates a lookup table for all x in [0, domain)
    const dt = domain / 1000
    const table: number[] = [] // table[i] = fn(i*dt)
    for(let i = 0; i < 1000; i++) {
        table.push(fn(i*dt))
    }
    return table;
}