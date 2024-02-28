require('./insights').setup()
require('log-timestamp')
const { start: startMessaging, stop: stopMessaging } = require('./messaging')
const { start: startProcessing } = require('./processing')
const { start: startServer } = require('./server')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await stopMessaging()
  process.exit(0)
})

module.exports = (async () => {
  await startServer()
  await startMessaging()
  await startProcessing()
})()
