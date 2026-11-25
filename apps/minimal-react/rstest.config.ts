import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rstest/core'
import { benchTest } from '../../tools/config/rstest-config.js'

export default defineConfig({
  ...benchTest({
    testEnvironment: 'jsdom',
  }),
  plugins: [pluginReact()],
})
