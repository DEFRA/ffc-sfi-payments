const util = require('util')
const db = require('../data')
const { messageConfig } = require('../config')
const { getHoldCategoryId } = require('../holds')
const { sendMessage } = require('../messaging/send-message')
const { holdAndReschedule } = require('../reschedule')

const routeManualLedgerToRequestEditor = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  const { deltaPaymentRequest, completedPaymentRequests } = paymentRequest
  try {
    const manualLedgerMessage = { paymentRequest: deltaPaymentRequest, paymentRequests: completedPaymentRequests }
    await sendMessage(manualLedgerMessage, 'uk.gov.defra.ffc.pay.manual.check', messageConfig.manualTopic)
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

module.exports = {
  routeManualLedgerToRequestEditor
}
