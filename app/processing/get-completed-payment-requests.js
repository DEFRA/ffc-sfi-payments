const { FDMR } = require('../constants/schemes')
const db = require('../data')
const { getCompletedPaymentRequestsFilter } = require('./get-completed-payment-requests-filter')

const getCompletedPaymentRequests = async (paymentRequest) => {
  const filter = getCompletedPaymentRequestsFilter(paymentRequest)

  let completedPaymentRequests

  if (paymentRequest.schemeId === FDMR) {
    completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: filter,
      order: [['paymentRequestNumber', 'ASC']],
      include: [{
        model: db.completedInvoiceLine,
        as: 'invoiceLines',
        required: true,
        where: {
          schemeCode: paymentRequest.invoiceLines[0].schemeCode
        }
      }]
    })
  } else {
    completedPaymentRequests = await db.completedPaymentRequest.findAll({
      where: filter,
      order: [['paymentRequestNumber', 'ASC']],
      include: [{
        model: db.completedInvoiceLine,
        as: 'invoiceLines'
      }]
    })
  }

  return completedPaymentRequests.map(x => x.get({ plain: true }))
}

module.exports = {
  getCompletedPaymentRequests
}
