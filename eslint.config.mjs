import { fileURLToPath } from 'node:url'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import tailwind from 'eslint-plugin-tailwindcss'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'

const ignores = [
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
]

const tailwindCssConfigPath = fileURLToPath(new URL('./app/globals.css', import.meta.url))

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  tailwind.configs.recommended,
  {
    settings: {
      tailwindcss: {
        cssConfigPath: tailwindCssConfigPath
      }
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // global ignores of eslint-config-next
    ...ignores
  ]),
  ...neostandard(
    {
      files: ['**/*.{ts,tsx}'],
      ts: true,
      ignores
    }

  ),
  {
    extends: [
      tseslint.configs.recommendedTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },

])

export default eslintConfig
