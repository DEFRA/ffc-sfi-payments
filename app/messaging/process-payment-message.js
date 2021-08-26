const savePaymentRequest = require('../inbound')

const processPaymentMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    await savePaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processPaymentMessage
