export const classNames = (...classes: (string | false | null | undefined)[]) =>
	classes.filter(Boolean).join(' ');
