import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "src/__test__", "src/main.tsx"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
      "prefer-arrow-callback": [
        "error",
        {
          allowNamedFunctions: true,
        },
      ],
      "react/jsx-one-expression-per-line": "off",
      indent: ["error", 2],
      "react/prop-types": "off",
    },
  }
);
