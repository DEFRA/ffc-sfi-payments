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
const { processingConfig, messageConfig } = require('../../../app/config')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const { sendAcknowledgementErrorEvent } = require('../../../app/event/send-acknowledgement-error-event')

let paymentRequest
let acknowledgement
let holdCategoryNameDR
let holdCategoryNameBAA
const frn = require('../../mocks/frn')

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-request')))
  acknowledgement = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement-error')))
  holdCategoryNameDR = JSON.parse(JSON.stringify(require('../../../app/constants/hold-categories-names'))).DAX_REJECTION
  holdCategoryNameBAA = JSON.parse(JSON.stringify(require('../../../app/constants/hold-categories-names'))).BANK_ACCOUNT_ANOMALY

  getPaymentSchemeByInvoiceAndFrn.mockResolvedValue(paymentRequest)

  processingConfig.useV1Events = true
  processingConfig.useV2Events = true
  messageConfig.eventTopic = 'v1-events'
  messageConfig.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 acknowledgment error event', () => {
  test('should send V1 event for DAX rejection if V1 events enabled', async () => {
    processingConfig.useV1Events = true
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should send V1 event for bank account anomaly if V1 events enabled', async () => {
    processingConfig.useV1Events = true
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event for DAX rejection if V1 events disabled', async () => {
    processingConfig.useV1Events = false
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should not send V1 event for bank account anomaly if V1 events disabled', async () => {
    processingConfig.useV1Events = false
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send DAX rejection event to V1 topic', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(messageConfig.eventTopic)
  })

  test('should send bank account anomaly event to V1 topic', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(messageConfig.eventTopic)
  })

  test('should raise a DAX rejection event with new Id', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  test('should raise a bank account anomaly event with new Id', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  test('should raise DAX rejection event with payment-request-acknowledged-error event name', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-acknowledged-error')
  })

  test('should raise bank account anomaly event with invalid-bank-details event name', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('invalid-bank-details')
  })

  test('should raise success status event for DAX rejection', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise success status event for bank account anomaly', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise error event type for DAX rejection', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('error')
  })

  test('should raise error event type for bank account anomaly', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('error')
  })

  test('should raise DAX rejection message for DAX rejection', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request acknowledged errored in DAX')
  })

  test('should raise no valid bank details message for bank account anomaly', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('No valid bank details held')
  })

  test('should include acknowledgement in event data for DAX rejection', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.acknowledgement).toEqual(acknowledgement)
  })

  test('should include FRN in event data for bank account anomaly', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.frn).toEqual(frn)
  })
})

describe('V2 acknowledgement error event', () => {
  test('should send V2 event for DAX rejection if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should send V2 event for bank account anomaly if V2 events enabled', async () => {
    processingConfig.useV2Events = true
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event for DAX rejection if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should not send V2 event for bank account anomaly if V2 events disabled', async () => {
    processingConfig.useV2Events = false
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send DAX rejection event to V2 topic', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should send bank account anomaly event to V2 topic', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(messageConfig.eventsTopic)
  })

  test('should raise DAX rejection event with processing source', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise bank account anomaly event with processing source', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise DAX rejected event type for DAX rejection', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_DAX_REJECTED)
  })

  test('should raise payment invalid bank event type for bank account anomaly', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_INVALID_BANK)
  })

  test('should include payment request rejected message from DAX for DAX rejection', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameDR, acknowledgement, frn)
    expect(mockPublishEvent.mock.calls[0][0].data.message).toEqual(acknowledgement.message)
  })

  test('should include no valid bank details message for bank account anomaly', async () => {
    await sendAcknowledgementErrorEvent(holdCategoryNameBAA, acknowledgement, frn)
    expect(mockPublishEvent.mock.calls[0][0].data.message).toEqual('No valid bank details held')
  })
})
