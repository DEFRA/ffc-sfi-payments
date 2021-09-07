const acknowledgePaymentRequest = require('./acknowledge-payment-request')
const getPaymentRequest = require('./get-payment-request')
const processInvalid = require('./process-invalid')

const updateAcknowledgement = async (acknowledgement) => {
  await acknowledgePaymentRequest(acknowledgement.invoiceNumber, acknowledgement.acknowledged)

  if (!acknowledgement.success) {
    const { schemeId, paymentRequestId, frn } = await getPaymentRequest(acknowledgement.invoiceNumber)
    await processInvalid(schemeId, paymentRequestId, frn, acknowledgement.message)
  }
}

module.exports = updateAcknowledgement
