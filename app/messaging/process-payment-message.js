const savePaymentRequest = require('../inbound')
const util = require('util')
const raiseEvent = require('../event')

const processPaymentMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request received:', util.inspect(paymentRequest, false, null, true))
    await savePaymentRequest(paymentRequest)
    await receiver.completeMessage(message)
    await raiseEvent({ name: 'test', id: 'test', type: 'test', message: 'test', data: { id: 'test' } })
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = processPaymentMessage
