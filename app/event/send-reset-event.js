const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendResetEvent = async (paymentRequest) => {
  if (config.useV2Events) {
    await sendV2ResetEvent(paymentRequest)
  }
}

const sendV2ResetEvent = async (paymentRequest) => {
  const event = {
    source: 'ffc-pay-processing',
    type: 'uk.gov.defra.ffc.pay.payment.reset',
    data: paymentRequest
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendResetEvent
