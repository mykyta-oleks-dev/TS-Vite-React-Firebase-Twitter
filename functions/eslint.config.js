// eslint.config.js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { flatConfigs } from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		files: ['**/*.ts'],

		extends: [
			js.configs.recommended,
			flatConfigs.errors,
			flatConfigs.warnings,
			flatConfigs.typescript,
			// googleConfig,
			tseslint.configs.recommended,
		],

		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ['tsconfig.json'],
				sourceType: 'module',
			},
			globals: {
				process: 'readonly',
				console: 'readonly',
			},
		},

		ignores: ['lib/**/*', 'generated/**/*'],

		rules: {
			'import/no-unresolved': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
]);
