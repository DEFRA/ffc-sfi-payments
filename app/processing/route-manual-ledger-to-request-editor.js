const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const sendManualLedgerMessage = require('../messaging/send-manual-ledger-message')
const holdAndReschedule = require('../reschedule')
const util = require('util')

const routeManualLedgerToRequestEditor = async (scheduleId, paymentRequest, paymentRequests) => {
  const transaction = await db.sequelize.transaction()
  try {
    await sendManualLedgerMessage({ scheduleId, paymentRequest, paymentRequests })
    console.log('Payment request routed to request editor:', util.inspect(paymentRequest, false, null, true))
    const holdCategoryId = await getHoldCategoryId(paymentRequest.schemeId, 'Manual ledger hold', transaction)
    await holdAndReschedule(paymentRequest.schemeId, paymentRequest.paymentRequestId, holdCategoryId, paymentRequest.frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.log('Error routing payment request to request editor:', error)
    throw (error)
  }
}

module.exports = routeManualLedgerToRequestEditor
