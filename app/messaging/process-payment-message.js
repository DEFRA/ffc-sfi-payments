const { savePaymentRequest } = require('../inbound')

async function processPaymentMessage (message, receiver) {
  try {
    await savePaymentRequest(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processPaymentMessage
