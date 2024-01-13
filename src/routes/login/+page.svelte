<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { Input, Label } from '$lib/components/input';
	export let form;
</script>

<svelte:head>
	<title>Trellix Login</title>
</svelte:head>

<div class="mt-20 flex min-h-full flex-1 flex-col sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2
			id="login-header"
			class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
		>
			Log in
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
						aria-describedby={form?.errors?.email ? 'email-error' : 'login-header'}
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

				<div>
					<Button type="submit">Sign in</Button>
				</div>
				<div class="text-sm text-slate-500">
					Don't have an account?{' '}
					<a class="underline" href="/signup">Sign up</a>
					.
				</div>
			</form>
		</div>
	</div>
</div>
