const raiseEvents = require('./raise-events')

const sendPublishingEvents = async (paymentRequests) => {
  const events = paymentRequests.map(paymentRequest => ({
    id: paymentRequest.correlationId,
    name: 'payment-request-processing',
    type: 'info',
    message: 'Payment request processed',
    data: paymentRequest
  }))
  await raiseEvents(events)
}

module.exports = sendPublishingEvents
