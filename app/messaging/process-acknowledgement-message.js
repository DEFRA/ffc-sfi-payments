const updateAcknowledgement = require('../acknowledgement')
const util = require('util')
const { sendProcessingErrorEvent, sendProcessingAckEvent } = require('../event')

const processAcknowledgementMessage = async (message, receiver) => {
  try {
    console.log('Acknowledgement received:', util.inspect(message.body, false, null, true))
    await updateAcknowledgement(message.body)
    await receiver.completeMessage(message)
    console.log('Acknowledgement processed')
    await sendProcessingAckEvent(message.body)
  } catch (err) {
    await sendProcessingErrorEvent(message.body, err)
    console.error('Unable to process acknowledgement request:', err)
  }
}

module.exports = processAcknowledgementMessage
