require('./insights').setup()
const messageService = require('./messaging')
const processing = require('./processing')

process.on('SIGTERM', async () => {
  await messageService.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await messageService.start()
  await processing.start()
}())
