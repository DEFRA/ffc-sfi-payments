const { savePaymentRequest } = require('../inbound')

async function processPaymentMessage (message, receiver) {
  try {
    console.info('Received request for payment')
    await savePaymentRequest(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processPaymentMessage
