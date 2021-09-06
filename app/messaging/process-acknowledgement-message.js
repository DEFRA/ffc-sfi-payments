const updateAcknowledgement = require('../acknowledgement')

const processAcknowledgementMessage = async (message, receiver) => {
  try {
    await updateAcknowledgement(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process acknowledgement request:', err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = processAcknowledgementMessage
