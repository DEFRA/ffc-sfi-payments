const db = require('../data')

const invalidateInvoiceLines = async (paymentRequestId, transaction) => {
  await db.invoiceLine.update({
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
