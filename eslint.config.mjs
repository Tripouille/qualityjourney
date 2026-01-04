import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import unicorn from "eslint-plugin-unicorn";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  // ===================================
  // BASE CONFIGS
  // ===================================
  ...nextVitals,
  ...nextTs,

  // ===================================
  // GLOBAL IGNORES
  // ===================================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
    "*.config.{js,mjs,cjs,ts}",
    "pnpm-lock.yaml",
  ]),

  // ===================================
  // TYPESCRIPT PARSER CONFIGURATION
  // ===================================
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },
  },

  // ===================================
  // STATE-OF-THE-ART RULES
  // ===================================
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "@typescript-eslint": tseslint,
      unicorn,
      security,
      sonarjs,
    },
    rules: {
      // ===================================
      // TYPESCRIPT STRICTEST
      // ===================================
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true, // Allow nullable objects in conditionals (if (obj) pattern)
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],

      // ===================================
      // UNICORN (CLEAN CODE)
      // ===================================
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: [
            "^CLAUDE\\.md$",
            "^README\\.md$",
            "^CONTRIBUTING\\.md$",
          ],
        },
      ],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          replacements: {
            props: false,
            ref: false,
            params: false,
            args: false,
            env: false,
            fn: false,
            db: false,
            ctx: false,
            req: false,
            res: false,
          },
        },
      ],
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-module": "error",
      "unicorn/no-array-reduce": "warn",
      "unicorn/no-null": "off", // We use null for domain entities
      "unicorn/prefer-top-level-await": "off", // Not always applicable
      "unicorn/no-useless-undefined": "off",
      "unicorn/consistent-function-scoping": "warn",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-ternary": "warn",
      "unicorn/throw-new-error": "error",

      // ===================================
      // SECURITY (OWASP)
      // ===================================
      "security/detect-object-injection": "off", // Too many false positives
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "error",

      // ===================================
      // SONARJS (CODE SMELLS)
      // ===================================
      "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/prefer-single-boolean-return": "warn",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-useless-catch": "error",

      // ===================================
      // GENERAL BEST PRACTICES
      // ===================================
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "curly": ["error", "all"],
      "no-else-return": "warn",
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-body-style": ["warn", "as-needed"],
    },
  },

  // ===================================
  // ARCHITECTURE ENFORCEMENT
  // ===================================
  {
    files: ["src/domain/**/*.ts", "src/domain/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/**", "@/infrastructure/**"],
              message:
                "🚫 ARCHITECTURE VIOLATION: Domain layer MUST NOT import from infrastructure layer. Domain must remain pure.",
            },
            {
              group: ["**/features/**", "@/features/**"],
              message:
                "🚫 ARCHITECTURE VIOLATION: Domain layer MUST NOT import from features layer. Domain must remain framework-agnostic.",
            },
            {
              group: ["**/app/**", "@/app/**"],
              message:
                "🚫 ARCHITECTURE VIOLATION: Domain layer MUST NOT import from app layer. Domain must remain UI-agnostic.",
            },
            {
              group: ["**/components/**", "@/components/**"],
              message:
                "🚫 ARCHITECTURE VIOLATION: Domain layer MUST NOT import UI components. Domain must remain pure business logic.",
            },
            {
              group: ["react", "react-dom", "next", "next/*"],
              message:
                "🚫 ARCHITECTURE VIOLATION: Domain layer MUST NOT import React/Next.js. Domain must remain framework-agnostic.",
            },
          ],
        },
      ],
    },
  },

  // ===================================
  // RELAXED RULES FOR CONFIGS & TESTS
  // ===================================
  {
    files: ["*.config.{js,mjs,cjs,ts}", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "unicorn/prefer-module": "off",
      "no-console": "off",
    },
  },

  // ===================================
  // RELAXED RULES FOR REACT COMPONENTS
  // ===================================
  {
    files: ["src/app/**/*.tsx", "src/features/**/*.tsx", "src/components/**/*.tsx"],
    rules: {
      // React components often have implicit return types
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Server components can't use client-side features
      "unicorn/prefer-node-protocol": "off",
    },
  },
]);

export default eslintConfig;
