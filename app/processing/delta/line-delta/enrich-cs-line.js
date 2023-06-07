const { getFundCode } = require('./get-fund-code')
const { getMeasure } = require('./get-measure')

const enrichCSLine = (invoiceLines) => {
  return invoiceLines.map(invoiceLine => ({
    ...invoiceLine,
    measure: getMeasure(invoiceLine.schemeCode),
    fundCode: getFundCode(invoiceLine.fundCode)
  }))
}

module.exports = {
  enrichCSLine
}
