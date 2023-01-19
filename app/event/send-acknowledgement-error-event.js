const sendProcessingAckInvalidBankDetailsErrorEvent = require('./send-processing-ack-invalid-bank-details-error-event')
const sendProcessingAckErrorEvent = require('./send-processing-ack-error-event')
const getHoldCategoryName = require('../constants/hold-categories-names')

const sendAcknowledgementErrorEvent = async (holdCategoryName, acknowledgement, frn) => {
  if (holdCategoryName === getHoldCategoryName.BANK_ACCOUNT_ANOMALY) {
    await sendProcessingAckInvalidBankDetailsErrorEvent(frn)
  } else {
    await sendProcessingAckErrorEvent(acknowledgement)
  }
}

module.exports = sendAcknowledgementErrorEvent
