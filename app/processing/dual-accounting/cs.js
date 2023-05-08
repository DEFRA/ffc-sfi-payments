const { DRD10, DEX10, EXQ00, DRD00, DRD01, DRD05 } = require('../../constants/domestic-fund-codes')
const capitalSchemes = require('../../constants/capital-schemes')
const { getPreviousDomesticFund } = require('./get-previous-domestic-fund')
const { selectDomesticFundCode } = require('./select-domestic-fund-code')

const applyCSDualAccounting = (paymentRequests, previousPaymentRequests) => {
  const previousFundCode = getPreviousDomesticFund(previousPaymentRequests)
  for (const paymentRequest of paymentRequests) {
    for (const invoiceLine of paymentRequest.invoiceLines) {
      if (invoiceLine.fundCode !== DRD10 && invoiceLine.fundCode !== DEX10 && invoiceLine.fundCode !== EXQ00) {
        if (capitalSchemes.includes(invoiceLine.schemeCode)) {
          invoiceLine.fundCode = selectDomesticFundCode(previousPaymentRequests, DRD00, previousFundCode, DRD01)
        } else {
          invoiceLine.fundCode = selectDomesticFundCode(previousPaymentRequests, DRD05, previousFundCode, DRD01)
        }
      }
    }
  }
  return paymentRequests
}

module.exports = {
  applyCSDualAccounting
}
