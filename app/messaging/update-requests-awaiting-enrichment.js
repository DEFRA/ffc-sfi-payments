const db = require('../data')

const updateRequestsAwaitingEnrichment = async (paymentRequest) => {
  if (!paymentRequest.debtType) {
    throw new Error(`Payment request does not include debt data: ${paymentRequest.invoiceNumber}`)
  }

  const originalPaymentRequest = await db.paymentRequest.findOne({
    where: { invoiceNumber: paymentRequest.invoiceNumber },
    include: [{
      model: db.completedPaymentRequest,
      as: 'completedPaymentRequests'
    }]
  })

  if (!originalPaymentRequest) {
    throw new Error(`No payment request matching invoice number: ${paymentRequest.invoiceNumber}`)
  }

  for (const completedPaymentRequest of originalPaymentRequest.completedPaymentRequests) {
    await db.completedPaymentRequest.update({
      awaitingEnrichment: false,
      debtType: paymentRequest.debtType,
      recoveryDate: paymentRequest.recoveryDate
    },
    {
      where: { completedPaymentRequestId: completedPaymentRequest.completedPaymentRequestId }
    })
  }
}

module.exports = updateRequestsAwaitingEnrichment
