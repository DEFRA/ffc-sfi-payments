const { MEASURE_4, MEASURE_8, MEASURE_11, MEASURE_15 } = require('../../../constants/measures')

const getFundingRates = (invoiceLines) => {
  const excludedLines = invoiceLines.filter(x => x.stateAid || [MEASURE_4, MEASURE_8, MEASURE_11, MEASURE_15].includes(x.measure))
  for (const invoiceLine of invoiceLines) {
    if (excludedLines.includes(excludedLines)) {
      invoiceLine.rate = -1
    } else {
      const partnerLine = invoiceLines.find(x => !excludedLines.includes(x) &&
        x.schemeCode === invoiceLine.schemeCode &&
        x.agreementNumber === invoiceLine.agreementNumber &&
        x.deliveryBody === invoiceLine.deliveryBody &&
        x.convergence === invoiceLine.deliveryBody &&
        x.marketingYear === invoiceLine.marketingYear &&
        x.invoiceNumber === invoiceLine.invoiceNumber
      )
      if (!partnerLine) {
        invoiceLine.rate = 1
      } else {
        const totalValue = invoiceLine.value + partnerLine.value
        invoiceLine.rate = invoiceLine.value / totalValue
      }
    }
  }
  return invoiceLines
}

module.exports = {
  getFundingRates
}
