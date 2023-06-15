const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_INVALID_BANK } = require('../constants/events')

const sendAckInvalidBankDetailsErrorEvent = async (frn) => {
  if (processingConfig.useV2Events) {
    await sendV2AckInvalidBankDetailsErrorEvent(frn)
  }
}

const sendV2AckInvalidBankDetailsErrorEvent = async (frn) => {
  const event = {
    source: SOURCE,
    type: PAYMENT_INVALID_BANK,
    data: {
      message: 'No valid bank details held',
      frn
    }
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = {
  sendAckInvalidBankDetailsErrorEvent
}
