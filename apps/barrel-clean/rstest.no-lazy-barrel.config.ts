import { defineConfig } from '@rstest/core'
import { benchTest } from '../../tools/config/rstest-config.js'

export default defineConfig({
  ...benchTest({
    testEnvironment: 'node',
  }),
  tools: {
    rspack: config => {
      config.module ??= {}
      config.module.rules ??= []
      config.module.rules.push({
        test: /\.[cm]?[jt]sx?$/,
        sideEffects: true,
      })
    },
  },
})
