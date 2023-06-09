const { enrichCSLines } = require('./enrich-cs-lines')
const { calculateCoreLineDeltas } = require('../calculate-line-deltas')
const { EXQ00 } = require('../../../constants/domestic-fund-codes')
const { calculateOverallDelta } = require('../calculate-overall-delta')

const calculateCSLineDeltas = (invoiceLines, defaultAgreementNumber) => {
  const enrichedInvoiceLines = enrichCSLines(invoiceLines)
  const coreInvoiceLines = enrichedInvoiceLines.filter(x => x.rate === -1)
  const fundedInvoiceLines = enrichedInvoiceLines.filter(x => x.rate !== -1)

  const hasFundingChange = fundedInvoiceLines.some(x => x.rate !== 1) && fundedInvoiceLines.some(x => x.rate === 1)

  if (!hasFundingChange) {
    return calculateCoreLineDeltas(enrichedInvoiceLines, defaultAgreementNumber)
  }

  const calculatedCoreInvoiceLines = calculateCoreLineDeltas(coreInvoiceLines, defaultAgreementNumber)

  const delta1 = [...fundedInvoiceLines.reduce((x, y) => {
    const key = `${y.schemeCode}-${y.marketingYear}-${y.agreementNumber ?? defaultAgreementNumber}-${y.convergence ?? false}-${y.deliveryBody}-${y.description}`

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, {
      schemeCode: y.schemeCode,
      marketingYear: y.marketingYear,
      agreementNumber: y.agreementNumber ?? defaultAgreementNumber,
      convergence: y.convergence ?? false,
      deliveryBody: y.deliveryBody,
      description: y.description,
      value: 0
    })
    item.value += Number(y.value)

    return x.set(key, item)
  }, new Map()).values()]

  const delta2 = [...fundedInvoiceLines.reduce((x, y) => {
    const key = `${y.schemeCode}-${y.marketingYear}-${y.agreementNumber ?? defaultAgreementNumber}-${y.convergence ?? false}-${y.deliveryBody}-${y.description}-${y.fundCode}`

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, {
      schemeCode: y.schemeCode,
      marketingYear: y.marketingYear,
      agreementNumber: y.agreementNumber ?? defaultAgreementNumber,
      convergence: y.convergence ?? false,
      deliveryBody: y.deliveryBody,
      description: y.description,
      fundCode: y.fundCode,
      value: 0
    })
    item.value += Number(y.value)

    return x.set(key, item)
  }, new Map()).values()]

  const additionalExqLines = []

  for (const invoiceLine of delta2) {
    if (invoiceLine.fundCode !== EXQ00) {
      const existingExqLine = delta2.find(x => x.schemeCode === invoiceLine.schemeCode &&
        x.agreementNumber === invoiceLine.agreementNumber &&
        x.deliveryBody === invoiceLine.deliveryBody &&
        x.convergence === invoiceLine.deliveryBody &&
        x.marketingYear === invoiceLine.marketingYear &&
        x.invoiceNumber === invoiceLine.invoiceNumber
      )
      if (!existingExqLine) {
        additionalExqLines.push({ ...invoiceLine, fundCode: EXQ00, value: 0.00 })
      }
    }
  }

  const delta3 = delta2.concat(additionalExqLines)
  const overallDelta = calculateOverallDelta(delta1.concat(calculatedCoreInvoiceLines))

  for (const invoiceLine of delta3) {

  }
  return delta3.concat(calculatedCoreInvoiceLines)
}

module.exports = {
  calculateCSLineDeltas
}
