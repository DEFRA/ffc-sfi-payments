const db = require('../data')

const saveInvoiceLines = async (invoiceLines, paymentRequestId, transaction) => {
  for (const invoiceLine of invoiceLines) {
    delete invoiceLine.invoiceLineId
    await db.invoiceLine.create({ paymentRequestId, ...invoiceLine }, { transaction })
  }
}

module.exports = saveInvoiceLines
