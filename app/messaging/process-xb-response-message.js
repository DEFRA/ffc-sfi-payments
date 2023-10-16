const util = require('util')
const { sendProcessingErrorEvent } = require('../event')

const processXbResponseMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request returned from Cross Border Payment Engine received:', util.inspect(paymentRequest, false, null, true))
    await receiver.completeMessage(message)
    console.log('Processed cross border update', util.inspect(paymentRequest, false, null, true))
  } catch (err) {
    console.error('Unable to process cross border message:', err)
    await sendProcessingErrorEvent(message.body, err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processXbResponseMessage
}
