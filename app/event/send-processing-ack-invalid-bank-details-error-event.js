const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendProcessingAckInvalidBankDetailsErrorEvent = async (frn) => {
  if (config.useV1Events) {
    await sendV1ProcessingAckInvalidBankDetailsErrorEvent(frn)
  }
  if (config.useV2Events) {
    await sendV2ProcessingAckInvalidBankDetailsErrorEvent(frn)
  }
}

const sendV1ProcessingAckInvalidBankDetailsErrorEvent = async (frn) => {
  const event = {
    id: uuidv4(),
    name: 'invalid-bank-details',
    type: 'error',
    message: 'No valid bank details held',
    data: { frn }
  }
  await raiseEvent(event)
}

const sendV2ProcessingAckInvalidBankDetailsErrorEvent = async (frn) => {
  const event = {
    source: 'ffc-pay-processing',
    type: 'uk.gov.defra.ffc.pay.warning.bank.missing',
    data: {
      frn
    }
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendProcessingAckInvalidBankDetailsErrorEvent
