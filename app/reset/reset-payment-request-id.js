const { ensureScheduled } = require('../reschedule')
const { invalidatePaymentRequests } = require('./invalidate-payment-requests')
const { resetReferenceId } = require('./reset-reference-id')

const resetPaymentRequestById = async (paymentRequestId, transaction) => {
  await resetReferenceId(paymentRequestId, transaction)
  await invalidatePaymentRequests(paymentRequestId, transaction)
  await ensureScheduled(paymentRequestId, transaction)
}

module.exports = {
  resetPaymentRequestById
}
