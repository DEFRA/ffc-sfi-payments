jest.mock('../../../app/inbound')
const { savePaymentRequest: mockSavePaymentRequest } = require('../../../app/inbound')

jest.mock('../../../app/event')
const { sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/payment')

const { processPaymentMessage } = require('../../../app/messaging/process-payment-message')

describe('process payment message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should save payment request', async () => {
    await processPaymentMessage(message, receiver)
    expect(mockSavePaymentRequest).toHaveBeenCalledWith(message.body)
  })

  test('should complete message if successfully processed', async () => {
    await processPaymentMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should send processing error event if unable to process payment request', async () => {
    const error = new Error('Test error')
    mockSavePaymentRequest.mockRejectedValue(error)
    await processPaymentMessage(message, receiver)
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledWith(message.body, error)
  })

  test('should not complete message if unable to process payment request', async () => {
    const error = new Error('Test error')
    mockSavePaymentRequest.mockRejectedValue(error)
    await processPaymentMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
