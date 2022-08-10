export const downloadURI = (uri: string, name: string): void => {
	const link = document.createElement('a');
	link.download = name;
	link.href = uri;
	link.click();
};
