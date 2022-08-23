import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('QR Code Generator');
});

test('using url params fills text input', async ({ page }) => {
	await page.goto('/?text=test-text');

	expect(await page.inputValue('[placeholder="URL"]')).toBe('test-text');
});

test.describe('format picker', async () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('picking png changes image type', async ({ page }) => {
		await page.locator('#image-format .image-format-btn').click();
		await page
			.locator('#image-format li[role="option"]', { hasText: 'png' })
			.click();
		expect(await page.locator('#qr-image').getAttribute('src')).toContain(
			'data:image/png'
		);
		expect(
			await page.locator('.image-format-btn span.block.truncate').textContent()
		).toBe('png');
	});

	test('picking jpeg changes image type', async ({ page }) => {
		await page.locator('#image-format .image-format-btn').click();
		await page
			.locator('#image-format li[role="option"]', { hasText: 'jpg' })
			.click();
		expect(await page.locator('#qr-image').getAttribute('src')).toContain(
			'data:image/jpeg'
		);
		expect(
			await page.locator('.image-format-btn span.block.truncate').textContent()
		).toBe('jpg');
	});

	test('picking webp changes image type', async ({ page }) => {
		await page.locator('#image-format .image-format-btn').click();
		await page
			.locator('#image-format li[role="option"]', { hasText: 'webp' })
			.click();
		expect(await page.locator('#qr-image').getAttribute('src')).toContain(
			'data:image/webp'
		);
		expect(
			await page.locator('.image-format-btn span.block.truncate').textContent()
		).toBe('webp');
	});
});
