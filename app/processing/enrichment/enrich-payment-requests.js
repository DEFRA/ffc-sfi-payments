const { AR } = require('../../constants/ledgers')
const { getOriginalSettlementDate } = require('./get-original-settlement-date')
const { getInvoiceCorrectionReference } = require('./get-invoice-correction-reference')
const { getOriginalInvoiceNumber } = require('./get-original-invoice-number')

const enrichPaymentRequests = (paymentRequests, previousPaymentRequests) => {
  paymentRequests
    .filter(x => x.ledger === AR)
    .map(paymentRequest => {
      paymentRequest.originalSettlementDate = paymentRequest.originalSettlementDate ?? getOriginalSettlementDate(previousPaymentRequests)
      paymentRequest.invoiceCorrectionReference = paymentRequest.invoiceCorrectionReference ?? getInvoiceCorrectionReference(previousPaymentRequests)
      paymentRequest.originalInvoiceNumber = paymentRequest.originalInvoiceNumber ?? getOriginalInvoiceNumber(previousPaymentRequests)
      return paymentRequest
    })

  return paymentRequests
}

module.exports = {
  enrichPaymentRequests
}
