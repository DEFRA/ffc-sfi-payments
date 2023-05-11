const util = require('util')
const { savePaymentRequest } = require('../inbound')

const processPaymentMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request received:', util.inspect(paymentRequest, false, null, true))
    await savePaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = {
  processPaymentMessage
}
