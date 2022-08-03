import QRCode from 'qrcode';
import sharp from 'sharp';
import type { RequestHandler } from './__types/generateQrcode';

export const GET: RequestHandler = async (stuff) => {
	const textParam = stuff.url.searchParams.get('text');
	const sizeParam = stuff.url.searchParams.get('size');
	const formatParam = stuff.url.searchParams.get('format');
	const marginParam = stuff.url.searchParams.get('margin');

	const allowedFormats = [
		'svg',
		'png',
		'jpg',
		'jpeg',
		'webp',
		'avif',
		'gif',
		'tif',
		'tiff',
		'terminal',
	];

	if (!textParam)
		return {
			status: 400,
			body: {
				code: 400,
				message: 'A text parameter was not provided',
			},
		};

	if (!formatParam)
		return {
			status: 400,
			body: {
				code: 400,
				message: 'A format query param was not provided',
			},
		};

	if (marginParam && !Number.isInteger(parseInt(marginParam)))
		return {
			status: 400,
			body: {
				code: 400,
				message: 'The margin query param must be a valid integer',
			},
		};

	if (!allowedFormats.includes(formatParam))
		return {
			status: 400,
			body: {
				code: 400,
				message:
					'The format query param was not one of the following: ' + allowedFormats.join(', '),
			},
		};

	const url = decodeURIComponent(textParam);

	if (formatParam === 'svg') {
		const data = await QRCode.toString(url, {
			type: formatParam as 'svg' | 'terminal',
			margin: marginParam ? parseInt(marginParam) : undefined,
		});
		return {
			status: 200,
			body: {
				data,
				type: formatParam,
				asDataURL: `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`,
			},
		};
	}
	if (formatParam === 'terminal')
		return {
			status: 200,
			body: {
				data: await QRCode.toString(url, {
					type: formatParam as 'svg' | 'terminal',
					margin: marginParam ? parseInt(marginParam) : undefined,
				}),
				type: formatParam,
			},
		};

	if (sizeParam && !Number.isInteger(parseInt(sizeParam)))
		return {
			status: 400,
			body: {
				code: 400,
				message: 'The size query param must be a valid integer',
			},
		};

	// convert to svg first to eliminate blurry edges
	const svgData = await QRCode.toString(url, {
		type: 'svg',
		margin: marginParam ? parseInt(marginParam) : undefined,
	});
	const sharpProcessed = sharp(Buffer.from(svgData)).resize(
		parseInt(sizeParam ?? '1080'),
		parseInt(sizeParam ?? '1080')
	);

	const remappedFormat =
		formatParam === 'tif' ? 'tiff' : formatParam === 'jpg' ? 'jpeg' : formatParam;

	return {
		status: 200,
		body: {
			data: `data:image/${remappedFormat};base64,${
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(await (sharpProcessed[remappedFormat]() as sharp.Sharp).toBuffer()).toString('base64')
			}`,
			type: remappedFormat,
		},
	};
};
