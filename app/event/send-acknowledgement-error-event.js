const sendAckInvalidBankDetailsErrorEvent = require('./send-ack-invalid-bank-details-error-event')
const sendAckErrorEvent = require('./send-ack-error-event')
const { BANK_ACCOUNT_ANOMALY } = require('../constants/hold-categories-names')

const sendAcknowledgementErrorEvent = async (holdCategoryName, acknowledgement, frn) => {
  if (holdCategoryName === BANK_ACCOUNT_ANOMALY) {
    await sendAckInvalidBankDetailsErrorEvent(frn)
  } else {
    await sendAckErrorEvent(acknowledgement)
  }
}

module.exports = sendAcknowledgementErrorEvent
