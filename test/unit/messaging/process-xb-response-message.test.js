jest.mock('../../../app/event')
const { sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/return')

const { processXbResponseMessage } = require('../../../app/messaging/process-xb-response-message')

describe('process cross border response message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should complete message if successfully processed', async () => {
    await processXbResponseMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not dead letter message is successfully processed', async () => {
    await processXbResponseMessage(message, receiver)
    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
  })

  test('should send processing error event if unable to process message', async () => {
    const error = new Error('Test error')
    receiver.completeMessage.mockRejectedValue(error)
    await processXbResponseMessage(message, receiver)
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledWith(message.body, error)
  })
})
