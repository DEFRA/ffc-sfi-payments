const db = require('../data')

const createSchedule = async (paymentRequest, savedPaymentRequest, transaction) => {
  await db.schedule.create({
    schemeId: paymentRequest.schemeId,
    paymentRequestId: savedPaymentRequest.paymentRequestId,
    planned: new Date()
  },
  { transaction })
}

module.exports = createSchedule
