const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const sendManualLedgerMessage = require('../messaging/send-manual-ledger-message')
const holdAndReschedule = require('../reschedule')
const util = require('util')

const routeManualLedgerToRequestEditor = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const manualLedgerMessage = { paymentRequest: paymentRequest.deltaPaymentRequest, paymentRequests: paymentRequest.completedPaymentRequests }
    await sendManualLedgerMessage(manualLedgerMessage)
    console.log('Payment request routed to request editor:', util.inspect(manualLedgerMessage, false, null, true))
    const holdCategoryId = await getHoldCategoryId(paymentRequest.deltaPaymentRequest.schemeId, 'Manual ledger hold', transaction)
    await holdAndReschedule(paymentRequest.deltaPaymentRequest.schemeId, paymentRequest.deltaPaymentRequest.paymentRequestId, holdCategoryId, paymentRequest.deltaPaymentRequest.frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.log('Error routing payment request to request editor:', error)
    throw (error)
  }
}

module.exports = routeManualLedgerToRequestEditor
