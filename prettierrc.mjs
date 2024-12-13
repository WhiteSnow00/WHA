/** @type {import("prettier").Config} */
const config = {
  endOfLine: 'auto',
  singleQuote: true,
  printWidth: 90,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  overrides: [
    {
      files: ['tsconfig.json'],
      options: {
        trailingComma: 'none',
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        semi: false,
        singleQuote: false,
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      options: {
        jsxSingleQuote: false,
        jsxBracketSameLine: false,
      },
    },
  ],
};

export default {
  ...config,
  plugins: ['prettier-plugin-astro'],
};