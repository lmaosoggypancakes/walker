<script lang="ts">
    import { onMount, afterUpdate } from 'svelte'
	import type { FunctionMeta } from "../types";
    import { generateLookupTable } from "../lib/waveforms/functions"
	import { new_f } from '$lib/waveforms/functions';

    let canvas: HTMLCanvasElement
    let context: CanvasRenderingContext2D
    let table: number[]

    export let fm: FunctionMeta
    export let period: number
    export let phase: number
    export let amplitude: number
    $: {
        amplitude;
        period;
        phase;
        fn = new_f(fm.f, amplitude, 2*Math.PI/period,phase, 0)
        generatePath()
    }
    let fn = new_f(fm.f, amplitude, 2*Math.PI/period,phase, 0)

    const generatePath = () => {
        if (!canvas || !context) {
            console.log("bad ctx");
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        const y = canvas.height
        const x = canvas.width
        table = generateLookupTable(fn, 4*Math.PI)
        context.beginPath()
        for(let i = 0; i < x; i++) {
            if (i == 0) {
                context.moveTo(i, y-table[i]-y/2)
            } else {
                context.lineTo(i, y-table[i]-y/2)
            }
        }
        context.stroke();
    }

    onMount(() => {
      
        const ctx = canvas.getContext('2d')
        if (ctx) {
            context = ctx
        }        
        generatePath()
    })



</script>

<canvas width="300"
bind:this={canvas} ></canvas>