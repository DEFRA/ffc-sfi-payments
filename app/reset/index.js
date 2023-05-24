const { resetPaymentRequestById } = require('./reset-payment-request-id')
const { resetPaymentRequestByInvoiceNumber } = require('./reset-payment-requests-invoice-number')

module.exports = {
  resetPaymentRequestById,
  resetPaymentRequestByInvoiceNumber
}
