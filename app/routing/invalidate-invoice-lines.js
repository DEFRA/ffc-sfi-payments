const db = require('../data')

const invalidateInvoiceLines = async (paymentRequestId, transaction) => {
  await db.invoiceLines.update({
    invalid: true
  }, {
    transaction,
    where: {
      paymentRequestId
    }
  })
}

module.exports = {
  invalidateInvoiceLines
}
