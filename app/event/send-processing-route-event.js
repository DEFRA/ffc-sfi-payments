const raiseEvent = require('./raise-event')

const sendProcessingRouteEvent = async (paymentRequest, routeLocation, routeType) => {
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

module.exports = sendProcessingRouteEvent
