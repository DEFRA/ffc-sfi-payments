const util = require('util')
const updateRequestsAwaitingDebtData = require('./update-requests-awaiting-debt-data')

const processQualityCheckMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request passing quality check received:', util.inspect(paymentRequest, false, null, true))
    await updateRequestsAwaitingDebtData(paymentRequest)
    await receiver.completeMessage(message)
    console.log('Processed quality check update', util.inspect(paymentRequest, false, null, true))
  } catch (err) {
    console.error('Unable to process quality check message:', err)
    if (err.category === 'validation') {
      await receiver.deadLetterMessage(message)
    }
  }
}

module.exports = processQualityCheckMessage
