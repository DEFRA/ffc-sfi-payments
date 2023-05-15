jest.mock('../../../app/settlement')
const { processSettlement: mockProcessSettlement } = require('../../../app/settlement')

jest.mock('../../../app/event')
const { sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/return')

const { processReturnMessage } = require('../../../app/messaging/process-return-message')

describe('process return message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockProcessSettlement.mockResolvedValue(true)
  })

  test('should process settlement', async () => {
    await processReturnMessage(message, receiver)
    expect(mockProcessSettlement).toHaveBeenCalledWith(message.body)
  })

  test('should complete message if successfully processed', async () => {
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should dead letter message if unable to match settlement to payment request', async () => {
    mockProcessSettlement.mockResolvedValue(false)
    await processReturnMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('should not dead letter message is successfully processed', async () => {
    await processReturnMessage(message, receiver)
    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
  })

  test('should send processing error event if unable to process settlement', async () => {
    const error = new Error('Test error')
    mockProcessSettlement.mockRejectedValue(error)
    await processReturnMessage(message, receiver)
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledWith(message.body, error)
  })

  test('should not complete message if unable to process settlement', async () => {
    const error = new Error('Test error')
    mockProcessSettlement.mockRejectedValue(error)
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
