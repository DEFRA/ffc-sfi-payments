const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')
const { processingConfig, messageConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_SETTLED, PAYMENT_SETTLEMENT_UNMATCHED } = require('../constants/events')

const sendProcessingReturnEvent = async (message, isError = false) => {
  const invoiceNumber = message.invoiceNumber
  const frn = message.frn

  if (!isError) {
    await raiseCompletedReturnEvent(invoiceNumber, frn)
  } else {
    await raiseErrorEvent(invoiceNumber, frn)
  }
}

const returnEvent = () => {
  return {
    name: 'payment-request-return',
    type: 'return',
    message: 'Settlement received from DAX'
  }
}

const raiseCompletedReturnEvent = async (invoiceNumber, frn) => {
  if (processingConfig.useV1Events) {
    await raiseV1CompletedReturnEvent(invoiceNumber, frn)
  }
  if (processingConfig.useV2Events) {
    await raiseV2CompletedReturnEvent(invoiceNumber, frn)
  }
}

const raiseErrorEvent = async (invoiceNumber, frn) => {
  if (processingConfig.useV1Events) {
    await raiseV1ErrorEvent(invoiceNumber, frn)
  }
  if (processingConfig.useV2Events) {
    await raiseV2ErrorEvent(invoiceNumber, frn)
  }
}

const raiseV1CompletedReturnEvent = async (invoiceNumber, frn) => {
  const completedPaymentRequest = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)
  if (completedPaymentRequest) {
    const { correlationId, paymentRequestNumber, agreementNumber } = completedPaymentRequest
    const id = correlationId ?? uuidv4()
    const event = { ...returnEvent(), id, data: { paymentRequestNumber, agreementNumber } }
    await raiseEvent(event)
  } else {
    await raiseErrorEvent(invoiceNumber, frn)
  }
}

const raiseV1ErrorEvent = async (invoiceNumber, frn) => {
  const errorMessage = `Unable to find settlement for payment request ${invoiceNumber} and frn ${frn}`
  const event = { ...returnEvent(), id: uuidv4(), data: { invoiceNumber, frn, errorMessage }, type: 'error' }
  await raiseEvent(event)
}

const raiseV2CompletedReturnEvent = async (invoiceNumber, frn) => {
  const paymentRequest = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)
  const event = {
    source: SOURCE,
    type: PAYMENT_SETTLED,
    data: paymentRequest
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

const raiseV2ErrorEvent = async (invoiceNumber, frn) => {
  const event = {
    source: SOURCE,
    type: PAYMENT_SETTLEMENT_UNMATCHED,
    data: {
      message: `Unable to find payment request for settlement, Invoice: ${invoiceNumber}, FRN: ${frn}`,
      frn,
      invoiceNumber
    }
  }
  const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendProcessingReturnEvent
