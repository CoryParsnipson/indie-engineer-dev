const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
    letterSpacing: {
      markdown: '0.015rem',
      ...defaultTheme.letterSpacing,
    },
		extend: {
      fontFamily: {
        'title': ['"Oswald"', ...defaultTheme.fontFamily.sans],
      },
    }
	},

	plugins: [forms, typography]
};

module.exports = config;
