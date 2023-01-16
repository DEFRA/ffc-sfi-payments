const sendProcessingAckInvalidBankDetailsErrorEvent = require('./send-processing-ack-invalid-bank-details-error-event')
const sendProcessingAckErrorEvent = require('./send-processing-ack-error-event')

const sendAckowledgementErrorEvent = async (holdCategoryName, acknowledgement, frn) => {
  if (holdCategoryName === 'Bank account anomaly') {
    await sendProcessingAckInvalidBankDetailsErrorEvent(frn)
  } else {
    await sendProcessingAckErrorEvent(acknowledgement)
  }
}

module.exports = sendAckowledgementErrorEvent
