/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{tsx,ts,js,jsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: '"Work Sans", sans-serif',
			},
			colors: {
				surface: '#1d1f21',
				accent: '#2e3033',
				divider: '#4b4d4f',
			},
		},
	},
	plugins: [],
}
