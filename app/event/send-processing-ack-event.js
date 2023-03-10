const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')
const { SOURCE } = require('../constants/source')
const { PAYMENT_ACKNOWLEDGED } = require('../constants/events')

const sendProcessingAckEvent = async (message) => {
  if (config.useV1Events) {
    await sendV1ProcessingAckEvent(message)
  }
  if (config.useV2Events) {
    await sendV2ProcessingAckEvent(message.invoiceNumber, message.frn)
  }
}

const sendV1ProcessingAckEvent = async (message) => {
  const event = {
    id: message?.correlationId ?? uuidv4(),
    name: 'payment-request-acknowledged',
    type: 'info',
    message: 'Payment request acknowledged by DAX',
    data: message
  }
  await raiseEvent(event)
}

const sendV2ProcessingAckEvent = async (invoiceNumber, frn) => {
  const paymentRequest = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)
  const event = {
    source: SOURCE,
    type: PAYMENT_ACKNOWLEDGED,
    data: paymentRequest
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendProcessingAckEvent
