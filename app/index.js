require('./insights').setup()
const messageService = require('./messaging')
const paymentProcessing = require('./processing')

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
  await paymentProcessing.start()
}())
