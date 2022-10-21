import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const textParam = url.searchParams.get('text');
	const img = await fetch('/api/qrcode', {
		method: 'POST',
		body: JSON.stringify({
			text: textParam ?? 'https://generate-qr.codes',
			format: 'png',
			errorCorrectionParam: 'M',
		}),
	});
	const uri = ((await img.json()).data as string).replace(
		'data:image/png;base64,',
		''
	);
	const buffer = Buffer.from(uri, 'base64');

	return new Response(buffer, {
		headers: {
			'Content-Type': 'image/png',
			'Content-Length': buffer.length.toString(),
		},
	});
};
