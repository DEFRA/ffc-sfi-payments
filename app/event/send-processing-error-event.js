const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendProcessingErrorEvent = async (paymentRequest, error) => {
  if (config.useV1Events) {
    await sendV1ProcessingErrorEvent(paymentRequest, error)
  }
  if (config.useV2Events) {
    await sendV2ProcessingErrorEvent(paymentRequest, error)
  }
}

const sendV1ProcessingErrorEvent = async (paymentRequest, error) => {
  const correlationId = paymentRequest?.correlationId ?? uuidv4()
  const event = {
    id: correlationId,
    name: 'payment-request-processing-error',
    type: 'error',
    message: error.message,
    data: { paymentRequest }
  }
  await raiseEvent(event, 'error', error)
}

const sendV2ProcessingErrorEvent = async (paymentRequest, error) => {
  const event = {
    source: 'ffc-pay-processing',
    type: 'uk.gov.defra.ffc.pay.warning.processing.failed',
    data: {
      message: error.message,
      paymentRequest
    }
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendProcessingErrorEvent
