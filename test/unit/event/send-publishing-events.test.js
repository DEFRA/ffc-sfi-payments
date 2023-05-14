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

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-requests/payment-request')))
  paymentRequests = [paymentRequest, paymentRequest]

  processingConfig.useV1Events = true
  processingConfig.useV2Events = true
  messageConfig.eventTopic = 'v1-events'
  messageConfig.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 publishing events event', () => {
  test('should send V1 event if V1 events enabled', async () => {
    processingConfig.useV1Events = true
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents).toHaveBeenCalled()
  })

  test('should not send V1 event if V1 events disabled', async () => {
    processingConfig.useV1Events = false
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents).not.toHaveBeenCalled()
  })

  test('should send event to V1 topic', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(MockPublishEventBatch.mock.calls[0][0]).toBe(messageConfig.eventTopic)
  })
  test('should use correlation Id as Id', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0][0].properties.id).toBe(paymentRequests[0].correlationId)
  })

  test('should raise payment-request-processing event name', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0][0].name).toBe('payment-request-processing')
  })

  test('should raise success status event', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0][0].properties.status).toBe('success')
  })

  test('should raise error event type', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0][0].properties.action.type).toBe('info')
  })

  test('should include payment processed message in event', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0][0].properties.action.message).toBe('Payment request processed')
  })

  test('should include payment request in event', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0][0].properties.action.data).toEqual(paymentRequests[0])
  })

  test('should include event for each payment request', async () => {
    await sendPublishingEvents(paymentRequests)
    expect(mockSendEvents.mock.calls[0][0].length).toBe(2)
  })
})

describe('V2 publishing events', () => {
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
