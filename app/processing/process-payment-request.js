const mapAccountCodes = require('./map-account-codes')
const createCompletedPaymentRequest = require('./create-completed-payment-request')
const updateCompletedSchedule = require('./update-completed-schedule')
const transformPaymentRequest = require('./transform-payment-request')

const processPaymentRequest = async (scheduledPaymentRequest) => {
  const paymentRequests = await transformPaymentRequest(scheduledPaymentRequest.paymentRequest)

  for (const paymentRequest in paymentRequests) {
    await mapAccountCodes(paymentRequest)
    await createCompletedPaymentRequest(paymentRequest)
  }
  await updateCompletedSchedule(scheduledPaymentRequest.scheduleId)
}

module.exports = processPaymentRequest
