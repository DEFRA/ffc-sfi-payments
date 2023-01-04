const sendInvalidBankDetailsEvent = require('./send-invalid-bank-details-event')
const sendProcessingAckErrorEvent = require('./send-processing-ack-error-event')

const sendAcknowledgementEvent = async (holdCategoryName, acknowledgement, frn) => {
  if (holdCategoryName === 'Bank account anomaly') {
    await sendInvalidBankDetailsEvent(frn)
  } else {
    await sendProcessingAckErrorEvent(acknowledgement)
  }
}

module.exports = sendAcknowledgementEvent
