<script lang="ts">
	export let icon: string;
	export let href: string;
	export let label: string;
</script>

<a {href} class="text-center text-xs font-bold uppercase text-slate-500">
	<img src={icon} aria-hidden class="inline-block h-8" />
	<span class="mt-2 block">{label}</span>
</a>
