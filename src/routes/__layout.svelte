<script lang="ts">
	import '$lib/tailwind.scss';
	import '$lib/pre.scss';
</script>

<slot />

<style lang="scss" global>
	.dark .prose {
		--tw-prose-headings: #fff;
	}

	.dark .prose code {
		background-color: #282c34;
		color: #abb2bf;
		border-radius: 4px;
		padding: 3px 6px;

		&::before,
		&::after {
			content: '';
		}
	}

	.prose code {
		background-color: #eaeaeb;
		color: #383a42;
		border-radius: 4px;
		padding: 3px 6px;

		&::before,
		&::after {
			content: '';
		}
	}
</style>
