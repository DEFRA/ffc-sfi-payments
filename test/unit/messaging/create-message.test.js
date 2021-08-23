const createMessage = require('../../../app/messaging/create-message')

describe('create message', () => {
  test('sets payment request as body', () => {
    const paymentRequest = {
      frn: 1234567890
    }
    const message = createMessage(paymentRequest)
    expect(message.body).toEqual(paymentRequest)
  })

  test('sets type', () => {
    const paymentRequest = {
      frn: 1234567890
    }
    const message = createMessage(paymentRequest)
    expect(message.type).toEqual('uk.gov.sfi.payment.processed')
  })

  test('sets source', () => {
    const paymentRequest = {
      frn: 1234567890
    }
    const message = createMessage(paymentRequest)
    expect(message.source).toEqual('ffc-sfi-payments')
  })
})
