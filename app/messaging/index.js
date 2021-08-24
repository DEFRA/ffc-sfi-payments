const config = require('../config')
const processPaymentMessage = require('./process-payment-message')
const { MessageReceiver } = require('ffc-messaging')
const publishPendingPaymentRequests = require('./publish-pending-payment-requests')
const paymentReceivers = []

const start = async () => {
  for (let i = 0; i < config.processingSubscription.numberOfReceivers; i++) {
    let paymentReceiver  // eslint-disable-line
    const paymentAction = message => processPaymentMessage(message, paymentReceiver)
    paymentReceiver = new MessageReceiver(config.processingSubscription, paymentAction)
    paymentReceivers.push(paymentReceiver)
    await paymentReceiver.subscribe()
    console.info(`Receiver ${i + 1} ready to receive payment requests`)
  }
  setInterval(() => publishPendingPaymentRequests(), config.paymentRequestPublishingInterval)
  console.info('Ready to publish payment requests')
}

const stop = async () => {
  for (const paymentReceiver of paymentReceivers) {
    await paymentReceiver.closeConnection()
  }
}

module.exports = { start, stop }
