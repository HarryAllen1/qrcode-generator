<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { Provider } from '@supabase/supabase-js';
	import { page } from '$app/stores';
	import DarkModeSwitch from '$lib/DarkModeSwitch.svelte';

	let loading = false;
	let email = '';

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (err) {
			const error = err as { message: string; error_description: string };
			alert(error?.error_description || error?.message);
		} finally {
			loading = false;
		}
	};

	const loginWith = async (provider: Provider) => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: { redirectTo: $page.url.origin },
			});
			if (error) throw error;
		} catch (err) {
			const error = err as { message: string; error_description: string };
			alert(error?.error_description || error?.message);
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col items-center">
	<DarkModeSwitch />
	<form
		class="flex-col items-center flex"
		on:submit|preventDefault={handleLogin}
	>
		<h1>Log In</h1>
		<p>Sign in via magic link with your email below</p>
		<div>
			<input
				class="input dark:bg-gray-800 dark:text-slate-300"
				type="email"
				placeholder="Your email"
				bind:value={email}
			/>
		</div>
		<div>
			<input
				type="submit"
				class="inline-flex cursor-pointer disabled:opacity-60 disabled:saturate-0 mr-4 justify-center rounded-md border border-transparent bg-blue-500 dark:bg-blue-600 text-blue-900 dark:text-white px-4 py-2 text-sm font-medium hover:bg-blue-300 dark:hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
				value={loading ? 'Loading' : 'Send magic link'}
				disabled={loading}
			/>
		</div>
	</form>
	<p>Or, use one of the other methods below</p>
	<div class="space-y-2">
		<button
			class="flex flex-row items-center gap-x-2 text-base rounded-md border-[1px] border-gray-500 px-4 h-9"
			on:click={() => loginWith('discord')}
		>
			<img
				src="https://app.supabase.com/img/icons/discord-icon.svg"
				alt="Discord icon"
				class="w-6 h-6"
			/>
			Discord
		</button>
		<button
			class="flex flex-row items-center gap-x-2 text-base rounded-md border-[1px] border-gray-500 px-4 h-9"
			on:click={() => loginWith('github')}
		>
			<img
				src="https://app.supabase.com/img/icons/github-icon.svg"
				alt="GitHub icon"
				class="w-6 h-6 dark:invert"
			/>
			GitHub
		</button>
		<button
			class="flex flex-row items-center gap-x-2 text-base rounded-md border-[1px] border-gray-500 px-4 h-9"
			on:click={() => loginWith('google')}
		>
			<img
				src="https://app.supabase.com/img/icons/google-icon.svg"
				alt="Google icon"
				class="w-6 h-6"
			/>
			Google
		</button>
	</div>
</div>
