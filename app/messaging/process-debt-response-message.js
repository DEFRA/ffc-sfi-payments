const util = require('util')
const { VALIDATION } = require('../errors')
const updateRequestsAwaitingDebtData = require('./update-requests-awaiting-debt-data')

const processDebtResponseMessage = async (message, receiver) => {
  try {
    const debtData = message.body
    console.log('Debt enrichment data provided:', util.inspect(debtData, false, null, true))
    await updateRequestsAwaitingDebtData(debtData)
    await receiver.completeMessage(message)
    console.log('Processed quality check update', util.inspect(debtData, false, null, true))
  } catch (err) {
    console.error('Unable to process quality check message:', err)
    if (err.category === VALIDATION) {
      await receiver.deadLetterMessage(message)
    }
  }
}

module.exports = processDebtResponseMessage
