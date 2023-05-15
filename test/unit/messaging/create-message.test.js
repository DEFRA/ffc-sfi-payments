const paymentRequest = require('../../mocks/payment-requests/payment-request')

const { SOURCE } = require('../../../app/constants/source')
const { PROCESSING } = require('../../../app/constants/messages')

const { createMessage } = require('../../../app/messaging/create-message')

describe('create message', () => {
  test('should create a message with the correct body', () => {
    const message = createMessage(paymentRequest, PROCESSING)
    expect(message.body).toEqual(paymentRequest)
  })

  test('should create a message with the correct type', () => {
    const message = createMessage(paymentRequest, PROCESSING)
    expect(message.type).toEqual(PROCESSING)
  })

  test('should create a message with the correct source', () => {
    const message = createMessage(paymentRequest, PROCESSING)
    expect(message.source).toEqual(SOURCE)
  })
})
