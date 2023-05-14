const util = require('util')
const { processSettlement } = require('../settlement')

const processReturnMessage = async (message, receiver) => {
  try {
    console.log('Return data received:', util.inspect(message.body, false, null, true))
    const settlementCompleted = await processSettlement(message.body)
    if (settlementCompleted) {
      await receiver.completeMessage(message)
      console.log('Settlement statuses updated from return file')
    } else {
      await receiver.deadLetterMessage(message)
      console.error('Unable to find settlement for payment request', message.body)
    }
  } catch (err) {
    console.error('Unable to process return request:', err)
  }
}

module.exports = {
  processReturnMessage
}
