
module.exports = {
  default: {
    publishQuiet: true,
    snippetInterface: 'async-await',
    paths: ['test/acceptance/features/**/*.feature'],
    backtrace: true,
    tags: '@complete',
    require: ['test/acceptance/step_definitions/**/*.js'],
    parallel: 1,
    format: ['html:test/acceptance/test-output/cucumber-report.html']
  }
}
