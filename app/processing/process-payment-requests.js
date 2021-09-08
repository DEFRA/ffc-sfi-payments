const getPaymentRequests = require('./get-payment-requests')
const mapAccountCodes = require('./map-account-codes')
const completePaymentRequests = require('./complete-payment-requests')
const transformPaymentRequest = require('./transform-payment-request')
const sendEvent = require('../events')

const processPaymentRequests = async () => {
  const scheduledPaymentRequests = await getPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
    await sendEvent({
      frn: scheduledPaymentRequest.paymentRequest.frn,
      invoiceNumber: scheduledPaymentRequest.paymentRequest.invoiceNumber,
      scheme: scheduledPaymentRequest.paymentRequest.scheme.name
    },
    'uk.gov.sfi.payment.processed')
  }
}

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const paymentRequests = await transformPaymentRequest(scheduledPaymentRequest.paymentRequest)

  for (const paymentRequest of paymentRequests) {
    await mapAccountCodes(paymentRequest)
  }
  await completePaymentRequests(scheduledPaymentRequest.scheduleId, paymentRequests)
}

module.exports = processPaymentRequests
