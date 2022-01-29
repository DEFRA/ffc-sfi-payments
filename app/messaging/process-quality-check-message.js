const util = require('util')
const updateRequestsAwaitingEnrichment = require('./update-requests-awaiting-enrichment')

const processQualityCheckMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request passing quality check received:', util.inspect(paymentRequest, false, null, true))
    await updateRequestsAwaitingEnrichment(paymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process quality check message:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processQualityCheckMessage
