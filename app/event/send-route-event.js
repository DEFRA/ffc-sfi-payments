const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_PAUSED_PREFIX } = require('../constants/events')

const sendProcessingRouteEvent = async (paymentRequest, routeLocation, routeType) => {
  if (processingConfig.useV2Events) {
    await sendV2ProcessingRouteEvent(paymentRequest, routeLocation, routeType)
  }
}

const sendV2ProcessingRouteEvent = async (paymentRequest, routeLocation, routeType) => {
  if (routeType === 'request') {
    const event = {
      source: SOURCE,
      type: `${PAYMENT_PAUSED_PREFIX}.${getEventTypeName(routeLocation)}`,
      data: paymentRequest
    }
    const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

const getEventTypeName = (routeLocation) => {
  const eventTypes = {
    debt: 'debt',
    'manual-ledger': 'ledger'
  }

  return eventTypes[routeLocation]
}

module.exports = {
  sendProcessingRouteEvent
}
