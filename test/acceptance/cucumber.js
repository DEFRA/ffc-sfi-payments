
module.exports = {
  default: {
    publishQuiet: true,
    snippetInterface: 'async-await',
    paths: ['test/acceptance/features/**/*.feature'],
    backtrace: true,
    require: ['test/acceptance/step-definitions/**/*.js'],
    parallel: 1,
    format: ['html:test-output/cucumber-report.html']
  }
}
