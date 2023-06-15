const mockSendEvents = jest.fn()
const mockPublishEvents = jest.fn()
const MockPublishEventBatch = jest.fn().mockImplementation(() => {
  return {
    sendEvents: mockSendEvents
  }
})
const MockEventPublisher = jest.fn().mockImplementation(() => {
  return {
    publishEvents: mockPublishEvents
  }
})
jest.mock('ffc-pay-event-publisher', () => {
  return {
    PublishEventBatch: MockPublishEventBatch,
    EventPublisher: MockEventPublisher
  }
})
jest.mock('../../../app/config')
const { processingConfig, messageConfig } = require('../../../app/config')

const { PAYMENT_PROCESSED } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')

const { sendPublishingEvents } = require('../../../app/event/send-publishing-events')

let paymentRequest
let paymentRequests

describe('V2 publishing events', () => {
  beforeEach(() => {
    paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-requests/payment-request')))
    paymentRequests = [paymentRequest, paymentRequest]

    processingConfig.useV2Events = true
    messageConfig.eventsTopic = 'v2-events'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should send V2 event if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendPublishingEvents(paymentRequests)
    expect(mockPublishEvents).toHaveBeenCalled()
  })

  test('should not send V2 event if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendPublishingEvents(paymentRequests)
    expect(mockPublishEvents).not.toHaveBeenCalled()
  })

  test('should send event to V2 topic', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should raise an event with processing source', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockPublishEvents.mock.calls[0][0][0].source).toBe(SOURCE)
  })

  test('should raise acknowledged payment event type', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockPublishEvents.mock.calls[0][0][0].type).toBe(PAYMENT_PROCESSED)
  })

  test('should include payment request in event data', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockPublishEvents.mock.calls[0][0][0].data).toEqual(paymentRequest)
  })

  test('should include event for each payment request', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockPublishEvents.mock.calls[0][0].length).toBe(2)
  })
})
