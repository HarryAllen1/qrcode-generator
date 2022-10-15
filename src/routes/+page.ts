import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const textParam = url.searchParams.get('text');
	if (!textParam)
		return {
			ogImage: '/self-qr.png',
		};
	const res = await fetch('/api/qrcode', {
		method: 'POST',
		body: JSON.stringify({
			text: textParam ?? 'https://generate-qr.codes',
			format: 'png',
			errorCorrectionParam: 'M',
		}),
	});
	const json = await res.json();

	return {
		ogImage: json.data as string,
	};
};
