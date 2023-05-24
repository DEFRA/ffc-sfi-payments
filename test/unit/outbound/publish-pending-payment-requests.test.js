const mockSendBatchMessages = jest.fn()
const mockCloseConnection = jest.fn()

const MockMessageBatchSender = jest.fn().mockImplementation(() => {
  return {
    sendBatchMessages: mockSendBatchMessages,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => ({
  MessageBatchSender: MockMessageBatchSender
}))

jest.mock('../../../app/outbound/get-pending-payment-requests')
const { getPendingPaymentRequests: mockGetPendingPaymentRequests } = require('../../../app/outbound/get-pending-payment-requests')

jest.mock('../../../app/messaging/create-message')
const { createMessage: mockCreateMessage } = require('../../../app/messaging/create-message')

jest.mock('../../../app/event')
const { sendPublishingEvents: mockSendPublishingEvents, sendProcessingErrorEvent: mockSendProcessingErrorEvent } = require('../../../app/event')

jest.mock('../../../app/outbound/update-pending-payment-requests')
const { updatePendingPaymentRequests: mockUpdatePendingPaymentRequests } = require('../../../app/outbound/update-pending-payment-requests')

const paymentRequest = require('../../mocks/payment-requests/payment-request')
const message = require('../../mocks/messaging/message')

const { messageConfig } = require('../../../app/config')
const db = require('../../../app/data')

const transactionSpy = jest.spyOn(db.sequelize, 'transaction')

const { publishPendingPaymentRequests } = require('../../../app/outbound/publish-pending-payment-requests')

describe('publish pending payment requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetPendingPaymentRequests.mockResolvedValue([paymentRequest, paymentRequest])
    mockCreateMessage.mockReturnValue(message)
  })

  test('should get all payments ready to publish', async () => {
    await publishPendingPaymentRequests()
    expect(mockGetPendingPaymentRequests).toHaveBeenCalledTimes(1)
  })

  test('should create message for each payment request', async () => {
    await publishPendingPaymentRequests()
    expect(mockCreateMessage).toHaveBeenCalledTimes(2)
  })

  test('should not create message if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(mockCreateMessage).toHaveBeenCalledTimes(0)
  })

  test('should create new message batch sender from submit configuration', async () => {
    await publishPendingPaymentRequests()
    expect(MockMessageBatchSender).toHaveBeenCalledWith(messageConfig.submitTopic)
  })

  test('should not create a new message batch sender if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(MockMessageBatchSender).toHaveBeenCalledTimes(0)
  })

  test('should send messages as a batch', async () => {
    await publishPendingPaymentRequests()
    expect(mockSendBatchMessages).toHaveBeenCalledWith([message, message])
  })

  test('should not send messages if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(mockSendBatchMessages).toHaveBeenCalledTimes(0)
  })

  test('should close connection after sending messages', async () => {
    await publishPendingPaymentRequests()
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })

  test('should not close connection if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(mockCloseConnection).toHaveBeenCalledTimes(0)
  })

  test('should send publishing events', async () => {
    await publishPendingPaymentRequests()
    expect(mockSendPublishingEvents).toHaveBeenCalledWith([paymentRequest, paymentRequest])
  })

  test('should not send publishing events if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(mockSendPublishingEvents).toHaveBeenCalledTimes(0)
  })

  test('should update payment requests as published', async () => {
    await publishPendingPaymentRequests()
    expect(mockUpdatePendingPaymentRequests).toHaveBeenCalledWith([paymentRequest, paymentRequest], expect.any(Date), expect.any(Object))
  })

  test('should not update payment requests if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(mockUpdatePendingPaymentRequests).toHaveBeenCalledTimes(0)
  })

  test('should commit transaction if payment requests', async () => {
    await publishPendingPaymentRequests()
    expect(transactionSpy).toHaveBeenCalledTimes(1)
  })

  test('should commit transaction if no payment requests', async () => {
    mockGetPendingPaymentRequests.mockResolvedValue([])
    await publishPendingPaymentRequests()
    expect(transactionSpy).toHaveBeenCalledTimes(1)
  })

  test('should send processing error event if error', async () => {
    mockGetPendingPaymentRequests.mockRejectedValue(new Error('Test error'))
    try {
      await publishPendingPaymentRequests()
    } catch {}
    expect(mockSendProcessingErrorEvent).toHaveBeenCalledTimes(1)
  })
})
