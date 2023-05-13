const util = require('util')
const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const { sendMessage } = require('../messaging/send-message')
const { holdAndReschedule } = require('../reschedule')
const { messageConfig } = require('../config')

const routeDebtToRequestEditor = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    await sendMessage(paymentRequest, 'uk.gov.defra.ffc.pay.debt', messageConfig.debtTopic)
    console.log('Payment request routed to request editor:', util.inspect(paymentRequest, false, null, true))
    const holdCategoryId = await getHoldCategoryId(paymentRequest.schemeId, 'Awaiting debt enrichment', transaction)
    await holdAndReschedule(paymentRequest.schemeId, paymentRequest.paymentRequestId, holdCategoryId, paymentRequest.frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  routeDebtToRequestEditor
}
