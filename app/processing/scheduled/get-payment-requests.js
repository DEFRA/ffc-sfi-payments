const db = require('../../data')
const { getScheduledPaymentRequests } = require('./get-scheduled-payment-requests')
const { removePending } = require('./remove-pending')
const { removeDuplicates } = require('./remove-duplicates')
const { updateScheduled } = require('./update-scheduled')
const { removeSchedules } = require('./remove-schedules')

const getPaymentRequests = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getScheduledPaymentRequests(started, transaction)
    await updateScheduled(paymentRequests, started, transaction)
    const paymentRequestsWithoutPending = await removePending(paymentRequests, started, transaction)
    const uniquePaymentRequests = removeDuplicates(paymentRequestsWithoutPending)
    await removeSchedules(paymentRequests, uniquePaymentRequests, transaction)
    await transaction.commit()
    return uniquePaymentRequests
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  getPaymentRequests
}
