<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	export const openModal = writable('');
</script>

<script lang="ts">
	import {
		Transition,
		TransitionChild,
		Dialog,
		DialogTitle,
		DialogOverlay,
	} from '@rgossiaux/svelte-headlessui';

	export let title: string;
	export let open = false;

	export const closeModal = () => {
		open = false;
		$openModal = '';
	};
</script>

<Transition appear show={open}>
	<Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" on:close={closeModal}>
		<div class="min-h-screen px-4 text-center">
			<TransitionChild
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<DialogOverlay class="fixed inset-0 bg-black opacity-30" />
			</TransitionChild>

			<TransitionChild
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<!-- This element is to trick the browser into centering the modal contents. -->
				<span class="inline-block h-screen align-middle" aria-hidden="true" />
				<div
					class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-200 dark:bg-slate-900 shadow-xl text-black dark:text-white rounded-2xl"
				>
					<DialogTitle as="h3" class="text-lg font-medium leading-6 text-black dark:text-white">
						{title}
					</DialogTitle>
					<div class="mt-2">
						<p class="text-sm prose text-black dark:text-white">
							<slot />
						</p>
					</div>

					<div class="mt-4">
						<button
							type="button"
							class="inline-flex disabled:opacity-60 disabled:saturate-0 mr-4 justify-center rounded-md border border-transparent bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-white px-4 py-2 text-sm font-medium hover:bg-blue-300 dark:hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
							on:click={closeModal}
						>
							Close
						</button>
					</div>
				</div>
			</TransitionChild>
		</div>
	</Dialog>
</Transition>
