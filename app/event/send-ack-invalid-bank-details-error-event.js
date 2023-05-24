const { raiseEvent } = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_INVALID_BANK } = require('../constants/events')

const sendAckInvalidBankDetailsErrorEvent = async (frn) => {
  if (processingConfig.useV1Events) {
    await sendV1AckInvalidBankDetailsErrorEvent(frn)
  }
  if (processingConfig.useV2Events) {
    await sendV2AckInvalidBankDetailsErrorEvent(frn)
  }
}

const sendV1AckInvalidBankDetailsErrorEvent = async (frn) => {
  const event = {
    id: uuidv4(),
    name: 'invalid-bank-details',
    type: 'error',
    message: 'No valid bank details held',
    data: { frn }
  }
  await raiseEvent(event)
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
