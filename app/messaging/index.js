const config = require('../config')
const { MessageReceiver } = require('ffc-messaging')
const processPaymentMessage = require('./process-payment-message')
const processAcknowledgementMessage = require('./process-acknowledgement-message')
const processReturnMessage = require('./process-return-message')
const processQualityCheckMessage = require('./process-quality-check-message')
const publishPendingPaymentRequests = require('./publish-pending-payment-requests')
const processDebtResponseMessage = require('./process-debt-response-message')
const paymentReceivers = []
let acknowledgementReceiver
let returnReceiver
let debtResponseReceiver
let qualityCheckReceiver

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

  const acknowledgementAction = message => processAcknowledgementMessage(message, acknowledgementReceiver)
  acknowledgementReceiver = new MessageReceiver(config.acknowledgementSubscription, acknowledgementAction)
  await acknowledgementReceiver.subscribe()

  const returnAction = message => processReturnMessage(message, returnReceiver)
  returnReceiver = new MessageReceiver(config.returnSubscription, returnAction)
  await returnReceiver.subscribe()

  const qualityCheckAction = message => processQualityCheckMessage(message, qualityCheckReceiver)
  qualityCheckReceiver = new MessageReceiver(config.qcSubscription, qualityCheckAction)
  await qualityCheckReceiver.subscribe()

  const debtResponseAction = message => processDebtResponseMessage(message, debtResponseReceiver)
  debtResponseReceiver = new MessageReceiver(config.debtResponseSubscription, debtResponseAction)
  await debtResponseReceiver.subscribe()
}

const stop = async () => {
  for (const paymentReceiver of paymentReceivers) {
    await paymentReceiver.closeConnection()
  }
  await acknowledgementReceiver.closeConnection()
  await returnReceiver.closeConnection()
  await qualityCheckReceiver.closeConnection()
  await debtResponseReceiver.closeConnection()
}

module.exports = { start, stop }
