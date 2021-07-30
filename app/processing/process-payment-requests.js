const getPaymentRequests = require('./get-payment-requests')
const mapAccountCodes = require('./map-account-codes')
const completePaymentRequest = require('./complete-payment-request')
const completeSchedule = require('./complete-schedule')
const transformPaymentRequest = require('./transform-payment-request')

const processPaymentRequests = async () => {
  const scheduledPaymentRequests = await getPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    await processPaymentRequest(scheduledPaymentRequest)
  }
}

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const paymentRequests = await transformPaymentRequest(scheduledPaymentRequest.paymentRequest)

  for (const paymentRequest in paymentRequests) {
    await mapAccountCodes(paymentRequest)
    await completePaymentRequest(paymentRequest)
  }
  await completeSchedule(scheduledPaymentRequest.scheduleId)
}

module.exports = processPaymentRequests
