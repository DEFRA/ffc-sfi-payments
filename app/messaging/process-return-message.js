const updateSettlementStatus = require('../settlement')
const util = require('util')

const processReturnMessage = async (message, receiver) => {
  try {
    console.log('Return data received:', util.inspect(message.body, false, null, true))
    await updateSettlementStatus(message.body)
    await receiver.completeMessage(message)
    console.log('Settlement statuses updated from return file')
  } catch (err) {
    console.error('Unable to process return request:', err)
  }
}

module.exports = processReturnMessage
