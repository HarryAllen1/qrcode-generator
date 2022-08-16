import { error } from '$lib/error';
import { json } from '@sveltejs/kit';
import QRCode, { type QRCodeErrorCorrectionLevel } from 'qrcode';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const {
		text: textParam,
		size: sizeParam,
		format: formatParam,
		margin: marginParam,
		foreground: foregroundColorParam,
		background: backgroundColorParam,
		noDataURL: noDataURLParam,
		errorCorrection: errorCorrectionParam,
	} = (await request.json()) as Record<string, string>;

	const allowedFormats = ['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'terminal'];

	if (
		errorCorrectionParam &&
		!['L', 'M', 'Q', 'H', 'low', 'medium', 'quartile', 'high'].includes(errorCorrectionParam)
	)
		return error(
			400,
			'Invalid error correction level. Error collection level must be one of L, M, Q, H.'
		);
	if (!textParam) return error(400, 'A text parameter was not provided');

	if (!formatParam) return error(400, 'A format query param was not provided');

	if (marginParam && !Number.isInteger(parseInt(marginParam)))
		return error(400, 'The margin query param must be a valid integer');

	if (!allowedFormats.includes(formatParam))
		return error(
			400,
			'The format query param was not one of the following: ' + allowedFormats.join(', ')
		);

	try {
		const url = decodeURIComponent(textParam);

		if (formatParam === 'svg') {
			const data = await QRCode.toString(url, {
				type: formatParam as 'svg' | 'terminal',
				margin: marginParam ? parseInt(marginParam) : undefined,
				errorCorrectionLevel: (errorCorrectionParam as QRCodeErrorCorrectionLevel) ?? 'M',
				color: {
					light: backgroundColorParam ? `#${backgroundColorParam}` : '#fff',
					dark: foregroundColorParam ? `#${foregroundColorParam}` : '#000',
				},
			});
			return json({
				data,
				type: formatParam,
				asDataURL: `${noDataURLParam ? '' : 'data:image/svg+xml;base64,'}${Buffer.from(
					data
				).toString('base64')}`,
			});
		}
		if (formatParam === 'terminal')
			return json({
				data: await QRCode.toString(url, {
					type: formatParam as 'svg' | 'terminal',
					errorCorrectionLevel: (errorCorrectionParam as QRCodeErrorCorrectionLevel) ?? 'M',
					margin: marginParam ? parseInt(marginParam) : undefined,
				}),
				type: formatParam,
			});

		if (sizeParam && !Number.isInteger(parseInt(sizeParam)))
			return error(400, 'The size query param must be a valid integer');

		// convert to svg first to eliminate blurry edges
		const svgData = await QRCode.toString(url, {
			type: 'svg',
			margin: marginParam ? parseInt(marginParam) : undefined,
			errorCorrectionLevel: (errorCorrectionParam as QRCodeErrorCorrectionLevel) ?? 'M',
			width: parseInt(sizeParam ?? '1080'),
			color: {
				light: backgroundColorParam ? `#${backgroundColorParam}` : '#fff',
				dark: foregroundColorParam ? `#${foregroundColorParam}` : '#000',
			},
		});
		const sharpProcessed = sharp(Buffer.from(svgData));

		const remappedFormat = formatParam === 'jpg' ? 'jpeg' : formatParam;

		return json({
			data: `${noDataURLParam ? '' : `data:image/${remappedFormat};base64,`}${
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				(await (sharpProcessed[remappedFormat]() as sharp.Sharp).toBuffer()).toString('base64')
			}`,
			type: remappedFormat,
		});
	} catch (e) {
		return error(
			500,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			e.toString()
		);
	}
};
