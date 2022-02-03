const { MessageSender } = require('ffc-messaging')
const config = require('../config')
const util = require('util')

const sendDebtMessage = async (paymentRequest) => {
  const sender = new MessageSender(config.debtTopic)
  await sender.sendMessage({ body: paymentRequest, type: 'uk.gov.pay.debt', source: 'ffc-pay-processing' })
  await sender.closeConnection()
  console.log('Payment request sent for debt data:', util.inspect(paymentRequest, false, null, true))
}

module.exports = sendDebtMessage
