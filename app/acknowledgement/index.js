const acknowledgePaymentRequest = require('./acknowledge-payment-request')
const processInvalid = require('./process-invalid')

const updateAcknowledgement = async (acknowledgement) => {
  const { schemeId, paymentRequestId, frn } = await acknowledgePaymentRequest(acknowledgement.invoiceNumber, acknowledgement.acknowledged)

  if (!acknowledgement.success) {
    await processInvalid(schemeId, paymentRequestId, frn, acknowledgement.message)
  }
}

module.exports = updateAcknowledgement
