const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')

const sendProcessingAckEvent = async (message) => {
  const event = {
    id: message?.correlationId ?? uuidv4(),
    name: 'payment-request-acknowledged',
    type: 'info',
    message: 'Payment request acknowledged by DAX',
    data: message
  }
  await raiseEvent(event)
}

module.exports = sendProcessingAckEvent
