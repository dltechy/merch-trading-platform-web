/** @type {import('tailwindcss').Config} */
const tailwindCssForms = require('@tailwindcss/forms');
const colors = require('tailwindcss/colors');
const tailwindCssThemer = require('tailwindcss-themer');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [
    tailwindCssForms,
    tailwindCssThemer({
      defaultTheme: {
        extend: {
          colors: {
            'dark-overlay': colors.black,
            'disabled-secondary': colors.gray['500'],
            divider: colors.cyan['400'],

            'button-primary': colors.blue['500'],
            'button-secondary': colors.white,
            'button-hovered-primary': colors.blue['600'],
            'button-hovered-secondary': colors.white,
            'button-disabled-primary': colors.gray['200'],
            'button-disabled-secondary': colors.gray['400'],
            'button-cancel-primary': colors.gray['200'],
            'button-cancel-secondary': colors.black,
            'button-cancel-hovered-primary': colors.gray['300'],
            'button-cancel-hovered-secondary': colors.black,

            'header-primary': colors.blue['600'],
            'header-secondary': colors.white,
            'header-button-primary': colors.white,
            'header-button-secondary': colors.black,
            'header-button-hovered-primary': colors.gray['200'],
            'header-button-hovered-secondary': colors.black,

            link: colors.blue['600'],
            'link-hovered': colors.blue['800'],
            'link-visited': colors.purple['600'],

            'negative-primary': colors.red['500'],
            'negative-secondary': colors.white,
            'negative-hovered-primary': colors.red['600'],
            'negative-hovered-secondary': colors.white,

            'sidebar-toggle-secondary': colors.white,
            'sidebar-toggle-hovered-primary': colors.blue['400'],
            'sidebar-toggle-hovered-secondary': colors.black,

            'tab-secondary': colors.white,
            'tab-hovered-primary': colors.cyan['600'],
            'tab-hovered-secondary': colors.black,
            'tab-selected-primary': colors.cyan['400'],
            'tab-selected-secondary': colors.black,

            'toast-secondary': colors.black,
            'toast-info-primary': colors.blue['300'],
            'toast-info-border': colors.blue['500'],
            'toast-error-primary': colors.red['300'],
            'toast-error-border': colors.red['500'],
            'toast-close-button-primary': colors.white,
            'toast-close-button-hovered-primary': colors.gray['200'],
          },
        },
      },
      themes: [
        {
          name: 'theme-dark',
          mediaQuery: '@media (prefers-color-scheme: dark)',
          extend: {
            colors: {
              primary: '#242424',
              secondary: colors.white,

              'card-primary': colors.blue['400'],
              'card-secondary': colors.black,
              'card-hovered-primary': colors.blue['200'],
              'card-hovered-secondary': colors.black,

              'icon-button-primary': colors.blue['200'],

              'input-disabled-primary': colors.gray['800'],
              'input-disabled-secondary': colors.white,

              'table-row-even-primary': colors.blue['300'],
              'table-row-even-secondary': colors.black,
              'table-row-odd-primary': colors.blue['400'],
              'table-row-odd-secondary': colors.black,
              'table-row-hovered-primary': colors.blue['200'],
              'table-row-hovered-secondary': colors.black,
            },
          },
        },
        {
          name: 'theme-light',
          mediaQuery: '@media (prefers-color-scheme: light)',
          extend: {
            colors: {
              primary: colors.white,
              secondary: colors.black,

              'card-primary': colors.blue['100'],
              'card-secondary': colors.black,
              'card-hovered-primary': colors.blue['400'],
              'card-hovered-secondary': colors.black,

              'icon-button-primary': colors.blue['400'],

              'input-disabled-primary': colors.gray['200'],
              'input-disabled-secondary': colors.black,

              'table-row-even-primary': colors.blue['100'],
              'table-row-even-secondary': colors.black,
              'table-row-odd-primary': colors.blue['200'],
              'table-row-odd-secondary': colors.black,
              'table-row-hovered-primary': colors.blue['400'],
              'table-row-hovered-secondary': colors.black,
            },
          },
        },
      ],
    }),
  ],
};
