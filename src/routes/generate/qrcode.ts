import QRCode from 'qrcode';
import sharp from 'sharp';
import type { RequestHandler } from './__types/qrcode';

export const GET: RequestHandler = async (stuff) => {
	const textParam = stuff.url.searchParams.get('text');
	const sizeParam = stuff.url.searchParams.get('size');
	const formatParam = stuff.url.searchParams.get('format');
	const marginParam = stuff.url.searchParams.get('margin');
	const foregroundColorParam = stuff.url.searchParams.get('foreground');
	const backgroundColorParam = stuff.url.searchParams.get('background');
	const noDataURLParam = stuff.url.searchParams.get('noData');

	const allowedFormats = ['svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'terminal'];

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

	try {
		const url = decodeURIComponent(textParam);

		if (formatParam === 'svg') {
			const data = await QRCode.toString(url, {
				type: formatParam as 'svg' | 'terminal',
				margin: marginParam ? parseInt(marginParam) : undefined,
				color: {
					light: backgroundColorParam ? `#${backgroundColorParam}` : '#fff',
					dark: foregroundColorParam ? `#${foregroundColorParam}` : '#000',
				},
			});
			return {
				status: 200,
				body: {
					data,
					type: formatParam,
					asDataURL: `${noDataURLParam ? '' : 'data:image/svg+xml;base64,'}${Buffer.from(
						data
					).toString('base64')}`,
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
			color: {
				light: backgroundColorParam ? `#${backgroundColorParam}` : '#fff',
				dark: foregroundColorParam ? `#${foregroundColorParam}` : '#000',
			},
		});
		const sharpProcessed = sharp(Buffer.from(svgData)).resize(
			parseInt(sizeParam ?? '1080'),
			parseInt(sizeParam ?? '1080')
		);

		const remappedFormat = formatParam === 'jpg' ? 'jpeg' : formatParam;

		return {
			status: 200,
			body: {
				data: `${noDataURLParam ? '' : `data:image/${remappedFormat};base64,`}${
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					(await (sharpProcessed[remappedFormat]() as sharp.Sharp).toBuffer()).toString('base64')
				}`,
				type: remappedFormat,
			},
		};
	} catch (e) {
		return {
			status: 500,
			body: {
				code: 500,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				message: e.toString(),
			},
		};
	}
};
