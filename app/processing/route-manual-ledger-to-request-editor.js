const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const sendManualLedgerMessage = require('../messaging/send-manual-ledger-message')
const holdAndReschedule = require('../reschedule')
const getCompletedPaymentRequests = require('./get-completed-payment-requests')
const calculateLineDeltas = require('./delta/calculate-overall-delta')
const calculateOverallDelta = require('./delta/calculate-overall-delta')
const getInvoiceLines = require('./delta/get-invoice-lines')
const copyPaymentRequest = require('./delta/copy-payment-request')
const util = require('util')

const routeManualLedgerToRequestEditor = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const previousPaymentRequests = await getCompletedPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear, paymentRequest.agreementNumber, paymentRequest.paymentRequestNumber)
    if (previousPaymentRequests.length) {
      const invoiceLines = getInvoiceLines(paymentRequest, previousPaymentRequests)
      const lineDeltas = calculateLineDeltas(invoiceLines)
      const overallDelta = calculateOverallDelta(invoiceLines)
      const updatedPaymentRequest = copyPaymentRequest(paymentRequest, overallDelta, lineDeltas)
      const deltaPaymentRequest = JSON.parse(JSON.stringify(updatedPaymentRequest))
      const deltaManualLedgerPaymentRequest = { updatedPaymentRequest: [updatedPaymentRequest], deltaPaymentRequest }
      await sendManualLedgerMessage(deltaManualLedgerPaymentRequest)
      console.log('Payment request routed to request editor is delta:', util.inspect(deltaManualLedgerPaymentRequest, false, null, true))
    } else {
      const nonDeltaPaymentRequest = JSON.parse(JSON.stringify(paymentRequest))
      const nonDeltaManualLedgerPaymentRequest = { updatedPaymentRequest: [paymentRequest], deltaPaymentRequest: nonDeltaPaymentRequest }
      await sendManualLedgerMessage(nonDeltaManualLedgerPaymentRequest)
      console.log('Payment request routed to request editor is nonDelta:', util.inspect(nonDeltaManualLedgerPaymentRequest, false, null, true))
    }

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
