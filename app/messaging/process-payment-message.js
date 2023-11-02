const util = require('util')
const { savePaymentRequest } = require('../inbound')
const { sendProcessingErrorEvent } = require('../event')

const processPaymentMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request received:', util.inspect(paymentRequest, false, null, true))
    await savePaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
    console.log('Payment request saved for processing')
  } catch (err) {
    await sendProcessingErrorEvent(message.body, err)
    console.error('Unable to process payment request:', err)
  }
}

module.exports = {
  processPaymentMessage
}
