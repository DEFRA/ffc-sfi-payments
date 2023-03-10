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
let routeLocation
let routeType

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-request')))
  settlement = JSON.parse(JSON.stringify(require('../../mocks/settlement')))


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
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should send V1 event for ledger routing if V1 events enabled', async () => {
    config.useV1Events = true
    await sendRouteEvent(settlement)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event for debt routing if V1 events disabled', async () => {
    config.useV1Events = false
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should not send V1 event for ledger routing if V1 events disabled', async () => {
    config.useV1Events = false
    await sendRouteEvent(settlement)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send debt routing event to V1 topic', async () => {
    await sendRouteEvent(settlement, true)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should send ledger routing event to V1 topic', async () => {
    await sendRouteEvent(settlement)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should raise a debt routing event with new id', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  test('should raise a ledger routing event with new Id', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(paymentRequest.correlationId)
  })

  test('should raise debt routing event with payment-request-return event name', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-return')
  })

  test('should raise ledger routing event with payment-request-return event name', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-return')
  })

  test('should raise success status event for debt routing', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise success status event for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise error event type for debt routing', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('error')
  })

  test('should raise error event type for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('return')
  })

  test('should raise debt routing message for debt routing', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Settlement received from DAX')
  })

  test('should raise no valid bank details message for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Settlement received from DAX')
  })

  test('should include settlement in event data for debt routing', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data).toMatchObject(settlement)
  })

  test('should include payment request number in event data for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.paymentRequestNumber).toEqual(paymentRequest.paymentRequestNumber)
  })

  test('should include agreement number in event data for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.agreementNumber).toEqual(paymentRequest.agreementNumber)
  })
})

describe('V2 route event', () => {
  test('should send V2 event for debt routing if V2 events enabled', async () => {
    config.useV2Events = true
    await sendRouteEvent(settlement, true)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should send V2 event for ledger routing if V2 events enabled', async () => {
    config.useV2Events = true
    await sendRouteEvent(settlement)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event for debt routing if V2 events disabled', async () => {
    config.useV2Events = false
    await sendRouteEvent(settlement, true)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should not send V2 event for ledger routing if V2 events disabled', async () => {
    config.useV2Events = false
    await sendRouteEvent(settlement)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send debt routing event to V2 topic', async () => {
    await sendRouteEvent(settlement, true)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should send ledger routing event to V2 topic', async () => {
    await sendRouteEvent(settlement)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should raise debt routing event with processing source', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise ledger routing event with processing source', async () => {
    await sendRouteEvent(settlement)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise DAX rejected event type for debt routing', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_SETTLEMENT_UNMATCHED)
  })

  test('should raise payment invalid bank event type for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_SETTLED)
  })

  test('should include payment request rejected message from DAX for debt routing', async () => {
    await sendRouteEvent(settlement, true)
    expect(mockPublishEvent.mock.calls[0][0].data.message).toEqual('Unable to find payment request for settlement, Invoice: S123456789A123456V001, FRN: 1234567890')
  })

  test('should include payment request data for ledger routing', async () => {
    await sendRouteEvent(settlement)
    expect(mockPublishEvent.mock.calls[0][0].data).toEqual(paymentRequest)
  })
})
