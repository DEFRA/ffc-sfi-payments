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
    jest.resetModules()
  })

  test('should call sendProcessingAckErrorEvent when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckErrorEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckErrorEvent with the unsuccessful ack object when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledWith(mockAcknowledgementError)
  })

  test('should throw error with "Issue proccessing acknowledgement error event" when sendProcessingAckErrorEvent throws error with "Issue proccessing acknowledgement error event"', async () => {
    sendProcessingAckErrorEvent.mockRejectedValue(new Error('Issue proccessing acknowledgement error event'))
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameDR, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow(/^Issue proccessing acknowledgement error event$/)
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent with an frn when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalledWith(mockFRN)
  })

  test('should throw error with "Issue proccessing invalid bank details error event" when sendProcessingAckInvalidBankDetailsErrorEvent throws error with "Issue proccessing invalid bank details error event"', async () => {
    sendProcessingAckInvalidBankDetailsErrorEvent.mockRejectedValue(new Error('Issue proccessing invalid bank details error event'))
    const wrapper = async () => {
      await sendAcknowledgementErrorEvent(mockHoldCategoryNameBAA, mockAcknowledgementError, mockFRN)
    }
    expect(wrapper).rejects.toThrow(/^Issue proccessing invalid bank details error event$/)
  })
})
