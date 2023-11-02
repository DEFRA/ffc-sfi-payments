const util = require('util')
const { MessageBatchSender } = require('ffc-messaging')
const db = require('../data')
const { messageConfig } = require('../config')
const { getPendingPaymentRequests } = require('./get-pending-payment-requests')
const { createMessage } = require('../messaging/create-message')
const { sendPublishingEvents, sendProcessingErrorEvent } = require('../event')
const { updatePendingPaymentRequests } = require('./update-pending-payment-requests')
const { PROCESSED } = require('../constants/messages')

const publishPendingPaymentRequests = async (submitted = new Date()) => {
  const transaction = await db.sequelize.transaction()
  try {
    console.log('Getting pending payment requests for publishing')
    const paymentRequests = await getPendingPaymentRequests(transaction)
    console.log(`Got ${paymentRequests.length} pending payment requests for publishing`)
    if (paymentRequests.length) {
      const messages = paymentRequests.map(message => createMessage(message, PROCESSED))
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
