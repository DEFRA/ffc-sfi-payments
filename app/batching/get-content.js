const { getLedgerLineAP, getLedgerLineAR } = require('./get-ledger-line')
const { getVendorLineAP, getVendorLineAR } = require('./get-vendor-line')

const getContent = (batch) => {
  const rows = []
  for (const paymentRequest of batch.paymentRequests) {
    const vendorGroups = getVendorGroups(paymentRequest.invoiceLines)
    for (const vendorGroup of vendorGroups) {
      const vendor = batch.ledger === 'AP' ? getVendorLineAP(paymentRequest, vendorGroup, batch) : getVendorLineAR(paymentRequest, vendorGroup, batch)
      rows.push(vendor)
      for (const invoiceLine of vendorGroup.invoiceLines) {
        const ledger = batch.ledger === 'AP' ? getLedgerLineAP(invoiceLine, paymentRequest) : getLedgerLineAR(invoiceLine, paymentRequest)
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

module.exports = getContent
