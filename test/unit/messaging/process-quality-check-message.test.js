jest.mock('../../../app/routing')
const { updateRequestsAwaitingDebtData: mockUpdateRequestsAwaitingDebtData } = require('../../../app/routing')

jest.mock('../../../app/event')
const { sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/message')

const { VALIDATION } = require('../../../app/constants/errors')

const { processQualityCheckMessage } = require('../../../app/messaging/process-quality-check-message')

describe('process quality check message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should update request data for matching quality check message', async () => {
    await processQualityCheckMessage(message, receiver)
    expect(mockUpdateRequestsAwaitingDebtData).toHaveBeenCalledWith(message.body)
  })

  test('should complete message if successfully processed', async () => {
    await processQualityCheckMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should send processing error event if unable to process quality check message', async () => {
    const error = new Error('Test error')
    mockUpdateRequestsAwaitingDebtData.mockRejectedValue(error)
    await processQualityCheckMessage(message, receiver)
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledWith(message.body, error)
  })

  test('should not complete message if unable to process quality check message', async () => {
    const error = new Error('Test error')
    mockUpdateRequestsAwaitingDebtData.mockRejectedValue(error)
    await processQualityCheckMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should dead letter message if unable to process quality check message due to validation error', async () => {
    const error = new Error('Test error')
    error.category = VALIDATION
    mockUpdateRequestsAwaitingDebtData.mockRejectedValue(error)
    await processQualityCheckMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('should not dead letter message if unable to process quality check message due to non-validation error', async () => {
    const error = new Error('Test error')
    mockUpdateRequestsAwaitingDebtData.mockRejectedValue(error)
    await processQualityCheckMessage(message, receiver)
    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
  })
})
