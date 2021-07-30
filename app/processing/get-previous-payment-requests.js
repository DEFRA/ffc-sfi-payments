const db = require('../data')

const getPreviousPaymentRequests = async (schemeId, frn, marketingYear) => {
  return db.completedPaymentRequest.findAll({
    where: {
      schemeId,
      frn,
      marketingYear
    },
    include: [{
      model: db.completedInvoiceLines,
      as: 'invoiceLines'
    }]
  })
}

module.exports = getPreviousPaymentRequests
