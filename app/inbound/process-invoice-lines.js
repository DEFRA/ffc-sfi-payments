const db = require('../data')
const enrichInvoiceLine = require('./enrichment/enrich-invoice-line')
const validateInvoiceLine = require('./validate-invoice-line')

const processInvoiceLines = async (invoiceLines, paymentRequestId, fundCode, transaction) => {
  for (const invoiceLine of invoiceLines) {
    // ignore any net lines
    if (!invoiceLine.description.startsWith('N00')) {
      await enrichInvoiceLine(invoiceLine, transaction, fundCode)
      validateInvoiceLine(invoiceLine)
      await db.invoiceLine.create({ paymentRequestId, ...invoiceLine }, { transaction })
    }
  }
}

module.exports = processInvoiceLines
