const db = require('../../app/data')

const savePaymentRequest = async (paymentRequest, completed = false) => {
  const savedPaymentRequest = await db.paymentRequest.create(paymentRequest)
  await db.invoiceLine.bulkCreate(paymentRequest.invoiceLines.map(invoiceLine => ({ ...invoiceLine, paymentRequestId: savedPaymentRequest.paymentRequestId })))
  if (completed) {
    const completedPaymentRequest = await db.completedPaymentRequest.create({ ...paymentRequest, paymentRequestId: savedPaymentRequest.paymentRequestId })
    await db.completedInvoiceLine.bulkCreate(paymentRequest.invoiceLines.map(invoiceLine => ({ ...invoiceLine, completedPaymentRequestId: completedPaymentRequest.completedPaymentRequestId })))
    return { id: savedPaymentRequest.paymentRequestId, completedId: completedPaymentRequest.completedPaymentRequestId }
  }
  return { id: savedPaymentRequest.paymentRequestId }
}

module.exports = {
  savePaymentRequest
}
