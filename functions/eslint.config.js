// eslint.config.js
import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  {
    // Ці файли охоплюються загальним конфігом
    files: ["**/*.{js,ts}"],

    // Підключаємо base конфіг з ESLint
    extends: [
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "google",
      "plugin:@typescript-eslint/recommended",
    ],

    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
      },
      // Налаштування глобалів (env → globals) маємо робити вручну
      globals: {
        // наприклад, process, console і т.д.
        process: "readonly",
        console: "readonly",
        // інші node глобали можна під’єднати з пакету globals
      },
    },

    ignores: [
      "lib/**/*",
      "generated/**/*",
    ],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: require("eslint-plugin-import"),
    },

    rules: {
      quotes: ["error", "double"],
      "import/no-unresolved": "off",
      indent: ["error", 2],
    },
  },
]);
