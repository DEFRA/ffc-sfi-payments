const { Given, When, Then, Before, setDefaultTimeout } = require('@cucumber/cucumber')
const { sendMessage, messageReciever, clearSubscription } = require('../../support/message-service')
const config = require('../../support/config')
const request = require('../../fixtures/payment-request')
const __ = require('hamjest')

setDefaultTimeout(60 * 1000)

Before({ name: 'Clear topic to ensure clean test run' }, async () => {
  await clearSubscription(config.processingSubscription)
  await clearSubscription(config.submitTopic)
})

Given('a payment request is received', async () => {
  await sendMessage(request)
})

When('the payment request is completed', () => {
  // Syntatic sugar
})

Then('the completed payment request should contain:', async (dataTable) => {
  const values = dataTable.rowsHash()
  const messages = await messageReciever()

  const expectedFields = {
    sourceSystem: values.scheme,
    ledger: values.ledger,
    invoiceLines: [
      {
        accountCode: values.accountCode
      }]
  }
  __.assertThat(messages.length, __.greaterThan(0))

  messages.forEach(x => {
    __.assertThat(x, __.hasDeepProperties(expectedFields))
  })
})
