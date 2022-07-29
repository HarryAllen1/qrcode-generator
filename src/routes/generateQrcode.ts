import QRCode from 'qrcode';
import sharp from 'sharp';
import type { RequestHandler } from './__types/generateQrcode';

export const GET: RequestHandler = async (stuff) => {
	const urlParam = stuff.url.searchParams.get('url');

	if (!urlParam)
		return {
			status: 400,
			body: {
				code: 404,
				message: 'A URL query param was not provided',
			},
		};
	const url = decodeURIComponent(urlParam);

	const body = {
		png: (
			await sharp(await QRCode.toBuffer(url))
				.png()
				.toBuffer()
		).toString('base64'),
		jpeg: (
			await sharp(await QRCode.toBuffer(url))
				.jpeg()
				.toBuffer()
		).toString('base64'),
		webp: (
			await sharp(await QRCode.toBuffer(url))
				.webp()
				.toBuffer()
		).toString('base64'),
		svg: await QRCode.toString(url, { type: 'svg' }),
		avif: (
			await sharp(await QRCode.toBuffer(url))
				.avif()
				.toBuffer()
		).toString('base64'),
	};

	return {
		status: 200,
		headers: {
			'access-control-allow-origin': '*',
		},
		body,
	};
};
