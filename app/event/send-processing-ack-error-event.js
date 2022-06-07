const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')

const sendProcessingAckErrorEvent = async (acknowledgement) => {
  const event = {
    id: uuidv4(),
    name: 'payment-request-acknowledged-error',
    type: 'error',
    message: 'Payment request acknowledged errored in DAX',
    data: { acknowledgement }
  }
  await raiseEvent(event)
}

module.exports = sendProcessingAckErrorEvent
