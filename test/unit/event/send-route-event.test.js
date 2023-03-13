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
const config = require('../../../app/config')
const { PAYMENT_PAUSED_PREFIX } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const sendRouteEvent = require('../../../app/event/send-route-event')

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

  config.useV1Events = true
  config.useV2Events = true
  config.eventTopic = 'v1-events'
  config.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 route event', () => {
  test('should send V1 event for debt routing if V1 events enabled', async () => {
    config.useV1Events = true
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should send V1 event for ledger routing if V1 events enabled', async () => {
    config.useV1Events = true
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event for debt routing if V1 events disabled', async () => {
    config.useV1Events = false
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should not send V1 event for ledger routing if V1 events disabled', async () => {
    config.useV1Events = false
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send debt routing event to V1 topic', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should send ledger routing event to V1 topic', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should raise a debt routing event with new id', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  test('should raise a ledger routing event with new Id', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(paymentRequest.correlationId)
  })

  test('should raise debt routing event with payment-request-debt-request event name if request', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-debt-request')
  })

  test('should raise debt routing event with payment-request-debt-response event name if response', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeResponse)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-debt-response')
  })

  test('should raise ledger routing event with payment-request-manual-ledger-request event name if request', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-manual-ledger-request')
  })

  test('should raise ledger routing event with payment-request-manual-ledger-response event name if response', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeResponse)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-manual-ledger-response')
  })

  test('should raise success status event for debt routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise success status event for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise error event type for debt routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('info')
  })

  test('should raise error event type for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('info')
  })

  test('should raise debt routing message for debt routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request routed to request editor')
  })

  test('should raise no valid bank details message for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request routed to request editor')
  })

  test('should include paymentRequest, routeLocationLedger, routeTypeRequest in event data for debt routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data).toMatchObject(paymentRequest, routeLocationLedger, routeTypeRequest)
  })

  test('should include payment request number in event data for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.paymentRequestNumber).toEqual(paymentRequest.paymentRequestNumber)
  })

  test('should include agreement number in event data for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.agreementNumber).toEqual(paymentRequest.agreementNumber)
  })
})

describe('V2 route event', () => {
  test('should send V2 event for debt routing if V2 events enabled', async () => {
    config.useV2Events = true
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should send V2 event for ledger routing if V2 events enabled', async () => {
    config.useV2Events = true
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event for debt routing if V2 events disabled', async () => {
    config.useV2Events = false
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should not send V2 event for ledger routing if V2 events disabled', async () => {
    config.useV2Events = false
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send debt routing event to V2 topic', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should send ledger routing event to V2 topic', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should not send event if response', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeResponse)
    expect(MockEventPublisher).not.toHaveBeenCalled()
  })

  test('should raise debt routing event with processing source', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise ledger routing event with processing source', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise debt route event type for debt routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationDebt, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(`${PAYMENT_PAUSED_PREFIX}.debt`)
  })

  test('should raise ledger route event type for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(`${PAYMENT_PAUSED_PREFIX}.ledger`)
  })

  test('should include payment request data for ledger routing', async () => {
    await sendRouteEvent(paymentRequest, routeLocationLedger, routeTypeRequest)
    expect(mockPublishEvent.mock.calls[0][0].data).toEqual(paymentRequest)
  })
})
