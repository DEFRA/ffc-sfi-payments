const config = require('../config')
const processPaymentMessage = require('./process-payment-message')
const processWithdrawMessage = require('./process-withdraw-message')
const { MessageReceiver } = require('ffc-messaging')
let paymentReceiver
let withdrawReceiver

async function start () {
  const paymentAction = message => processPaymentMessage(message, paymentReceiver)
  paymentReceiver = new MessageReceiver(config.paymentSubscription, paymentAction)
  await paymentReceiver.subscribe()

  const withdrawAction = message => processWithdrawMessage(message, withdrawReceiver)
  withdrawReceiver = new MessageReceiver(config.withdrawSubscription, withdrawAction)
  await withdrawReceiver.subscribe()

  console.info('Ready to receive messages')
}

async function stop () {
  await paymentReceiver.closeConnection()
  await withdrawReceiver.closeConnection()
}

module.exports = { start, stop }
