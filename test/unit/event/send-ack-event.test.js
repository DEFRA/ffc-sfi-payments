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

describe('V2 ack event', () => {
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
