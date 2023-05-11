const mockSendEvent = jest.fn()
const mockPublishEvent = jest.fn()
const MockPublishEvent = jest.fn().mockImplementation(() => {
  return {
    sendEvent: mockSendEvent
  }
})
const MockEventPublisher = jest.fn().mockImplementation(() => {
  return {
    publishEvent: mockPublishEvent
  }
})
jest.mock('ffc-pay-event-publisher', () => {
  return {
    PublishEvent: MockPublishEvent,
    EventPublisher: MockEventPublisher
  }
})
jest.mock('../../../app/config')
const { processingConfig, messageConfig } = require('../../../app/config')
const { PAYMENT_PAUSED_PREFIX } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const { sendProcessingRouteEvent } = require('../../../app/event/send-route-event')

let paymentRequest
let routeLocationDebt
let routeLocationLedger
let routeTypeRequest
let routeTypeResponse

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-request')))

  routeLocationDebt = 'debt'
  routeLocationLedger = 'manual-ledger'
  routeTypeRequest = 'request'
  routeTypeResponse = 'response'

  processingConfig.useV1Events = true
  processingConfig.useV2Events = true
  messageConfig.eventTopic = 'v1-events'
  messageConfig.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 route event', () => {
  test('should send V1 event for debt routing if V1 events enabled', async () => {
    processingConfig.useV1Events = true
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should send V1 event for ledger routing if V1 events enabled', async () => {
    processingConfig.useV1Events = true
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event for debt routing if V1 events disabled', async () => {
    processingConfig.useV1Events = false
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should not send V1 event for ledger routing if V1 events disabled', async () => {
    processingConfig.useV1Events = false
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send debt routing event to V1 topic', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(messageConfig.eventTopic)
  })

  test('should send ledger routing event to V1 topic', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(messageConfig.eventTopic)
  })

  test('should raise a debt routing event with new id', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  test('should raise a ledger routing event with new Id', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(paymentRequest.correlationId)
  })

  test('should raise debt routing event with payment-request-debt-request event name if request', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-debt-request')
  })

  test('should raise debt routing event with payment-request-debt-response event name if response', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeResponse)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-debt-response')
  })

  test('should raise ledger routing event with payment-request-manual-ledger-request event name if request', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-manual-ledger-request')
  })

  test('should raise ledger routing event with payment-request-manual-ledger-response event name if response', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeResponse)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-manual-ledger-response')
  })

  test('should raise success status event for debt routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise success status event for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise error event type for debt routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('info')
  })

  test('should raise error event type for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('info')
  })

  test('should raise debt routing message for debt routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request routed to request editor')
  })

  test('should raise no valid bank details message for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request routed to request editor')
  })

  test('should include paymentRequest, routeLocationLedger, routeTypeRequest in event data for debt routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data).toMatchObject(paymentRequest, routeLocationLedger, routeTypeRequest)
  })

  test('should include payment request number in event data for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.paymentRequestNumber).toEqual(paymentRequest.paymentRequestNumber)
  })

  test('should include agreement number in event data for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.agreementNumber).toEqual(paymentRequest.agreementNumber)
  })
})

describe('V2 route event', () => {
  test('should send V2 event for debt routing if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should send V2 event for ledger routing if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event for debt routing if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should not send V2 event for ledger routing if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send debt routing event to V2 topic', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should send ledger routing event to V2 topic', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should not send event if response', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeResponse)
    expect(MockEventPublisher).not.toHaveBeenCalled()
  })

  test('should raise debt routing event with processing source', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise ledger routing event with processing source', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise debt route event type for debt routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(`${PAYMENT_PAUSED_PREFIX}.debt`)
  })

  test('should raise ledger route event type for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(`${PAYMENT_PAUSED_PREFIX}.ledger`)
  })

  test('should include payment request data for ledger routing', async () => {
    await sendProcessingRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].data).toEqual(paymentRequest)
  })
})
