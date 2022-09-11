import {
	devices,
	type PlaywrightTestConfig,
	type PlaywrightTestOptions,
	type PlaywrightWorkerOptions,
	type Project,
} from '@playwright/test';

const projects: Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] = [];

const devicesToTest = [
	devices['Desktop Chrome'],
	devices['Desktop Firefox'],
	devices['Desktop Safari'],
	devices['Desktop Edge'],
	devices['iPhone 11'],
	devices['iPhone 11 landscape'],
	devices['Pixel 4'],
	devices['Pixel 4 landscape'],
];

devicesToTest.forEach((v) => {
	projects.push({
		name: Object.keys(devices).find((k) => devices[k] === v),
		use: {
			...v,
		},
	});
});

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173,
	},
	fullyParallel: true,
	projects,
};
export default config;
