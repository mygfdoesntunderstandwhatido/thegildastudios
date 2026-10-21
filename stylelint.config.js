/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-html/astro'],
  ignoreFiles: ['dist/**', 'design/**'],
  rules: { 'color-no-hex': [true, { severity: 'warning' }] },
  overrides: [
    {
      // #6 specifies BEM foundation classes such as band--brine and band__mark.
      files: ['src/styles/base.css'],
      rules: {
        'selector-class-pattern':
          '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:(?:__|--)[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      },
    },
    {
      // Preserve the design source notation and grouping in copied tokens.
      files: ['src/styles/tokens/*.css'],
      rules: {
        'color-no-hex': null,
        'color-function-alias-notation': null,
        'color-function-notation': null,
        'alpha-value-notation': null,
        'value-keyword-case': null,
        'custom-property-empty-line-before': null,
        'comment-empty-line-before': null,
      },
    },
  ],
};
