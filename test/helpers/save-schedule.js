const db = require('../../app/data')
const mockPaymentRequest = require('../mocks/payment-requests/payment-request')
const { savePaymentRequest } = require('./save-payment-request')

const saveSchedule = async (schedule, paymentRequest = mockPaymentRequest) => {
  const { id: paymentRequestId } = await savePaymentRequest(paymentRequest)
  const savedSchedule = await db.schedule.create({ ...schedule, paymentRequestId })
  return { scheduleId: savedSchedule.scheduleId, paymentRequestId }
}

module.exports = {
  saveSchedule
}
