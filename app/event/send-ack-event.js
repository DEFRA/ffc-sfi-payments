const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { getPaymentRequestByInvoiceAndFrn } = require('../processing/get-payment-request-by-invoice-frn')
const { SOURCE } = require('../constants/source')
const { PAYMENT_ACKNOWLEDGED } = require('../constants/events')

const sendAckEvent = async (message) => {
  if (processingConfig.useV2Events) {
    await sendV2AckEvent(message.invoiceNumber, message.frn)
  }
}

const sendV2AckEvent = async (invoiceNumber, frn) => {
  const paymentRequest = await getPaymentRequestByInvoiceAndFrn(invoiceNumber, frn)
  const event = {
    source: SOURCE,
    type: PAYMENT_ACKNOWLEDGED,
    data: paymentRequest
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = {
  sendAckEvent
}
