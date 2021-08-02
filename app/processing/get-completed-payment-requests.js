const db = require('../data')

const getCompletedPaymentRequests = async (schemeId, frn, marketingYear) => {
  return db.completedPaymentRequest.findAll({
    where: {
      schemeId,
      frn,
      marketingYear
    },
    include: [{
      model: db.completedInvoiceLine,
      as: 'invoiceLines'
    }]
  })
}

module.exports = getCompletedPaymentRequests
