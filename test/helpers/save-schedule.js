const db = require('../../app/data')
const { TIMESTAMP } = require('../mocks/values/date')
const { savePaymentRequest } = require('./save-payment-request')
const mockPaymentRequest = require('../mocks/payment-requests/payment-request')

const saveSchedule = async (paymentRequest = mockPaymentRequest, started = false, completed = false) => {
  const { id: paymentRequestId } = await savePaymentRequest(paymentRequest)
  const schedule = await db.schedule.create({ paymentRequestId, planned: TIMESTAMP, started: started ? TIMESTAMP : null, completed: completed ? TIMESTAMP : null })
  return schedule.scheduleId
}

module.exports = {
  saveSchedule
}
