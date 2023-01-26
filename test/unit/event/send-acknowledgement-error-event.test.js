jest.mock('../../../app/event/send-processing-ack-error-event')
const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

jest.mock('../../../app/event/send-processing-ack-invalid-bank-details-error-event')
const sendProcessingAckInvalidBankDetailsErrorEvent = require('../../../app/event/send-processing-ack-invalid-bank-details-error-event')

const sendAcknowledgementErrorEvent = require('../../../app/event/send-acknowledgement-error-event')

const mockFRN = require('../../mock-frn')

let mockAcknowledgementError
let mockHoldCategoryNameDR
let mockHoldCategoryNameBAA

describe('send acknowledgement event', () => {
  beforeEach(() => {
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mock-acknowledgement-error')))
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
