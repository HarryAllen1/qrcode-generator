import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	// const { imageDataURL, qrCodeImageDataURL, width }: Record<string, string> =
	// 	await request.json();
	// const canvas = createCanvas(parseInt(width), parseInt(width));
	// const ctx = canvas.getContext('2d');
	// ctx.drawImage(
	// 	await loadImage(qrCodeImageDataURL),
	// 	0,
	// 	0,
	// 	canvas.width,
	// 	canvas.height
	// );
	// return json({
	// 	imageDataURL: canvas.toDataURL(),
	// });
	return json({
		message: 'Not implemented',
	});
};
