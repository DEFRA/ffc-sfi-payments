require('./insights').setup()
const messaging = require('./messaging')
const processing = require('./processing')
const createServer = require('./server')

const init = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('SIGTERM', async () => {
  await messaging.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messaging.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await messaging.start()
  await processing.start()
  await init()
}())
