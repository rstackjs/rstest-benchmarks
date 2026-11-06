import { join } from 'node:path'
import { root, write } from './fixtures.mjs'
export function configure(directory, framework, item) {
  const react = ['react', 'minimal-react'].includes(item.id)
  const setup = item.id === 'react'
  const reporters = join(root, 'frameworks/reporters')
  const workerProbe = JSON.stringify(join(reporters, 'worker-probe.cjs'))
  const coverage = `{ enabled: !!process.env.BENCH_COVERAGE, provider: process.env.BENCH_COVERAGE || 'v8', include: ['src/**/*.{ts,tsx}'], exclude: ['src/**/*.d.ts', 'src/features/*/index.ts'], reporter: ['json'], reportsDirectory: './coverage' }`
  if (framework.startsWith('jest')) {
    if (framework === 'jest-babel') {
      write(join(directory, 'babel.config.cjs'), `module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
    '@babel/preset-typescript',
    ${react ? "['@babel/preset-react', { runtime: 'automatic' }]," : ''}
  ],
}
`)
    }
    write(join(directory, 'style.cjs'), `module.exports = { box: 'box' }\n`)
    write(
      join(directory, 'jest.config.cjs'),
      `module.exports = {
      testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
      testEnvironment: ${JSON.stringify(react ? 'jsdom' : 'node')},
      ${framework === 'jest-babel' ? '' : `transform: { '^.+\\\\.[tj]sx?$': ['@swc/jest', { jsc: { target: 'es2022', parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } }, module: { type: 'commonjs' } }] },`}
      moduleNameMapper: { '\\\\.css$': '<rootDir>/style.cjs' },
      setupFilesAfterEnv: ${JSON.stringify(setup ? ['<rootDir>/tests/setup.ts'] : [])},
      cacheDirectory: '<rootDir>/.cache/jest',
      setupFiles: [${workerProbe}],
      reporters: [${JSON.stringify(join(reporters, 'jest.cjs'))}],
      collectCoverage: !!process.env.BENCH_COVERAGE,
      coverageProvider: process.env.BENCH_COVERAGE === 'istanbul' ? 'babel' : 'v8',
      collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/features/*/index.ts'], coverageReporters: ['json'], coverageDirectory: '<rootDir>/coverage',
    }\n`,
    )
  } else if (framework.startsWith('vitest')) {
    write(
      join(directory, 'vitest.config.mjs'),
      `import { defineConfig } from 'vitest/config'
const browserProvider = process.env.BENCH_BROWSER ? (await import('@vitest/browser-playwright')).playwright() : undefined
import Reporter from ${JSON.stringify(join(reporters, 'vitest.mjs'))}
export default defineConfig({
  cacheDir: './.cache/vite',
  oxc: { jsx: { runtime: 'automatic' } },
  test: { ${framework === 'vitest-vmForks' ? "pool: 'vmForks'," : ''}fsModuleCachePath: process.cwd() + '/.cache/vitest-modules', include: ['tests/**/*.test.{ts,tsx}'], environment: ${JSON.stringify(react ? 'jsdom' : 'node')},
    setupFiles: [...(process.env.BENCH_BROWSER ? [] : [${workerProbe}]), ...${JSON.stringify(setup ? ['./tests/setup.ts'] : [])}], reporters: [new Reporter()],
    coverage: ${coverage},
    ...(process.env.BENCH_BROWSER ? { browser: { enabled: true, headless: true, provider: browserProvider, instances: [{ browser: 'chromium' }] } } : {}),
  },
})\n`,
    )
  } else {
    write(
      join(directory, 'rstest.config.mjs'),
      `import { defineConfig } from '@rstest/core'
${react ? "import { pluginReact } from '@rsbuild/plugin-react'" : ''}
import Reporter from ${JSON.stringify(join(reporters, 'rstest.mjs'))}
export default defineConfig({ include: ['tests/**/*.test.{ts,tsx}'], testEnvironment: ${JSON.stringify(react ? 'jsdom' : 'node')},
  setupFiles: [...(process.env.BENCH_BROWSER ? [] : [${workerProbe}]), ...${JSON.stringify(setup ? ['./tests/setup.ts'] : [])}], reporters: [new Reporter()],
  plugins: ${react ? '[pluginReact()]' : '[]'},
  ${framework === 'rstest-vmForks' ? "pool: 'vmForks'," : ''}
  ${framework === 'rstest-vmThreads' ? "pool: 'vmThreads'," : ''}
  coverage: { enabled: !!process.env.BENCH_COVERAGE, provider: process.env.BENCH_COVERAGE || 'v8', include: ['src/**/*.{ts,tsx}'], exclude: ['src/**/*.d.ts', 'src/features/*/index.ts'], reporters: ['json'], reportsDirectory: './coverage' },
  ...(process.env.BENCH_BROWSER ? { browser: { enabled: true, provider: 'playwright', browser: 'chromium', headless: true } } : {}),
})\n`,
    )
  }
}
