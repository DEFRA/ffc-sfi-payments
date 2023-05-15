jest.mock('../../../app/routing')
const { updateRequestsAwaitingManualLedgerCheck: mockUpdateRequestsAwaitingManualLedgerCheck } = require('../../../app/routing')

jest.mock('../../../app/event')
const { sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

const receiver = require('../../mocks/messaging/receiver')
const message = require('../../mocks/messaging/manual-ledger-check')

const { processManualLedgerCheckMessage } = require('../../../app/messaging/process-manual-ledger-check-message')

describe('process manual ledger check message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should update request data for matching manual ledger check message', async () => {
    await processManualLedgerCheckMessage(message, receiver)
    expect(mockUpdateRequestsAwaitingManualLedgerCheck).toHaveBeenCalledWith(message.body)
  })

  test('should complete message if successfully processed', async () => {
    await processManualLedgerCheckMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should send processing error event if unable to process manual ledger check message', async () => {
    const error = new Error('Test error')
    mockUpdateRequestsAwaitingManualLedgerCheck.mockRejectedValue(error)
    await processManualLedgerCheckMessage(message, receiver)
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledWith(message.body, error)
  })

  test('should not complete message if unable to process manual ledger check message', async () => {
    const error = new Error('Test error')
    mockUpdateRequestsAwaitingManualLedgerCheck.mockRejectedValue(error)
    await processManualLedgerCheckMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
