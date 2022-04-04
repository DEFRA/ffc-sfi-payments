const util = require('util')
const updateRequestsAwaitingManualLedgerCheck = require('./update-requests-awaiting-manual-ledger-check')
const { sendProcessingErrorEvent } = require('../event')

const processManualLedgerCheckMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Payment request passing manual ledger check received:', util.inspect(paymentRequest, false, null, true))
    await updateRequestsAwaitingManualLedgerCheck(paymentRequest)
    await receiver.completeMessage(message)
    console.log('Processed manual ledger update', util.inspect(paymentRequest, false, null, true))
  } catch (err) {
    console.error('Unable to process manual ledger message:', err)
    await sendProcessingErrorEvent(message.body, err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processManualLedgerCheckMessage
