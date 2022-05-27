const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')

const sendProcessingReturnEvent = async (message) => {
  const invoiceNumber = message.invoiceNumber
  const frn = message.frn

  const completedPaymentRequest = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)

  if (completedPaymentRequest) {
    await raiseCompletedReturn(completedPaymentRequest)
  } else {
    await raiseError(invoiceNumber, frn)
  }
}

const returnEvent = () => {
  return {
    name: 'payment-request-return',
    type: 'return',
    message: 'Settlement received from DAX'
  }
}

const raiseCompletedReturn = async (completedPaymentRequest) => {
  const { correlationId, paymentRequestNumber, agreementNumber } = completedPaymentRequest
  const event = { ...returnEvent(), id: correlationId, data: { paymentRequestNumber, agreementNumber } }
  await raiseEvent(event)
}

const raiseError = async (invoiceNumber, frn) => {
  const errorMessage = `Unable to find settlement for payment request ${invoiceNumber} and frn ${frn}`
  const event = { ...returnEvent(), id: uuidv4, data: { invoiceNumber, frn, errorMessage }, type: 'error' }
  await raiseEvent(event)
  console.error(errorMessage)
}

module.exports = sendProcessingReturnEvent
