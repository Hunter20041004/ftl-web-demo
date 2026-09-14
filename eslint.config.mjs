import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "public/assets/**",
    "assets/**",
    "public/media/**",
  ]),
  {
    // 用解構把某幾個欄位「拿掉」時，慣例用 _ 開頭命名，不算未使用
    rules: { "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }] },
  },
]);
