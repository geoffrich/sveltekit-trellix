<script>
	import LoginIcon from '$lib/icons/LoginIcon.svelte';
	import LogoutIcon from '$lib/icons/LogoutIcon.svelte';
	import '../app.pcss';
	import IconLink from './IconLink.svelte';

	export let data;
</script>

<div class="flex h-full min-h-0 flex-col">
	<div
		class="box-border flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-4"
	>
		<a href="/home" class="block w-1/3 leading-3">
			<div class="text-2xl font-black text-white">Trellix</div>
			<div class="text-slate-500">a Remix Demo</div>
		</a>
		<div class="flex items-center gap-6">
			<IconLink
				href="https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB"
				icon="/yt_icon_mono_dark.png"
				label="Videos"
			/>
			<IconLink
				href="https://github.com/remix-run/example-trellix"
				label="Source"
				icon="/github-mark-white.png"
			/>
			<IconLink href="https://remix.run/docs/en/main" icon="/r.png" label="Docs" />
		</div>
		<div class="flex w-1/3 justify-end">
			{#if data.userId}
				<form method="post" action="/logout">
					<button class="block text-center">
						<LogoutIcon />
						<br />
						<span class="text-xs font-bold uppercase text-slate-500"> Log out </span>
					</button>
				</form>
			{:else}
				<a href="/login" class="block text-center">
					<LoginIcon />
					<br />
					<span class="text-xs font-bold uppercase text-slate-500"> Log in </span>
				</a>
			{/if}
		</div>
	</div>

	<div class="h-full min-h-0 flex-grow">
		<slot />
	</div>
</div>
