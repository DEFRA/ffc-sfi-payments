const { DRD00, DRD01, DRD05, DRD10, EXQ00 } = require('../../constants/domestic-fund-codes')
const { getPreviousDomesticFund } = require('./get-previous-domestic-fund')
const { isCapital } = require('../is-capital')
const { selectDomesticFundCode } = require('./select-domestic-fund-code')

const applyCSDualAccounting = (paymentRequest, previousPaymentRequests) => {
  const previousFundCode = getPreviousDomesticFund(previousPaymentRequests)
  for (const invoiceLine of paymentRequest.invoiceLines) {
    if (invoiceLine.fundCode !== DRD10 && invoiceLine.fundCode !== EXQ00) {
      if (isCapital(invoiceLine.schemeCode)) {
        invoiceLine.fundCode = selectDomesticFundCode(previousPaymentRequests, DRD00, previousFundCode, DRD01)
      } else {
        invoiceLine.fundCode = selectDomesticFundCode(previousPaymentRequests, DRD05, previousFundCode, DRD01)
      }
    }
  }
  return paymentRequest
}

module.exports = {
  applyCSDualAccounting
}
