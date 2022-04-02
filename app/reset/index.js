const db = require('../data')
const ensureScheduled = require('../reschedule/ensure-scheduled')
const invalidatePaymentRequests = require('./invalidate-payment-requests')
const resetReferenceId = require('./reset-reference-id')

const resetPaymentRequestByInvoiceNumber = async (invoiceNumber, transaction) => {
  const paymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber } }, { transaction })
  if (!paymentRequest) {
    throw new Error(`Payment request ${invoiceNumber} does not exist`)
  }
  const completedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: paymentRequest.paymentRequestId, invalid: false } }, { transaction })
  if (!completedPaymentRequest) {
    throw new Error(`Payment request ${invoiceNumber} has not completed processing so cannot be reset`)
  }
  await resetPaymentRequestById(paymentRequest.paymentRequestId, paymentRequest.schemeId, transaction)
}

const resetPaymentRequestById = async (paymentRequestId, schemeId, transaction) => {
  await resetReferenceId(paymentRequestId, transaction)
  await invalidatePaymentRequests(paymentRequestId, transaction)
  await ensureScheduled(paymentRequestId, schemeId, transaction)
}

module.exports = {
  resetPaymentRequestById,
  resetPaymentRequestByInvoiceNumber
}
