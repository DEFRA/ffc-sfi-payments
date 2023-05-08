const { DRD10, DEX10, EXQ00, DRD00, DRD01, DRD05 } = require('../../constants/domestic-fund-codes')
const capitalSchemes = require('../../constants/capital-schemes')
const { getPreviousDomesticFund } = require('./get-previous-domestic-fund')

const applyCSDualAccounting = (paymentRequests, previousPaymentRequests) => {
  const previousFundCode = getPreviousDomesticFund(previousPaymentRequests)
  for (const paymentRequest of paymentRequests) {
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
