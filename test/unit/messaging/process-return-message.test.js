jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/settlement')
const mockUpdateSettlementStatus = require('../../../app/settlement')
const processReturnMessage = require('../../../app/messaging/process-return-message')
let receiver

describe('process return message', () => {
  beforeEach(() => {
    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('completes valid message', async () => {
    const message = {
      body: {
        frn: 1234567890
      }
    }
    await processReturnMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('dead letters invalid message', async () => {
    mockUpdateSettlementStatus.mockImplementation(() => {
      throw new Error()
    })
    const message = {
      body: {
        frn: 1234567890
      }
    }
    await processReturnMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
