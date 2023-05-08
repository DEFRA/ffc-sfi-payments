const { DOM00, DOM01, DOM10 } = require('../../constants/domestic-fund-codes')
const { getPreviousDomesticFund } = require('./get-previous-domestic-fund')

const applyBPSDualAccounting = (paymentRequests, previousPaymentRequests) => {
  const previousFundCode = getPreviousDomesticFund(previousPaymentRequests)
  for (const paymentRequest of paymentRequests) {
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (paymentRequest.marketingYear >= 2020) {
        invoiceLine.fundCode = DOM10
      } else {
        if (previousPaymentRequests.length) {
          if (previousFundCode) {
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
