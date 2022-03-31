const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')
const getPaymentSchemeByInvoiceAndFrn = require('../processing/get-payment-request-by-invoice-frn')

const sendProcessingReturnEvent = async (message) => {
  const invoiceNumber = message.invoiceNumber
  const frn = message.frn

  const { correlationId, paymentRequestNumber, agreementNumber } = await getPaymentSchemeByInvoiceAndFrn(invoiceNumber, frn)

  const event = {
    id: correlationId ?? uuidv4(),
    name: 'payment-request-return-event',
    type: 'return',
    message: 'Payment request return from DAX',
    data: { returnMessage: message, paymentRequestNumber, agreementNumber, frn }
  }
  await raiseEvent(event)
}

module.exports = sendProcessingReturnEvent
