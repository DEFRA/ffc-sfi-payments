const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')

const sendInvalidBankDetailsEvent = async (frn) => {
  const event = {
    id: uuidv4(),
    name: 'invalid-bank-details',
    type: 'error',
    message: 'No valid bank details held',
    data: { frn }
  }
  await raiseEvent(event)
  console.log('sent invalid bank details event')
}

module.exports = sendInvalidBankDetailsEvent
