const { MessageSender } = require('ffc-messaging')
const { messageConfig } = require('../config')
const util = require('util')

const sendDebtMessage = async (paymentRequest) => {
  const sender = new MessageSender(messageConfig.debtTopic)
  await sender.sendMessage({ body: paymentRequest, type: 'uk.gov.defra.ffc.pay.debt', source: 'ffc-pay-processing' })
  await sender.closeConnection()
  console.log('Payment request sent for debt data:', util.inspect(paymentRequest, false, null, true))
}

module.exports = {
  sendDebtMessage
}
