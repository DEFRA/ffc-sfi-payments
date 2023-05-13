const { MessageSender } = require('ffc-messaging')

const sendMessage = async (paymentRequest, type, config) => {
  const sender = new MessageSender(config)
  await sender.sendMessage({ body: paymentRequest, type, source: 'ffc-pay-processing' })
  await sender.closeConnection()
}

module.exports = {
  sendMessage
}
