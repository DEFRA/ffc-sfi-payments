const db = require('../data')

const getCompletedPaymentRequests = async (schemeId, frn, marketingYear) => {
  const completedPaymentRequests = await db.completedPaymentRequest.findAll({
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

  return completedPaymentRequests.map(x => x.get({ plain: true }))
}

module.exports = getCompletedPaymentRequests
