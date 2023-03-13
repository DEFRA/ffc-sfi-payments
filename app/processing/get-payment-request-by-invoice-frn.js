const db = require('../data')

const getPaymentSchemeByInvoiceAndFrn = async (invoiceNumber, frn) => {
  return db.completedPaymentRequest.findOne({
    where: { invoiceNumber, frn },
    raw: true
  })
}

module.exports = getPaymentSchemeByInvoiceAndFrn
