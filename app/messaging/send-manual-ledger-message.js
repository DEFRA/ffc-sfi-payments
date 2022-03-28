const { MessageSender } = require('ffc-messaging')
const config = require('../config')

const sendManualLedgerMessage = async (paymentRequest) => {
  const sender = new MessageSender(config.manualTopic)
  await sender.sendMessage({ body: paymentRequest, type: 'uk.gov.pay.manual.check', source: 'ffc-pay-processing' })
  await sender.closeConnection()
}

module.exports = sendManualLedgerMessage
