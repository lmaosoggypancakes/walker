<script lang="ts">
	import '../app.css';
	import Graph from '../components/graph.svelte';
    import Bouncy from "../lib/waveforms/bouncy"
    import Fourier from "../lib/waveforms/fourier"
    
	let running = false;
	let activeTab = 1;
	let selectedWaveIndex = 0;
	let waves = [Bouncy, Fourier]
	let amplitude: number = 1;
	let period: number = 1;
	let phase = 0;
	let vert = 1;
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
                            <input bind:value={amplitude} type="range" min="-10" max="10" class="range" step="0.1" />
						</label>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">Period: {period}</span>
							</div>
                            <input bind:value={period} type="range" min="0" max="2" class="range" step="0.1" />
						</label>
                        <label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">Phase: {phase}</span>
							</div>
                            <input bind:value={phase} type="range" min="-1" max="1" class="range" step="0.1" />
						</label>
					</form>
                    <Graph fm={waves[selectedWaveIndex]} period={period} amplitude={amplitude} phase={phase}/>
				</div>
			{/if}
		</div>
		<button
			class={`btn mt-auto ${running ? 'btn-primary' : 'btn-secondary'}`}
			on:click={() => (running = !running)}>{running ? 'Stop Server' : 'Start Server'}</button
		>
	</div>
</div>
