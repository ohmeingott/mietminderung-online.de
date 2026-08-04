import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message:
            "Rohe Tailwind-Palette. Nutze die Design-Tokens: brand-* ink-* paper* signal-* caution-* alert-*.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] TemplateElement[value.raw=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message:
            "Rohe Tailwind-Palette im Template-Literal. Nutze die Design-Tokens.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bbg-white(?![\\w/-])/]",
          message:
            "bg-white als Flaeche -> bg-paper-raised (identische Farbe). Alpha wie bg-white/10 ist erlaubt.",
        },
        {
          selector:
            "VariableDeclarator[id.name=/class/i] Literal[value=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message: "Rohe Tailwind-Palette in Klassen-Konstante. Nutze die Design-Tokens.",
        },
        {
          selector:
            "VariableDeclarator[id.name=/class/i] TemplateElement[value.raw=/\\b(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b/]",
          message: "Rohe Tailwind-Palette in Klassen-Konstante. Nutze die Design-Tokens.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
