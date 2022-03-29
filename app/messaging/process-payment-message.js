const savePaymentRequest = require('../inbound')
const util = require('util')
const raiseEvent = require('../event')

const processPaymentMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request received:', util.inspect(paymentRequest, false, null, true))
    await savePaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
    await raiseEvent({ id: 'payment-request-received', name: 'Payment request received', type: 'info', message: 'Payment request received', data: paymentRequest })
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = processPaymentMessage
