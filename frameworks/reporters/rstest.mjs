import { writeFileSync } from 'node:fs'
export default class {
  onTestRunEnd({ summary, unhandledErrors, testResults, duration }) {
    writeFileSync(
      process.env.FRAMEWORK_REPORT,
      JSON.stringify({
        duration,
        files: summary.files.total,
        tests: summary.tests.total,
        passed: summary.tests.passed,
        failed: summary.tests.failed,
        skipped: summary.tests.skipped + summary.tests.todo,
        errors: unhandledErrors.length + summary.files.failed,
        failures: [
          ...unhandledErrors,
          ...testResults.filter((r) => r.status === 'fail'),
        ],
      }),
    )
  }
}
