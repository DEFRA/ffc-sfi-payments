async function processWithdrawMessage (message, receiver) {
  try {
    console.info('Received request to withdraw payment')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processWithdrawMessage
