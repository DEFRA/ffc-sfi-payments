const getPaymentRequests = require('./get-payment-requests')
const mapAccountCodes = require('./map-account-codes')
const completePaymentRequests = require('./complete-payment-requests')
const transformPaymentRequest = require('./transform-payment-request')
const sendEvent = require('../events')
const { AR } = require('../ledgers')
const sendDebtMessage = require('../messaging/send-debt-message')

const processPaymentRequests = async () => {
  const scheduledPaymentRequests = await getPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
    await sendEvent({
      frn: scheduledPaymentRequest.paymentRequest.frn,
      invoiceNumber: scheduledPaymentRequest.paymentRequest.invoiceNumber,
      scheme: scheduledPaymentRequest.paymentRequest.scheme.name
    },
    'uk.gov.pay.processed')
  }
}

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const paymentRequests = await transformPaymentRequest(scheduledPaymentRequest.paymentRequest)

  for (const paymentRequest of paymentRequests) {
    await mapAccountCodes(paymentRequest)
  }

  if (paymentRequests.some(x => x.ledger === AR && x.debtType == null)) {
    await sendDebtMessage(scheduledPaymentRequest.paymentRequest)
    paymentRequests.forEach(request => {
      request.awaitingEnrichment = true
    })
  }
  await completePaymentRequests(scheduledPaymentRequest.scheduleId, paymentRequests)
}

module.exports = processPaymentRequests
