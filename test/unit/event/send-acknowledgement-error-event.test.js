jest.mock('../../../app/event/send-processing-ack-error-event')
const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

jest.mock('../../../app/event/send-processing-ack-invalid-bank-details-error-event')
const sendProcessingAckInvalidBankDetailsErrorEvent = require('../../../app/event/send-processing-ack-invalid-bank-details-error-event')

const mockFRN = require('../../mock-frn')
const sendAckowledgementErrorEvent = require('../../../app/event/send-acknowledgement-error-event')

let mockAcknowledgementError
let mockHoldCategoryName

describe('send acknowledgement event', () => {
  beforeEach(() => {
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mock-acknowledgement-error')))
    mockHoldCategoryName = 'DAX rejection'
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should call sendProcessingAckErrorEvent when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAckowledgementErrorEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckErrorEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAckowledgementErrorEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckErrorEvent with the unsuccessful ack object when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "DAX rejection"', async () => {
    await sendAckowledgementErrorEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledWith(mockAcknowledgementError)
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    mockHoldCategoryName = 'Bank account anomaly'
    await sendAckowledgementErrorEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalled()
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent once when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    mockHoldCategoryName = 'Bank account anomaly'
    await sendAckowledgementErrorEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckInvalidBankDetailsErrorEvent with the unsuccessful ack object when a holdCategoryName, an unsuccessful ack object and frn is given and holdCategoryName is "Bank account anomaly"', async () => {
    mockHoldCategoryName = 'Bank account anomaly'
    await sendAckowledgementErrorEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    expect(sendProcessingAckInvalidBankDetailsErrorEvent).toHaveBeenCalledWith(mockFRN)
  })
})
