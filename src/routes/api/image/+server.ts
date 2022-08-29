import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { imageDataURL }: Record<string, string> = await request.json();
	// const data = await request.json();
	// const image = data.image;
	// const imageBorderRadius = data.imageBorderRadius;

	return new Response(undefined);
};
