import { defineConfig } from '@rstest/core'
import { benchTest } from '../../tools/config/rstest-config.js'

export default defineConfig(benchTest({
  testEnvironment: 'node',
}))
