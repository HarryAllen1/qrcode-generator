import { createCanvas, loadImage } from '@napi-rs/canvas';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { qrCodeImageDataURL, width }: Record<string, string> =
		await request.json();

	if (!width) return json({ error: 'Missing width' }, { status: 400 });
	if (!qrCodeImageDataURL)
		return json({ error: 'Missing qrCodeImageDataURL' }, { status: 400 });

	const canvas = createCanvas(parseFloat(width), parseFloat(width));
	const ctx = canvas.getContext('2d');
	ctx.drawImage(
		await loadImage(qrCodeImageDataURL),
		0,
		0,
		canvas.width,
		canvas.height
	);
	return json({
		imageDataURL: canvas.toDataURL(),
	});
};
