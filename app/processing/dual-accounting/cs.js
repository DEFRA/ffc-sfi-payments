const { DRD10, DEX10, EXQ00, DRD00, DRD01, DRD05 } = require('../../constants/domestic-fund-codes')
const capitalSchemes = require('../../constants/capital-schemes')

const applyCSDualAccounting = (paymentRequests, previousPaymentRequests) => {
  for (const paymentRequest of paymentRequests) {
    const previousPaymentRequestsWithInvoiceLines = previousPaymentRequests.filter(x => x.invoiceLines.length)
    const previousFundCode = previousPaymentRequestsWithInvoiceLines[previousPaymentRequestsWithInvoiceLines.length - 1]?.invoiceLines.filter(x => [DRD00, DRD01, DRD05].includes(x.fundCode))[0]?.fundCode
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (invoiceLine.fundCode !== DRD10 && invoiceLine.fundCode !== DEX10 && invoiceLine.fundCode !== EXQ00) {
        if (capitalSchemes.includes(invoiceLine.schemeCode)) {
          if (previousPaymentRequests.length) {
            if (previousFundCode) {
              invoiceLine.fundCode = previousFundCode
            } else {
              invoiceLine.fundCode = DRD01
            }
          } else {
            invoiceLine.fundCode = DRD00
          }
        } else {
          if (previousPaymentRequests.length) {
            if (previousFundCode) {
              invoiceLine.fundCode = previousFundCode
            } else {
              invoiceLine.fundCode = DRD01
            }
          } else {
            invoiceLine.fundCode = DRD05
          }
        }
      }
    }
  }
  return paymentRequests
}

module.exports = {
  applyCSDualAccounting
}
