const db = require('../data')

const getCompletedPaymentRequests = async (schemeId, frn, marketingYear, agreementNumber, paymentRequestNumber) => {
  const completedPaymentRequests = await db.completedPaymentRequest.findAll({
    where: {
      schemeId,
      frn,
      marketingYear,
      agreementNumber,
      paymentRequestNumber: { [db.Sequelize.Op.lt]: paymentRequestNumber },
      invalid: false
    },
    include: [{
      model: db.completedInvoiceLine,
      as: 'invoiceLines'
    }]
  })

  return completedPaymentRequests.map(x => x.get({ plain: true }))
}

module.exports = getCompletedPaymentRequests
