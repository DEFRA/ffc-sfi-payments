const raiseEvent = require('./raise-event')
const { v4: uuidv4 } = require('uuid')

const sendProcessingAckEvent = async (message, action) => {
  const event = {
    id: message?.correlationId ?? uuidv4(),
    name: `payment-request-${action}`,
    type: 'info',
    message: `Payment request ${action}`,
    data: message
  }
  await raiseEvent(event)
}

module.exports = sendProcessingAckEvent
