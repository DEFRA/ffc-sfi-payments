const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { getPaymentRequestByInvoiceAndFrn } = require('../processing/get-payment-request-by-invoice-frn')
const { SOURCE } = require('../constants/source')
const { PAYMENT_SETTLED, PAYMENT_SETTLEMENT_UNMATCHED } = require('../constants/events')

const sendProcessingReturnEvent = async (message, isError = false) => {
  const invoiceNumber = message.invoiceNumber
  const frn = message.frn

  if (!isError) {
    await raiseCompletedReturnEvent(invoiceNumber, frn)
  } else {
    await raiseErrorEvent(frn)
  }
}

const raiseCompletedReturnEvent = async (invoiceNumber, frn) => {
  if (processingConfig.useV2Events) {
    await raiseV2CompletedReturnEvent(invoiceNumber, frn)
  }
}

const raiseErrorEvent = async (frn) => {
  if (processingConfig.useV2Events) {
    await raiseV2ErrorEvent(frn)
  }
}

const raiseV2CompletedReturnEvent = async (invoiceNumber, frn) => {
  const paymentRequest = await getPaymentRequestByInvoiceAndFrn(invoiceNumber, frn)
  const event = {
    source: SOURCE,
    type: PAYMENT_SETTLED,
    data: paymentRequest
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

const raiseV2ErrorEvent = async (frn) => {
  const event = {
    source: SOURCE,
    type: PAYMENT_SETTLEMENT_UNMATCHED,
    data: {
      message: `Unable to find payment request for settlement, FRN: ${frn}`,
      frn
    }
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = {
  sendProcessingReturnEvent
}
