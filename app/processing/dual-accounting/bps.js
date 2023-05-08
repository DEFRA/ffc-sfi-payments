const { DOM00, DOM01, DOM10 } = require('../../constants/domestic-fund-codes')
const { getPreviousDomesticFund } = require('./get-previous-domestic-fund')
const { selectFundCode } = require('./select-fund-code')

const applyBPSDualAccounting = (paymentRequests, previousPaymentRequests) => {
  const previousFundCode = getPreviousDomesticFund(previousPaymentRequests)
  for (const paymentRequest of paymentRequests) {
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (paymentRequest.marketingYear >= 2020) {
        invoiceLine.fundCode = DOM10
      } else {
        invoiceLine.fundCode = selectFundCode(previousPaymentRequests, DOM00, previousFundCode, DOM01)
      }
    }
  }
  return paymentRequests
}

module.exports = {
  applyBPSDualAccounting
}
