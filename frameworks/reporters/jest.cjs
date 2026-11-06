const { writeFileSync } = require('node:fs')
module.exports = class {
  constructor(config) {
    this.settings = {
      maxWorkers: config.maxWorkers,
      workerThreads: config.workerThreads,
    }
  }
  onRunComplete(_, result) {
    writeFileSync(
      process.env.FRAMEWORK_REPORT,
      JSON.stringify({
        files: result.numTotalTestSuites,
        tests: result.numTotalTests,
        passed: result.numPassedTests,
        failed: result.numFailedTests,
        skipped: result.numPendingTests + result.numTodoTests,
        errors: result.numRuntimeErrorTestSuites,
        settings: this.settings,
        failures: result.testResults
          .filter((r) => r.failureMessage)
          .map((r) => r.failureMessage),
      }),
    )
  }
}
