const db = require('../data')

const getPaymentRequestByInvoiceAndFrn = async (invoiceNumber, frn) => {
  return db.completedPaymentRequest.findOne({
    where: { invoiceNumber, frn },
    raw: true
  })
}

module.exports = {
  getPaymentRequestByInvoiceAndFrn
}
