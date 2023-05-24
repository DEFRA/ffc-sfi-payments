const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()
const MockMessageSender = jest.fn().mockImplementation(() => {
  return {
    sendMessage: mockSendMessage,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: MockMessageSender
  }
})

jest.mock('../../../app/messaging/create-message')
const { createMessage: mockCreateMessage } = require('../../../app/messaging/create-message')

const message = require('../../mocks/messaging/message')
const paymentRequest = require('../../mocks/payment-requests/payment-request')

const { PROCESSING } = require('../../../app/constants/messages')

const { messageConfig } = require('../../../app/config')

const { sendMessage } = require('../../../app/messaging/send-message')

describe('send message', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockCreateMessage.mockReturnValue(message)
  })

  test('should create message from payment request and type', async () => {
    await sendMessage(paymentRequest, PROCESSING, messageConfig)
    expect(mockCreateMessage).toHaveBeenCalledWith(paymentRequest, PROCESSING)
  })

  test('should create new message sender', async () => {
    await sendMessage(paymentRequest, PROCESSING, messageConfig)
    expect(MockMessageSender).toHaveBeenCalledWith(messageConfig)
  })

  test('should send created message', async () => {
    await sendMessage(paymentRequest, PROCESSING, messageConfig)
    expect(mockSendMessage).toHaveBeenCalledWith(message)
  })

  test('should close connection after sending', async () => {
    await sendMessage(paymentRequest, PROCESSING, messageConfig)
    expect(mockCloseConnection).toHaveBeenCalled()
  })
})
