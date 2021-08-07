const config = require('../config')
const processPaymentMessage = require('./process-payment-message')
const { MessageReceiver } = require('ffc-messaging')
let paymentReceiver

async function start () {
  const paymentAction = message => processPaymentMessage(message, paymentReceiver)
  paymentReceiver = new MessageReceiver(config.paymentSubscription, paymentAction)
  await paymentReceiver.subscribe()

  console.info('Ready to receive payment requests')
}

async function stop () {
  await paymentReceiver.closeConnection()
}

module.exports = { start, stop }
