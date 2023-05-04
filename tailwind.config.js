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
				varta: 'Varta',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
