const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')
const { SOURCE } = require('../constants/source')
const { PAYMENT_DAX_REJECTED } = require('../constants/events')

const sendAckErrorEvent = async (acknowledgement) => {
  if (config.useV1Events) {
    await sendV1AckErrorEvent(acknowledgement)
  }
  if (config.useV2Events) {
    await sendV2AckErrorEvent(acknowledgement)
  }
}

const sendV1AckErrorEvent = async (acknowledgement) => {
  const event = {
    id: uuidv4(),
    name: 'payment-request-acknowledged-error',
    type: 'error',
    message: 'Payment request acknowledged errored in DAX',
    data: { acknowledgement }
  }
  await raiseEvent(event)
}

const sendV2AckErrorEvent = async (acknowledgement) => {
  const paymentRequest = await getPaymentSchemeByInvoiceAndFrn(acknowledgement.invoiceNumber, acknowledgement.frn)
  const event = {
    source: SOURCE,
    type: PAYMENT_DAX_REJECTED,
    data: {
      message: 'Payment request rejected by DAX',
      ...acknowledgement,
      ...paymentRequest
    }
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendAckErrorEvent
