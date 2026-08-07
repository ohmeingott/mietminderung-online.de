import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const RAW_PALETTE =
  "gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const rawColorLiteral = (path) =>
  `${path} Literal[value=/\\b(?:${RAW_PALETTE})-\\d{2,3}\\b/]`;
const rawColorTemplate = (path) =>
  `${path} TemplateElement[value.raw=/\\b(?:${RAW_PALETTE})-\\d{2,3}\\b/]`;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: rawColorLiteral("JSXAttribute[name.name='className']"),
          message:
            "Rohe Tailwind-Palette. Nutze die Design-Tokens: brand-* ink-* paper* signal-* caution-* alert-*.",
        },
        {
          selector: rawColorTemplate("JSXAttribute[name.name='className']"),
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
          selector: rawColorLiteral("VariableDeclarator[id.name=/class/i]"),
          message: "Rohe Tailwind-Palette in Klassen-Konstante. Nutze die Design-Tokens.",
        },
        {
          selector: rawColorTemplate("VariableDeclarator[id.name=/class/i]"),
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
    /*
     * Working copies of this repository that Claude Code creates under
     * .claude/worktrees.
     *
     * Without this line ESLint descends into every copy and checks the same
     * project several times over — including their .next directories, which
     * the ignores above do not catch because those patterns are relative to
     * the root. Measured in the sibling project: 14,013 messages, none of them
     * outside .claude.
     *
     * The cost is not the runtime. It is that `npm run lint` stops being
     * usable locally, and the rule against raw Tailwind palettes above is the
     * only thing holding the design system together — nobody spots it in
     * fourteen thousand lines of noise. CI never showed this, because a fresh
     * checkout has no worktrees.
     */
    ".claude/**",
  ]),
]);

export default eslintConfig;
