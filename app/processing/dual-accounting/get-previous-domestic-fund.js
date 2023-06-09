const domesticFundCodes = require('../../constants/domestic-fund-codes')

const getPreviousDomesticFund = (paymentRequests) => {
  const previousPaymentRequestsWithInvoiceLines = paymentRequests.filter(x => x.invoiceLines?.length)
  return previousPaymentRequestsWithInvoiceLines[previousPaymentRequestsWithInvoiceLines.length - 1]?.invoiceLines
    .filter(x => Object.values(domesticFundCodes).includes(x.fundCode))[0]?.fundCode
}

module.exports = {
  getPreviousDomesticFund
}
