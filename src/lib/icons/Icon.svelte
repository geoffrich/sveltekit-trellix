<script lang="ts">
	import iconsHref from './icons.svg?url';

	export let name: string;
	export let size: 'md' | 'xl' = 'md';
	export let spin = false;

	let classNames = {
		md: 'w-4 h-4',
		xl: 'w-8 h-8'
	};
</script>

<svg class={`${size ? classNames[size] : ''} inline self-center ${spin ? 'animate-spin' : ''}`}>
	<use href={`${iconsHref}#${name}`} />
</svg>
