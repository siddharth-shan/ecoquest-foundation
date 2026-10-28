import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// The calendar tests include DST cases, which only mean something in a zone that has DST.
process.env.TZ = 'America/Los_Angeles'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
})
