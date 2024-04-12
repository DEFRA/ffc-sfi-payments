const db = require('../../data')
const { getScheduledPaymentRequests } = require('./get-scheduled-payment-requests')
const { removePending } = require('./remove-pending')
const { removeDuplicates } = require('./remove-duplicates')
const { updateScheduled } = require('./update-scheduled')

const getPaymentRequests = async (started = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getScheduledPaymentRequests(started, transaction)
    const paymentRequestsWithoutPending = await removePending(paymentRequests, started, transaction)
    const uniquePaymentRequests = removeDuplicates(paymentRequestsWithoutPending)
    await updateScheduled(uniquePaymentRequests, started, transaction)
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
