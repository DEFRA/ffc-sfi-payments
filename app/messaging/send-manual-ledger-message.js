const { MessageSender } = require('ffc-messaging')
const { messageConfig } = require('../config')

const sendManualLedgerMessage = async (paymentRequest) => {
  const sender = new MessageSender(messageConfig.manualTopic)
  await sender.sendMessage({ body: paymentRequest, type: 'uk.gov.defra.ffc.pay.manual.check', source: 'ffc-pay-processing' })
  await sender.closeConnection()
}

module.exports = {
  sendManualLedgerMessage
}
