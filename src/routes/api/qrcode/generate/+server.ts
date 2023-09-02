import { ALLOWED_FORMATS, VALID_ERROR_CORRECTION_LEVELS, validateColor } from '$lib';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import QRCode, { type QRCodeErrorCorrectionLevel } from 'qrcode';

export const GET = (async ({ fetch, url: { searchParams } }) => {
	let format = searchParams.get('format') ?? 'svg';
	if (format === 'jpg') format = 'jpeg';

	const res = await fetch('.', {
		method: 'POST',
		body: JSON.stringify({
			text: searchParams.get('text'),
			format,
			margin: searchParams.get('margin'),
			errorCorrectionLevel: searchParams.get('error-correction'),
			backgroundColor: searchParams.get('background-color'),
			foregroundColor: searchParams.get('foreground-color'),
			imageUrl: searchParams.get('image-url'),
		}),
	});

	if (!res.ok) throw error(res.status, { message: res.statusText });

	const buffer = await res.arrayBuffer();

	return new Response(buffer, {
		headers: {
			'Content-Type': format === 'svg' ? 'image/svg+xml' : `image/${format}`,
			'Content-Length': buffer.byteLength.toString(),
		},
	});
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = (await request.json().catch(() => {
		throw error(400, { message: 'Invalid JSON' });
	})) as {
		text?: string;
		format?: string;
		margin?: number;
		errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
		backgroundColor: string | number;
		foregroundColor: string | number;

		imageUrl?: string;
	};

	// defaults
	body.format ??= 'svg';
	if (body.format === 'jpg') body.format = 'jpeg';
	body.margin ??= 4;
	body.errorCorrectionLevel ??= 'M';
	body.backgroundColor ??= '#ffffff';
	body.foregroundColor ??= '#000000';

	body.text &&= String(body.text);
	if (!body.text) throw error(400, { message: 'Missing required parameter "text"' });
	if (typeof body.margin !== 'number' || body.margin < 0)
		throw error(400, { message: `Invalid margin "${body.margin}"` });
	if (!ALLOWED_FORMATS.includes(body.format))
		throw error(400, { message: `Invalid format "${body.format}"` });
	body.backgroundColor = validateColor(body.backgroundColor);
	body.foregroundColor = validateColor(body.foregroundColor);
	if (!VALID_ERROR_CORRECTION_LEVELS.includes(body.errorCorrectionLevel))
		throw error(400, { message: `Invalid error correction level "${body.errorCorrectionLevel}"` });

	let qrcode: Buffer;
	try {
		qrcode = await QRCode.toBuffer(body.text, {
			margin: body.margin,
			color: {
				dark: body.foregroundColor,
				light: body.backgroundColor,
			},
			errorCorrectionLevel: body.errorCorrectionLevel,
		});
	} catch (err: unknown) {
		if (err instanceof Error) throw error(400, { message: err.message });
		throw error(500, { message: 'Unknown error' });
	}

	if (body.imageUrl) {
		try {
			new URL(body.imageUrl);
		} catch (err: unknown) {
			throw error(400, { message: `Invalid image URL "${body.imageUrl}"` });
		}
	}

	return new Response();
}) satisfies RequestHandler;
