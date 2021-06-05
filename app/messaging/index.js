const config = require('../config')
const processPaymentMessage = require('./process-payment-message')
const processWithdrawMessage = require('./process-withdraw-message')
const { MessageReceiver } = require('ffc-messaging')
let paymentApiReceiver
let paymentCalculatorReceiver
let withdrawApiReceiver
let withdrawCalculatorReceiver
let withdrawViewerReceiver

async function start () {
  const paymentApiAction = message => processPaymentMessage(message, paymentApiReceiver)
  paymentApiReceiver = new MessageReceiver(config.paymentApiSubscription, paymentApiAction)
  await paymentApiReceiver.subscribe()

  const paymentCalculatorAction = message => processPaymentMessage(message, paymentCalculatorReceiver)
  paymentCalculatorReceiver = new MessageReceiver(config.paymentCalculatorSubscription, paymentCalculatorAction)
  await paymentCalculatorReceiver.subscribe()

  const withdrawApiAction = message => processWithdrawMessage(message, withdrawApiReceiver)
  withdrawApiReceiver = new MessageReceiver(config.withdrawApiSubscription, withdrawApiAction)
  await withdrawApiReceiver.subscribe()

  const withdrawCalculatorAction = message => processWithdrawMessage(message, withdrawCalculatorReceiver)
  withdrawCalculatorReceiver = new MessageReceiver(config.withdrawCalculatorSubscription, withdrawCalculatorAction)
  await withdrawCalculatorReceiver.subscribe()

  const withdrawViewerAction = message => processWithdrawMessage(message, withdrawViewerReceiver)
  withdrawViewerReceiver = new MessageReceiver(config.withdrawViewerSubscription, withdrawViewerAction)
  await withdrawViewerReceiver.subscribe()

  console.info('Ready to receive messages')
}

async function stop () {
  await paymentApiReceiver.closeConnection()
  await paymentCalculatorReceiver.closeConnection()
  await withdrawApiReceiver.closeConnection()
  await withdrawCalculatorReceiver.closeConnection()
  await withdrawViewerReceiver.closeConnection()
}

module.exports = { start, stop }
