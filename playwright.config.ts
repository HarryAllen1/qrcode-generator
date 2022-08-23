import { devices, type PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173,
	},
	fullyParallel: true,
	projects: [
		//--begin-chromium
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
		//--end-chromium

		//--begin-firefox
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
			},
		},
		//--end-firefox

		//--begin-webkit
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
			},
		},
		//--end-webkit
	],
};

export default config;
