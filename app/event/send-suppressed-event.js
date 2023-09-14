const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_SUPPRESSED } = require('../constants/events')
const { AP } = require('../constants/ledgers')
const { UNKNOWN } = require('../constants/unknown')

const sendSuppressedEvent = async (paymentRequest, sanitizedPaymentRequests) => {
  if (processingConfig.useV2Events) {
    await sendV2SuppressedEvent(paymentRequest, sanitizedPaymentRequests)
  }
}

const sendV2SuppressedEvent = async (paymentRequest, sanitizedPaymentRequests) => {
  const deltaValue = sanitizedPaymentRequests.deltaPaymentRequest.value
  let creditAP = 0
  let suppressedAR = 0
  for (const request of sanitizedPaymentRequests.completedPaymentRequests) {
    if (request.ledger === AP) {
      creditAP += request.value
    } else {
      suppressedAR += request.value
    }
  }
  const event = {
    source: SOURCE,
    type: PAYMENT_SUPPRESSED,
    data:  {
      ...paymentRequest,
      deltaValue,
      creditAP,
      suppressedAR
    }
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = {
  sendSuppressedEvent
}
