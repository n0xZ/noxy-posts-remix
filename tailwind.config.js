/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.tsx',
		'./app/routes/**/*.tsx',
		'./app/components/**/*.tsx',
	],
	theme: {
		extend: {
			fontFamily: {
				sarabun: 'Sarabun',
				radioCanada: 'Radio Canada',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
