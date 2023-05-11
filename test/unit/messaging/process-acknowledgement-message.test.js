jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/acknowledgement')
const { processAcknowledgement: mockprocessAcknowledgement } = require('../../../app/acknowledgement')
const { processAcknowledgementMessage } = require('../../../app/messaging/process-acknowledgement-message')
let receiver

describe('process acknowledgement message', () => {
  beforeEach(() => {
    receiver = {
      completeMessage: jest.fn()
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

  test('does not complete if error message', async () => {
    mockprocessAcknowledgement.mockImplementation(() => {
      throw new Error()
    })
    const message = {
      body: {
        frn: 1234567890
      }
    }
    await processAcknowledgementMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalledWith(message)
  })
})
