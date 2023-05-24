jest.mock('../../../app/acknowledgement')
const { processAcknowledgement: mockProcessAcknowledgement } = require('../../../app/acknowledgement')

jest.mock('../../../app/event')
const { sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/acknowledgement')

const { processAcknowledgementMessage } = require('../../../app/messaging/process-acknowledgement-message')

describe('process acknowledgement message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should process acknowledgement message', async () => {
    await processAcknowledgementMessage(message, receiver)
    expect(mockProcessAcknowledgement).toHaveBeenCalledWith(message.body)
  })

  test('should complete message if successfully processed', async () => {
    await processAcknowledgementMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should send processing error event if unable to process acknowledgement', async () => {
    const error = new Error('Test error')
    mockProcessAcknowledgement.mockRejectedValue(error)
    await processAcknowledgementMessage(message, receiver)
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledWith(message.body, error)
  })

  test('should not complete message if unable to process acknowledgement', async () => {
    const error = new Error('Test error')
    mockProcessAcknowledgement.mockRejectedValue(error)
    await processAcknowledgementMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
