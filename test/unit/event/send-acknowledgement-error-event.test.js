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
const { PAYMENT_ENRICHED } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const sendAcknowledgementErrorEvent = require('../../../app/event/send-acknowledgement-error-event')

let paymentRequest

beforeEach(() => {
  paymentRequest = JSON.parse(JSON.stringify(require('../../mocks/payment-request')))
  config.useV1Events = true
  config.useV2Events = true
  config.eventTopic = 'v1-events'
  config.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 enrichment event', () => {
  test('should send V1 event if V1 events enabled', async () => {
    config.useV1Events = true
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event if V1 events disabled', async () => {
    config.useV1Events = false
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send event to V1 topic', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should raise an event with payment request correlation Id as Id if exists', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toBe(paymentRequestComparison.paymentRequest.correlationId)
  })

  test('should raise payment-request-enrichment event name', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('payment-request-enrichment')
  })

  test('should raise success status event', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('success')
  })

  test('should raise info event type', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('info')
  })

  test('should raise payment request enriched message', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Payment request enriched')
  })

  test('should include original payment request in event data', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.originalPaymentRequest).toEqual(paymentRequestComparison.originalPaymentRequest)
  })

  test('should include enriched payment request in event data', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.paymentRequest).toEqual(paymentRequestComparison.paymentRequest)
  })
})

describe('V2 enrichment event', () => {
  test('should send V2 event if V2 events enabled', async () => {
    config.useV2Events = true
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event if V2 events disabled', async () => {
    config.useV2Events = false
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send event to V2 topic', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should raise an event with enrichment source', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise rejected payment event type', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(PAYMENT_ENRICHED)
  })

  test('should include payment request in event data', async () => {
    await sendAcknowledgementErrorEvent(paymentRequestComparison)
    expect(mockPublishEvent.mock.calls[0][0].data).toEqual(paymentRequestComparison.paymentRequest)
  })
})


jest.mock('../../../app/event/send-processing-ack-error-event')
const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

jest.mock('../../../app/event/send-processing-ack-invalid-bank-details-error-event')
const sendProcessingAckInvalidBankDetailsErrorEvent = require('../../../app/event/send-processing-ack-invalid-bank-details-error-event')

const sendAcknowledgementErrorEvent = require('../../../app/event/send-acknowledgement-error-event')

const mockFRN = require('../../mocks/frn')

let mockAcknowledgementError
let mockHoldCategoryNameDR
let mockHoldCategoryNameBAA

describe('send acknowledgement event', () => {
  beforeEach(() => {
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement-error')))
    mockHoldCategoryNameDR = JSON.parse(JSON.stringify(require('../../../app/constants/hold-categories-names'))).DAX_REJECTION
    mockHoldCategoryNameBAA = JSON.parse(JSON.stringify(require('../../../app/constants/hold-categories-names'))).BANK_ACCOUNT_ANOMALY
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should call sendProcessingAckErrorEvent', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckErrorEvent once', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckErrorEvent with the unsuccessful ack object', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledWith(mockAcknowledgementError)
  })

  test('should throw when sendProcessingAckErrorEvent throws', async () => {
    sendProcessingAckErrorEvent.mockRejectedValue(new Error())
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when sendProcessingAckErrorEvent throws', async () => {
    sendProcessingAckErrorEvent.mockRejectedValue(new Error())
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue proccessing acknowledgement error event" error when sendProcessingAckErrorEvent throws "Issue proccessing acknowledgement error event" error', async () => {
    sendProcessingAckErrorEvent.mockRejectedValue(new Error('Issue proccessing acknowledgement error event'))
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow(/^Issue proccessing acknowledgement error event$/)
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent once', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent with an frn', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalledWith(mockFRN)
  })

  test('should throw when sendProcessingAckInvalidBankDetailsErrorEvent throws', async () => {
    sendProcessingAckInvalidBankDetailsErrorEvent.mockRejectedValue(new Error())
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when sendProcessingAckInvalidBankDetailsErrorEvent throws', async () => {
    sendProcessingAckInvalidBankDetailsErrorEvent.mockRejectedValue(new Error())
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue proccessing invalid bank details error event" error when sendProcessingAckInvalidBankDetailsErrorEvent throws "Issue proccessing invalid bank details error event" error', async () => {
    sendProcessingAckInvalidBankDetailsErrorEvent.mockRejectedValue(new Error('Issue proccessing invalid bank details error event'))
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow(/^Issue proccessing invalid bank details error event$/)
  })
})
