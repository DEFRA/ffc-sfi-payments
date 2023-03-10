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
jest.mock('../../../app/processing/get-payment-request-by-invoice-frn')
const getPaymentSchemeByInvoiceAndFrn = require('../../../app/processing/get-payment-request-by-invoice-frn')
jest.mock('../../../app/config')
const config = require('../../../app/config')
const { PAYMENT_SETTLEMENT_UNMATCHED, PAYMENT_SETTLED } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const sendReturnEvent = require('../../../app/event/send-return-event')

let paymentRequest
let settlement

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-request')))
  settlement = JSON.parse(JSON.stringify(require('../../mocks/settlement')))

  getPaymentSchemeByInvoiceAndFrn.mockResolvedValue(paymentRequest)

  config.useV1Events = true
  config.useV2Events = true
  config.eventTopic = 'v1-events'
  config.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 acknowledgment error event', () => {
  test('should send V1 event for unmatched settlement if V1 events enabled', async () => {
    config.useV1Events = true
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should send V1 event for matched settlement if V1 events enabled', async () => {
    config.useV1Events = true
    await sendReturnEvent(settlement)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event for unmatched settlement if V1 events disabled', async () => {
    config.useV1Events = false
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should not send V1 event for matched settlement if V1 events disabled', async () => {
    config.useV1Events = false
    await sendReturnEvent(settlement)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send unmatched settlement event to V1 topic', async () => {
    await sendReturnEvent(settlement, true)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should send matched settlement event to V1 topic', async () => {
    await sendReturnEvent(settlement)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should raise a unmatched settlement event with new id', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  test('should raise a matched settlement event with new Id', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(paymentRequest.correlationId)
  })

  test('should raise unmatched settlement event with payment-request-return event name', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-return')
  })

  test('should raise matched settlement event with payment-request-return event name', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-return')
  })

  test('should raise success status event for unmatched settlement', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise success status event for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise error event type for unmatched settlement', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('error')
  })

  test('should raise error event type for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('return')
  })

  test('should raise unmatched settlement message for unmatched settlement', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Settlement received from DAX')
  })

  test('should raise no valid bank details message for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Settlement received from DAX')
  })

  test('should include settlement in event data for unmatched settlement', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data).toMatchObject(settlement)
  })

  test('should include payment request number in event data for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.paymentRequestNumber).toEqual(paymentRequest.paymentRequestNumber)
  })

  test('should include agreement number in event data for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.agreementNumber).toEqual(paymentRequest.agreementNumber)
  })
})

describe('V2 acknowledgement error event', () => {
  test('should send V2 event for unmatched settlement if V2 events enabled', async () => {
    config.useV2Events = true
    await sendReturnEvent(settlement, true)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should send V2 event for matched settlement if V2 events enabled', async () => {
    config.useV2Events = true
    await sendReturnEvent(settlement)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event for unmatched settlement if V2 events disabled', async () => {
    config.useV2Events = false
    await sendReturnEvent(settlement, true)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should not send V2 event for matched settlement if V2 events disabled', async () => {
    config.useV2Events = false
    await sendReturnEvent(settlement)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send unmatched settlement event to V2 topic', async () => {
    await sendReturnEvent(settlement, true)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should send matched settlement event to V2 topic', async () => {
    await sendReturnEvent(settlement)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should raise unmatched settlement event with processing source', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise matched settlement event with processing source', async () => {
    await sendReturnEvent(settlement)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise DAX rejected event type for unmatched settlement', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_SETTLEMENT_UNMATCHED)
  })

  test('should raise payment invalid bank event type for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_SETTLED)
  })

  test('should include payment request rejected message from DAX for unmatched settlement', async () => {
    await sendReturnEvent(settlement, true)
    expect(mockPublishEvent.mock.calls[0][0].data.message).toEqual('Unable to find payment request for settlement, Invoice: S123456789A123456V001, FRN: 1234567890')
  })

  test('should include payment request data for matched settlement', async () => {
    await sendReturnEvent(settlement)
    expect(mockPublishEvent.mock.calls[0][0].data).toEqual(paymentRequest)
  })
})
