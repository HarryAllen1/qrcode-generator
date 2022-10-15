import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const textParam = url.searchParams.get('text');
	const img = await fetch('/api/qrcode', {
		method: 'POST',
		body: JSON.stringify({
			text: textParam ?? 'https://generate-qr.codes',
			format: 'svg',
			errorCorrectionParam: 'M',
		}),
	});

	return new Response((await img.json()).data, {
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	});
};
