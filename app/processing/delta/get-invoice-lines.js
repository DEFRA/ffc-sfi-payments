const { getPreviousDomesticFund } = require('../dual-accounting')
const { getFundCode } = require('./get-fund-code')

const getInvoiceLines = (paymentRequest, previousPaymentRequests) => {
  // push all invoice lines from payment request into array
  // for previous requests, do the same but inverse the values so they can later be
  // summed with current to get line deltas
  const invoiceLines = [...paymentRequest.invoiceLines]
  const domesticFundCode = getPreviousDomesticFund([paymentRequest])
  previousPaymentRequests.map(x =>
    x.invoiceLines.forEach(invoiceLine => {
      invoiceLine.fundCode = getFundCode(invoiceLine.fundCode, domesticFundCode, invoiceLine.stateAid)
      invoiceLine.value *= -1
      invoiceLines.push(invoiceLine)
    }))

  return invoiceLines
}

module.exports = {
  getInvoiceLines
}
