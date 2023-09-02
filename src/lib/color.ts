import { error } from '@sveltejs/kit';

/**
 * Converts a color into hex format or throws an endpoint error if the color is invalid
 *
 * @param color a color in hex or decimal format
 * @return a color in hex format
 */
export const validateColor = (color: string | number): `#${string}` => {
	color = color.toString();
	if (!color.startsWith('#')) {
		const parsedNumber = parseInt(color, 16);
		if (isNaN(parsedNumber) || parsedNumber > 0xffffffff || parsedNumber < 0)
			throw error(400, { message: `Invalid color "${color}"` });
		color = `#${color}`;
	} else {
		const parsedNumber = parseInt(color.slice(1), 16);
		if (isNaN(parsedNumber) || parsedNumber > 0xffffffff || parsedNumber < 0)
			throw error(400, { message: `Invalid color "${color}"` });
	}

	return color as `#${string}`;
};
