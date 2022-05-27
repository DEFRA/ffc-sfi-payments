const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')

const sendProcessingReturnEvent = async (message) => {
  const invoiceNumber = message.invoiceNumber
  const frn = message.frn

  const completedPaymentRequest = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)

  if (completedPaymentRequest) {
    await raiseCompletedReturnEvent(completedPaymentRequest)
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

const raiseCompletedReturnEvent = async (completedPaymentRequest) => {
  const { correlationId, paymentRequestNumber, agreementNumber } = completedPaymentRequest
  const id = correlationId ?? uuidv4()
  const event = { ...returnEvent(), id, data: { paymentRequestNumber, agreementNumber } }
  await raiseEvent(event)
}

const raiseErrorEvent = async (invoiceNumber, frn) => {
  const errorMessage = `Unable to find settlement for payment request ${invoiceNumber} and frn ${frn}`
  const event = { ...returnEvent(), id: uuidv4(), data: { invoiceNumber, frn, errorMessage }, type: 'error' }
  await raiseEvent(event)
  throw new Error(errorMessage)
}

module.exports = sendProcessingReturnEvent
