const moment = require('moment')
const { convertToPounds } = require('../currency-convert')

const getContent = (batch) => {
  const rows = []
  for (const paymentRequest of batch.paymentRequests) {
    const vendorGroups = getVendorGroups(paymentRequest.invoiceLines)
    for (const vendorGroup of vendorGroups) {
      const vendor = getVendorLine(paymentRequest, vendorGroup, batch)
      rows.push(vendor)
      for (const invoiceLine of vendorGroup.invoiceLines) {
        const ledger = getLedgerLine(invoiceLine, paymentRequest)
        rows.push(ledger)
      }
    }
  }

  return rows
}

const getVendorGroups = (invoiceLines) => {
  return [...invoiceLines.reduce((x, y) => {
    // group by scheme and fund, so create key representing the combination
    const key = `${y.schemeCode}-${y.fundCode}`

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, { fundCode: y.fundCode, schemeCode: y.schemeCode, value: 0, invoiceLines: [] })
    item.value += Number(y.value)
    item.invoiceLines.push(y)

    return x.set(key, item)
  }, new Map()).values()]
}

const getVendorLine = (paymentRequest, vendorGroup, batch) => {
  return [
    'Vendor',
    paymentRequest.frn,
    '',
    vendorGroup.fundCode,
    vendorGroup.schemeCode,
    paymentRequest.marketingYear,
    paymentRequest.deliveryBody,
    paymentRequest.invoiceNumber,
    convertToPounds(vendorGroup.value),
    paymentRequest.currency,
    'legacy',
    '',
    paymentRequest.contractNumber,
    '',
    1,
    '',
    '',
    '',
    '',
    `BACS_${paymentRequest.currency}`,
    batch.scheme.batchProperties.source,
    '',
    '',
    '',
    moment(paymentRequest.dueDate).format('DD[/]MM[/]YYYY'),
    paymentRequest.currency,
    '',
    '',
    paymentRequest.schedule,
    'END'
  ]
}

const getLedgerLine = (invoiceLine, paymentRequest) => {
  return [
    'Ledger',
    invoiceLine.accountCode,
    '',
    invoiceLine.fundCode,
    invoiceLine.schemeCode,
    paymentRequest.marketingYear,
    paymentRequest.deliveryBody,
    paymentRequest.invoiceNumber,
    convertToPounds(invoiceLine.value),
    paymentRequest.currency,
    'legacy',
    '',
    '',
    '',
    '',
    '',
    '',
    invoiceLine.description,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    paymentRequest.agreementNumber,
    '',
    'END'
  ]
}

module.exports = getContent
