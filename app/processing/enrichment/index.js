const { AR } = require('../../ledgers')
const getInvoiceCorrectionReference = require('./get-invoice-correction-reference')
const getOriginalInvoiceNumber = require('./get-original-invoice-number')
const getOriginalSettlementDate = require('./get-original-settlement-date')

const enrichPaymentRequests = (paymentRequests, previousPaymentRequests) => {
  paymentRequests
    .filter(x => x.ledger === AR)
    .map(paymentRequest => {
      paymentRequest.originalSettlementDate = getOriginalSettlementDate(previousPaymentRequests)
      paymentRequest.invoiceCorrectionReference = getInvoiceCorrectionReference(previousPaymentRequests)
      paymentRequest.originalInvoiceNumber = getOriginalInvoiceNumber(previousPaymentRequests)
      return paymentRequest
    })

  return paymentRequests
}

module.exports = enrichPaymentRequests
