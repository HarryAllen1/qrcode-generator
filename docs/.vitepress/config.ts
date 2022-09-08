import { defineConfig } from 'vitepress';

export default defineConfig({
	title: 'QR Code Generator API Documentation',
	vue: {
		reactivityTransform: true,
	},
	lang: 'en-US',
	description: 'QR Code Generator API Documentation',
	base: '/docs/',
	lastUpdated: true,
	cleanUrls: 'without-subfolders',
	themeConfig: {
		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/MajesticString/qrcode-generator',
			},
		],
		editLink: {
			pattern:
				'https://github.com/MajesticString/qrcode-generator/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},
		nav: [
			{
				text: 'Endpoints',
				link: '/qrcode.md',
			},
		],
		sidebar: [
			{
				text: 'Endpoints',
				collapsible: true,
				items: [
					{
						text: 'QR Code',
						link: '/qrcode.md',
					},
					{
						text: 'Image',
						link: '/image.md',
					},
				],
			},
		],
	},
});
