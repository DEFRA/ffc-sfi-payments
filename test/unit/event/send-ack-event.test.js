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
const { getPaymentRequestByInvoiceAndFrn } = require('../../../app/processing/get-payment-request-by-invoice-frn')
jest.mock('../../../app/config')
const { processingConfig, messageConfig } = require('../../../app/config')

const { PAYMENT_ACKNOWLEDGED } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')

const { sendAckEvent } = require('../../../app/event/send-ack-event')

let paymentRequest
let acknowledgement

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-requests/payment-request')))
  acknowledgement = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement')))

  getPaymentRequestByInvoiceAndFrn.mockResolvedValue(paymentRequest)

  processingConfig.useV1Events = true
  processingConfig.useV2Events = true
  messageConfig.eventTopic = 'v1-events'
  messageConfig.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 ack event', () => {
  test('should send V1 event if V1 events enabled', async () => {
    processingConfig.useV1Events = true
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event if V1 events disabled', async () => {
    processingConfig.useV1Events = false
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send event to V1 topic', async () => {
    await sendAckEvent(acknowledgement)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(messageConfig.eventTopic)
  })

  test('should generate a new uuid as Id if payment request does not have correlation Id', async () => {
    paymentRequest.correlationId = undefined
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  })

  test('should raise payment-request-acknowledged event name', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-acknowledged')
  })

  test('should raise success status event', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise error event type', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('info')
  })

  test('should include ack message in event', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request acknowledged by DAX')
  })

  test('should include acknowledgement in event', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data).toEqual(acknowledgement)
  })
})

describe('V2 ack event', () => {
  test('should send V2 event if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendAckEvent(acknowledgement)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendAckEvent(acknowledgement)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send event to V2 topic', async () => {
    await sendAckEvent(acknowledgement)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should raise an event with processing source', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise acknowledged payment event type', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_ACKNOWLEDGED)
  })

  test('should include payment request in event data', async () => {
    await sendAckEvent(acknowledgement)
    expect(mockPublishEvent.mock.calls[0][0].data).toEqual(paymentRequest)
  })
})
