const domesticFundCodes = require('../../constants/domestic-fund-codes')

const getPreviousDomesticFund = (paymentRequests) => {
  const domesticFundCodesWithoutEXQ = { ...domesticFundCodes }
  delete domesticFundCodesWithoutEXQ.EXQ00
  const previousPaymentRequestsWithInvoiceLines = paymentRequests.filter(x => x.invoiceLines?.length)
  return previousPaymentRequestsWithInvoiceLines[previousPaymentRequestsWithInvoiceLines.length - 1]?.invoiceLines
    .filter(x => Object.values(domesticFundCodesWithoutEXQ).includes(x.fundCode))[0]?.fundCode
}

module.exports = {
  getPreviousDomesticFund
}
