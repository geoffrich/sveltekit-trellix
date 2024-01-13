<script>
	import { Label, Input } from '$lib/components/input';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="mt-20 flex min-h-full flex-1 flex-col sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2
			id="signup-header"
			class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
		>
			Sign up
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<form class="space-y-6" method="post" use:enhance>
				<div>
					<Label htmlFor="email">
						Email address
						{#if form?.errors?.email}
							<span id="email-error" class="text-brand-red">
								{form.errors.email}
							</span>
						{/if}
					</Label>
					<Input
						autoFocus
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						aria-describedby={form?.errors?.email ? 'email-error' : 'signup-header'}
						required
					/>
				</div>

				<div>
					<Label htmlFor="password">
						Password
						{#if form?.errors?.password}
							<span id="password-error" class="text-brand-red">
								{form.errors.password}
							</span>
						{/if}
					</Label>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						aria-describedby="password-error"
						required
					/>
				</div>

				<Button type="submit">Sign in</Button>

				<div class="text-sm text-slate-500">
					Already have an account?{' '}
					<a class="underline" href="/login"> Log in </a>
					.
				</div>
			</form>
		</div>
		<div class="mx-2 mt-8 space-y-2">
			<h3 class="font-bold text-black">Privacy Notice</h3>
			<p>
				We won't use your email address for anything other than authenticating with this demo
				application. This app doesn't send email anyway, so you can put whatever fake email address
				you want.
			</p>
			<h3 class="font-bold text-black">Terms of Service</h3>
			<p>
				This is a demo app, there are no terms of service. Don't be surprised if your data
				dissappears.
			</p>
		</div>
	</div>
</div>
