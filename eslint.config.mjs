import { defineConfig } from "eslint/config";
import eslintPlugin from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

const globalsConfig = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
  }
]);

const eslintConfig = defineConfig([
  {
    name: 'project/javascript-recommended',
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ...eslintPlugin.configs.recommended,
  },
]);

const prettierConfig = defineConfig([
  {
    name: 'project/prettier',
    ...eslintConfigPrettier,
    ...eslintPluginPrettier,
  },
]);

const ignoresConfig = defineConfig([
  {
    name: 'project/ignores',
    ignores: [
      '.next/',
      'node_modules/',
      'public/',
      '.vscode/',
      'next-env.d.ts',
      'out/',
      'build/',
    ]
  },
]);

const reactConfig = defineConfig([
  {
    name: 'project/react-next',
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...jsxA11yPlugin.configs.strict.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/prop-types": 0,
      "react/jsx-props-no-spreading": 0,
      "react/no-unknown-property": ["error", { "ignore": ["jsx", "global"] }],
      "react-hooks/exhaustive-deps": 0,
      "max-len": [2, { "code": 1200, "ignoreTemplateLiterals": true, "ignoreStrings": true}],
      "camelcase": 0,
      "func-style": [2, "expression", { "allowArrowFunctions": true }],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" }
      ],
      "jsx-a11y/no-autofocus": 0,
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/label-has-associated-control": ["error",{"required": {"some": ["nesting", "id"]}}],
      "jsx-a11y/label-has-for": [ "error", { "required": { "some": ["nesting", "id"]}}]
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
]);


export default defineConfig([
  ...prettierConfig,
  ...ignoresConfig,
  ...reactConfig,
  ...eslintConfig,
  ...globalsConfig,
])