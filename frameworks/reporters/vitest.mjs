import { writeFileSync } from 'node:fs'
export default class {
  onInit(ctx) {
    this.settings = {
      pool: ctx.config.pool,
      maxWorkers: ctx.config.maxWorkers,
      isolate: ctx.config.isolate,
      fsModuleCache: ctx.config.fsModuleCache,
      fsModuleCachePath: ctx.config.fsModuleCachePath,
    }
  }
  onTestRunEnd(modules, errors) {
    const tests = modules.flatMap((m) => [...m.children.allTests()])
    const passed = modules.reduce(
      (n, m) => n + [...m.children.allTests('passed')].length,
      0,
    )
    const failed = modules.reduce(
      (n, m) => n + [...m.children.allTests('failed')].length,
      0,
    )
    const failures = [...errors, ...modules.flatMap((m) => m.errors())]
    writeFileSync(
      process.env.FRAMEWORK_REPORT,
      JSON.stringify({
        files: modules.length,
        tests: tests.length,
        passed,
        failed,
        skipped: tests.length - passed - failed,
        errors: failures.length,
        failures,
        settings: this.settings,
      }),
    )
  }
}
