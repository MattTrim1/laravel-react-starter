import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { ignores: ['bootstrap/ssr', 'node_modules', 'public', 'storage', 'vendor'] },
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'],
        languageOptions: {
            ...react.configs.flat.recommended.languageOptions,
            globals: globals.browser,
        },
        settings: { react: { version: 'detect' } },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,
            'react/prop-types': 'off',
        },
    },
    reactHooks.configs['recommended-latest'],
    {
        files: ['*.config.js'],
        languageOptions: { globals: globals.node },
    },
    prettier,
];
