const db = require('../data')
const { sendResetEvent } = require('../event')
const { resetPaymentRequestById } = require('./reset-payment-request-id')

const resetPaymentRequestByInvoiceNumber = async (invoiceNumber, transaction) => {
  const paymentRequest = await db.paymentRequest.findOne({ where: { invoiceNumber } }, { transaction })
  if (!paymentRequest) {
    throw new Error(`Payment request ${invoiceNumber} does not exist`)
  }
  const completedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { paymentRequestId: paymentRequest.paymentRequestId, invalid: false } }, { transaction })
  if (!completedPaymentRequest) {
    throw new Error(`Payment request ${invoiceNumber} has not completed processing so cannot be reset`)
  }
  await resetPaymentRequestById(paymentRequest.paymentRequestId, transaction)
  await sendResetEvent(completedPaymentRequest)
}

module.exports = {
  resetPaymentRequestByInvoiceNumber
}
