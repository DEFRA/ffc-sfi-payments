const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const { sendDebtMessage } = require('../messaging/send-debt-message')
const { holdAndReschedule } = require('../reschedule')
const util = require('util')

const routeDebtToRequestEditor = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    await sendDebtMessage(paymentRequest)
    console.log('Payment request routed to request editor:', util.inspect(paymentRequest, false, null, true))
    const holdCategoryId = await getHoldCategoryId(paymentRequest.schemeId, 'Awaiting debt enrichment', transaction)
    await holdAndReschedule(paymentRequest.schemeId, paymentRequest.paymentRequestId, holdCategoryId, paymentRequest.frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = routeDebtToRequestEditor
