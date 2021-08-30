const updateSettlementStatus = require('../settlement')

const processReturnMessage = async (message, receiver) => {
  try {
    await updateSettlementStatus(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process return request:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processReturnMessage
