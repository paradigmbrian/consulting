import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Fires in 52 files of marketing and demo copy ("you're", "it's").
      // Escaping would churn every page of copy for no rendering difference.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // The scripted demos drive staged reveals with setState-in-effect timers.
    // This migration is at parity: demo internals are not refactored here.
    files: ["src/demos/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "public/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
