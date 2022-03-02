const db = require('../../../app/data')
const processManualLedgerCheckMessage = require('../../../app/messaging/process-manual-ledger-check-message')
let receiver
let message

describe('process manual ledger check message', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }

    message = {
      body: {
        invoiceNumber: 'SFI12345678S1234567V002'
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should complete valid message', async () => {
    await processManualLedgerCheckMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalled()
  })
})
