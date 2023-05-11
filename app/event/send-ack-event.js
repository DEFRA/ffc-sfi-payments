const { raiseEvent } = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')
const { SOURCE } = require('../constants/source')
const { PAYMENT_ACKNOWLEDGED } = require('../constants/events')

const sendAckEvent = async (message) => {
  if (processingConfig.useV1Events) {
    await sendV1AckEvent(message)
  }
  if (processingConfig.useV2Events) {
    await sendV2AckEvent(message.invoiceNumber, message.frn)
  }
}

const sendV1AckEvent = async (message) => {
  const event = {
    id: message?.correlationId ?? uuidv4(),
    name: 'payment-request-acknowledged',
    type: 'info',
    message: 'Payment request acknowledged by DAX',
    data: message
  }
  await raiseEvent(event)
}

const sendV2AckEvent = async (invoiceNumber, frn) => {
  const paymentRequest = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)
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
