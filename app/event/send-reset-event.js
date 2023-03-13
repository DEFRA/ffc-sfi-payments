const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { PAYMENT_RESET } = require('../constants/events')
const { SOURCE } = require('../constants/source')

const sendResetEvent = async (paymentRequest) => {
  if (config.useV2Events) {
    await sendV2ResetEvent(paymentRequest)
  }
}

const sendV2ResetEvent = async (paymentRequest) => {
  const event = {
    source: SOURCE,
    type: PAYMENT_RESET,
    data: paymentRequest
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendResetEvent
