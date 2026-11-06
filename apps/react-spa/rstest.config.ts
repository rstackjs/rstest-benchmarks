import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rstest/core'
import { benchBrowser, benchTest } from '../../tools/config/rstest-config.js'

export default defineConfig({
  ...benchTest({
    testEnvironment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  }),
  ...benchBrowser(),
  plugins: [pluginReact()],
})
