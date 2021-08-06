const getInvoiceCorrectionReference = require('./get-invoice-correction-reference')
const getOriginalSettlementDate = require('./get-original-settlement-date')

const enrichPaymentRequests = (paymentRequests, previousPaymentRequests) => {
  paymentRequests
    .filter(x => x.ledger === 'AR')
    .map(paymentRequest => {
      paymentRequest.originalSettlementDate = getOriginalSettlementDate(previousPaymentRequests)
      paymentRequest.invoiceCorrectionReference = getInvoiceCorrectionReference(previousPaymentRequests)
    })
}

module.exports = enrichPaymentRequests
