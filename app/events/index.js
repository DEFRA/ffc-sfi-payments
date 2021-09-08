const { EventSender } = require('ffc-events')
const config = require('../config').eventConfig
const createEvent = require('./create-event')
let sender

const sendEvent = async (body, type) => {
  try {
    const event = createEvent(body, type)
    sender = new EventSender(config)
    await sender.connect()
    await sender.sendEvents([event])
  } catch (err) {
    console.error('Unable to send payment event', err)
  } finally {
    await sender.closeConnection()
  }
}

module.exports = sendEvent
