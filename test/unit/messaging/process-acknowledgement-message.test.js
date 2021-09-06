jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/acknowledgement')
const mockUpdateAcknowledgement = require('../../../app/acknowledgement')
const processAcknowledgementMessage = require('../../../app/messaging/process-acknowledgement-message')
let receiver

describe('process acknowledgement message', () => {
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
    await processAcknowledgementMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('dead letters invalid message', async () => {
    mockUpdateAcknowledgement.mockImplementation(() => {
      throw new Error()
    })
    const message = {
      body: {
        frn: 1234567890
      }
    }
    await processAcknowledgementMessage(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
