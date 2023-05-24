const { raiseEvent } = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_PROCESSING_FAILED } = require('../constants/events')

const sendProcessingErrorEvent = async (paymentRequest, error) => {
  if (processingConfig.useV1Events) {
    await sendV1ProcessingErrorEvent(paymentRequest, error)
  }
  if (processingConfig.useV2Events) {
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
    source: SOURCE,
    type: PAYMENT_PROCESSING_FAILED,
    data: {
      message: error.message,
      ...paymentRequest
    }
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = {
  sendProcessingErrorEvent
}
