const db = require('../data')
const { getPendingPaymentRequests } = require('./get-pending-payment-requests')
const { MessageBatchSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const { messageConfig } = require('../config')
const updatePendingPaymentRequests = require('./update-pending-payment-requests')
const util = require('util')
const { sendPublishingEvents, sendProcessingErrorEvent } = require('../event')

const publishPendingPaymentRequests = async (submitted = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    const paymentRequests = await getPendingPaymentRequests(transaction)
    if (paymentRequests.length) {
      const messages = paymentRequests.map(message => createMessage(message))
      const sender = new MessageBatchSender(messageConfig.submitTopic)
      await sender.sendBatchMessages(messages)
      await sender.closeConnection()
      await sendPublishingEvents(paymentRequests)
      await updatePendingPaymentRequests(paymentRequests, submitted, transaction)
      console.log('Payment requests processed:', util.inspect(messages.map(x => x.body), false, null, true))
    }
    await transaction.commit()
  } catch (error) {
    await sendProcessingErrorEvent(null, error)
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  publishPendingPaymentRequests
}
