const db = require('../data')
const getPendingPaymentRequests = require('./get-pending-payment-requests')
const { MessageBatchSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const config = require('../config')
const updatePendingPaymentRequests = require('./update-pending-payment-requests')

const publishPendingPaymentRequests = async (submitted = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getPendingPaymentRequests(transaction)
    const messages = paymentRequests.map(message => createMessage(message))
    const sender = new MessageBatchSender(config.submitTopic)
    await sender.sendBatchMessages(messages)
    await sender.closeConnection()
    await updatePendingPaymentRequests(paymentRequests, submitted, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = publishPendingPaymentRequests
