const { getFundCode } = require('../get-fund-code')
const { getMeasure } = require('./get-measure')
const { getFundingRates } = require('./get-funding-rates')

const enrichCSLines = (invoiceLines) => {
  const enrichedInvoiceLines = invoiceLines.map(invoiceLine => ({
    ...invoiceLine,
    fundCode: getFundCode(invoiceLine.fundCode),
    measure: getMeasure(invoiceLine.schemeCode)
  }))
  const invoiceLinesWithFundingRates = getFundingRates(enrichedInvoiceLines)
  return invoiceLinesWithFundingRates
}

module.exports = {
  enrichCSLines
}
