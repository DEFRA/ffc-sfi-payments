const getScheduledPaymentRequests = require('./get-scheduled-payment-requests')
const getPreviousPaymentRequests = require('./get-previous-payment-requests copy')
const calculateDelta = require('./calculate-delta')
const mapAccountCodes = require('./map-account-codes')
const createCompletedPaymentRequest = require('./create-completed-payment-request')
const updateCompletedSchedule = require('./update-completed-schedule')

const processScheduledPaymentRequests = async () => {
  const scheduledPaymentRequests = await getScheduledPaymentRequests()
  for (const scheduledPaymentRequest of scheduledPaymentRequests) {
    const paymentRequest = scheduledPaymentRequest.paymentRequest
    const paymentRequests = []

    const previousPaymentRequests = await getPreviousPaymentRequests(paymentRequest.schemeId, paymentRequest.frn, paymentRequest.marketingYear)

    if (previousPaymentRequests.length) {
      const calculatedPaymentRequests = await calculateDelta(paymentRequest, previousPaymentRequests)
      paymentRequests.concat(calculatedPaymentRequests)
    } else {
      paymentRequests.push(paymentRequest)
    }

    for (const request in paymentRequests) {
      await mapAccountCodes(request)
      await createCompletedPaymentRequest(request)
    }
    await updateCompletedSchedule(scheduledPaymentRequests.scheduleId)
  }
}

module.exports = processScheduledPaymentRequests
