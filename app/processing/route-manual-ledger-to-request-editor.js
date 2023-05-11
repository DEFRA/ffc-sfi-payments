const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const { sendManualLedgerMessage } = require('../messaging/send-manual-ledger-message')
const holdAndReschedule = require('../reschedule')
const util = require('util')

const routeManualLedgerToRequestEditor = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  const { deltaPaymentRequest, completedPaymentRequests } = paymentRequest
  try {
    const manualLedgerMessage = { paymentRequest: deltaPaymentRequest, paymentRequests: completedPaymentRequests }
    await sendManualLedgerMessage(manualLedgerMessage)
    console.log('Payment request routed to request editor for manual ledger check:', util.inspect(manualLedgerMessage, false, null, true))
    const holdCategoryId = await getHoldCategoryId(deltaPaymentRequest.schemeId, 'Manual ledger hold', transaction)
    await holdAndReschedule(deltaPaymentRequest.schemeId, deltaPaymentRequest.paymentRequestId, holdCategoryId, deltaPaymentRequest.frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.log('Error routing payment request to request editor:', error)
    throw (error)
  }
}

module.exports = routeManualLedgerToRequestEditor
