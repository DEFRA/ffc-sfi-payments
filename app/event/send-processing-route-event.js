const raiseEvent = require('./raise-event')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_PAUSED_PREFIX } = require('../constants/events')

const sendProcessingRouteEvent = async (paymentRequest, routeLocation, routeType) => {
  if (config.useV1Events) {
    await sendV1ProcessingRouteEvent(paymentRequest, routeLocation, routeType)
  }
  if (config.useV2Events) {
    await sendV2ProcessingRouteEvent(paymentRequest, routeLocation, routeType)
  }
}

const sendV1ProcessingRouteEvent = async (paymentRequest, routeLocation, routeType) => {
  const direction = routeType === 'request' ? 'to' : 'from'
  const event = {
    id: paymentRequest.correlationId,
    name: `payment-request-${routeLocation}-${routeType}`,
    type: 'info',
    message: `Payment request routed ${direction} request editor`,
    data: paymentRequest
  }
  await raiseEvent(event)
}

const sendV2ProcessingRouteEvent = async (paymentRequest, routeLocation, routeType) => {
  if (routeType === 'request') {
    const event = {
      source: SOURCE,
      type: `${PAYMENT_PAUSED_PREFIX}.${getEventTypeName(routeLocation, routeType)}`,
      data: paymentRequest
    }
    const eventPublisher = new EventPublisher(config.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

const getEventTypeName = (routeLocation, routeType) => {
  if (routeLocation === 'debt') {
    return 'debt'
  }
  if (routeLocation === 'manual-ledger') {
    return 'ledger'
  }
}

module.exports = sendProcessingRouteEvent
