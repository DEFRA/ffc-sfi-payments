const { DOM00, DOM01, DOM10 } = require('../../constants/domestic-fund-codes')

const applyBPSDualAccounting = (paymentRequests, previousPaymentRequests) => {
  for (const paymentRequest of paymentRequests) {
    const previousPaymentRequestsWithInvoiceLines = previousPaymentRequests.filter(x => x.invoiceLines.length)
    const previousFundCode = previousPaymentRequestsWithInvoiceLines[previousPaymentRequestsWithInvoiceLines.length - 1]?.invoiceLines[0].fundCode
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (paymentRequest.marketingYear >= 2020) {
        invoiceLine.fundCode = DOM10
      } else {
        if (previousPaymentRequests.length) {
          if (previousFundCode === DOM00 || previousFundCode === DOM01) {
            invoiceLine.fundCode = previousFundCode
          } else {
            invoiceLine.fundCode = DOM01
          }
        } else {
          invoiceLine.fundCode = DOM00
        }
      }
    }
  }
  return paymentRequests
}

module.exports = {
  applyBPSDualAccounting
}
