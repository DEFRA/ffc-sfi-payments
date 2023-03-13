const raiseEvents = require('./raise-events')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_PROCESSED } = require('../constants/events')

const sendPublishingEvents = async (paymentRequests) => {
  if (config.useV1Events) {
    await sendV1PublishingEvents(paymentRequests)
  }
  if (config.useV2Events) {
    await sendV2PublishingEvents(paymentRequests)
  }
}

const sendV1PublishingEvents = async (paymentRequests) => {
  const events = paymentRequests.map(paymentRequest => ({
    id: paymentRequest.correlationId,
    name: 'payment-request-processing',
    type: 'info',
    message: 'Payment request processed',
    data: paymentRequest
  }))
  await raiseEvents(events)
}

const sendV2PublishingEvents = async (paymentRequests) => {
  const events = paymentRequests.map(createEvent)
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvents(events)
}

const createEvent = (paymentRequest) => {
  return {
    source: SOURCE,
    type: PAYMENT_PROCESSED,
    data: paymentRequest
  }
}

module.exports = sendPublishingEvents
