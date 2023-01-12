const mockFRN = require('../../mock-frn')
const sendAcknowledgementEvent = require('../../../app/event/send-acknowledgement-event')

jest.mock('../../../app/event/send-processing-ack-error-event')
const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

jest.mock('../../../app/event/send-invalid-bank-details-event')
const sendInvalidBankDetailsEvent = require('../../../app/event/send-invalid-bank-details-event')

let mockAcknowledgementError
let mockHoldCategoryName

describe('send acknowledgement event', () => {
  beforeEach(() => {
    mockAcknowledgementError = require('../../mock-acknowledgement-error')
    mockHoldCategoryName = 'DAX rejection'
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should call sendProcessingAckErrorEvent when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckErrorEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckErrorEvent with the unsuccessful ack object when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledWith(mockAcknowledgementError)
  })

  test('should call sendInvalidBankDetailsEvent when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    mockHoldCategoryName = 'Bank account anomaly'
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendInvalidBankDetailsEvent).toHaveBeenCalled()
  })

  test('should call sendInvalidBankDetailsEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    mockHoldCategoryName = 'Bank account anomaly'
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendInvalidBankDetailsEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendInvalidBankDetailsEvent with the unsuccessful ack object when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    mockHoldCategoryName = 'Bank account anomaly'
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendInvalidBankDetailsEvent).toHaveBeenCalledWith(mockFRN)
  })
})
