<script lang="ts">
	import { onMount } from "svelte"
	import '../app.css';
	import Graph from '../components/graph.svelte';
    import Bouncy from "../lib/waveforms/bouncy"
	import Sine from "../lib/waveforms/sine"
    import Fourier from "../lib/waveforms/fourier"
	import UnbalancedSquare from "../lib/waveforms/unbalanced_square"
	import axios from "axios";
    
	type Device = {
		ip: string;
		port: number;
	}
	let table: number[]
	let running = false;
	let activeTab = 1;
	let ws: WebSocket;
	let selectedWaveIndex = 0;
	let waves = [Bouncy, Fourier, Sine, UnbalancedSquare]
	let amplitude: number = 1;
	let period: number = 1;
	let phase = 0;
	let vert = 1;
	let devices: Device[] = []
	let messages: [string, Date][] = [["welcome!", new Date()]]
	let log: string;

	$: {
		let l = "\n"
		messages.forEach((m, i) => {
			l += `\t[${m[1].toUTCString()}]: ${m[0]}\n`
		})
		log = l;
	}
	const addMessage = (m: string) => {
		messages.push([m, new Date()])
		messages = messages
	}
	
	const uploadTable = (dev: Device) => {
		addMessage("uploading table to device " + dev.ip + " :: " + dev.port)
		if (!ws) return
		ws.send(JSON.stringify({
			label: "SEND TO",
			...dev,
			table,
			period
		}))
	}
	const toggleTcpServer = async () => {
		if (!running) {
			try {
				const started = await axios.get("http://localhost:5000/api/start-server")
				if (started.status !== 200) throw new Error("failed to start tcp server")
				addMessage("started tcp server")
				running = !running;
			} catch(err) {
				addMessage("failed to start tcp server")
			}
		} else {
			try {
				const started = await axios.get("http://localhost:5000/api/stop-server")
				if (started.status !== 200) throw new Error("failed to stop tcp server")
				addMessage("stopped tcp server")
				running = !running;
			} catch(err) {
				addMessage("failed to stop tcp server")
			}
		}
	}
	onMount(async () => {
		try {
			addMessage("connecting to websocket...")
			ws = new WebSocket("ws://localhost:5000")
			addMessage("connected to websocket")
			ws.onmessage = m => {
				console.log(m.data)
				const json = JSON.parse(m.data)
				if (json.label == "CONNECTION") {
					addMessage("connection: " + json.data.ip + " :: " + json.data.port)
					devices.push(json.data)
				}
				if (json.label == "DISCONNECT") {
					let index = devices.findIndex(function(ip) {
						return ip == json.data
					})
					if (index !== -1) devices.splice(index, 1);
				}
				devices = devices
			}
		} catch(err) {
			addMessage("failed to connect to websocket")
		}
	})
</script>

<div class=" md:max-w-2xl w-full mx-auto h-full py-16 px-4">
	<div class="w-full h-full rounded-md bg-base-100 text-primary flex flex-col justify-center p-4">
		<div role="tablist" class="tabs tabs-bordered mb-4">
			<button
				role="tab"
				class="tab {activeTab == 1 && 'tab-active'}"
				on:click={() => (activeTab = 1)}>Waveforms</button
			>
			<button
				role="tab"
				class="tab {activeTab == 2 && 'tab-active'}"
				on:click={() => (activeTab = 2)}>Configuration</button
			>
			<button
				role="tab"
				class="tab {activeTab == 3 && 'tab-active'}"
				on:click={() => (activeTab = 3)}
			>
				Devices</button
			>
		</div>
		<div class="container bg-base-200 rounded-md h-[50%] overflow-x-scroll">
			{#if activeTab == 1}
				<div class="h-full w-full grid grid-rows-2 grid-flow-col gap-4 p-4">
					{#each waves as wave, index}
						<button
							class="btn w-32 h-32 p-1 border-4 rounded-2xl {selectedWaveIndex == index
								? 'border-info'
								: 'border-base-200'}"
							on:click={() => (selectedWaveIndex = index)}
						>
							<div
								class="h-full w-full bg-base-content text-primary font-bold rounded-xl flex flex-col items-center justify-center"
							>
								{wave.name}
							</div>
						</button>
					{/each}
				</div>
			{/if}
			{#if activeTab == 2}
				<div class="h-full w-full px-8 py-4 grid grid-cols-2">
					<form>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">Amplitude: {amplitude}</span>
							</div>
                            <input bind:value={amplitude} type="range" min="-128" max="128" class="range" step="0.1" />
						</label>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">Period: {period} seconds	</span>
							</div>
                            <input bind:value={period} type="range" min="0" max="12.7" class="range" step="0.1" />
						</label>
                        <label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">Phase: {phase}</span>
							</div>
                            <input bind:value={phase} type="range" min="-1" max="1" class="range" step="0.1" />
						</label>
					</form>
                    <Graph fm={waves[selectedWaveIndex]} period={period} amplitude={amplitude} phase={phase} on:new_table={(event) => table = event.detail.table}/>
				</div>
			{/if}
			{#if activeTab == 3}
				<ul class="bg-neutral rounded-md mt-4 text-base-content py-4 px-6 overflow-y-auto space-y-4">
					{#each devices as dev}
					<li class="bg-primary rounded-md p-4 flex justify-between items-center"><span>{dev.ip}:{dev.port}</span><button class="btn btn-secondary uppercase" on:click={() => uploadTable(dev)}>upload</button></li>
					{/each}
				</ul>
			{/if}
		</div>
		<span class="text-primary-content my-2">Output Log</span>
		<div class="mockup-code overflow-auto text-xs max-h-48">
		<pre>
			<code>{log}</code>
		</pre>
		</div>
		<button
			class={`btn mt-auto uppercase ${running ? 'btn-primary' : 'btn-secondary'}`}
			on:click={toggleTcpServer}>{running ? 'Stop Server' : 'Start Server'}</button
		>
	</div>
</div>
