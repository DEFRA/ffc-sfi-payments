const raiseEvent = require('./raise-event')

const sendPublishingEvents = async (paymentRequests) => {
  for (const paymentRequest of paymentRequests) {
    const event = {
      id: paymentRequest.correlationId,
      name: 'payment-request-processing',
      type: 'info',
      message: 'Payment request processing',
      data: paymentRequest
    }
    await raiseEvent(event)
  }
}

module.exports = sendPublishingEvents
