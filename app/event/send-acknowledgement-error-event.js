const sendProcessingAckInvalidBankDetailsErrorEvent = require('./send-processing-ack-invalid-bank-details-error-event')
const sendProcessingAckErrorEvent = require('./send-processing-ack-error-event')
const { BANK_ACCOUNT_ANOMALY } = require('../constants/hold-categories-names')

const sendAcknowledgementErrorEvent = async (holdCategoryName, acknowledgement, frn) => {
  if (holdCategoryName === BANK_ACCOUNT_ANOMALY) {
    await sendProcessingAckInvalidBankDetailsErrorEvent(frn)
  } else {
    await sendProcessingAckErrorEvent(acknowledgement)
  }
}

module.exports = sendAcknowledgementErrorEvent
