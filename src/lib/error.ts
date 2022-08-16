export const error = (status: number, message?: string) => {
	const headers = new Headers();
	if (!headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}

	return new Response(JSON.stringify({ message, status }), {
		headers,
		status,
	});
};
