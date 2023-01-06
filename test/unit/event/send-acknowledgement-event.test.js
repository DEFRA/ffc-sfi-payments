jest.mock('../../../app/config')
const mockConfig = require('../../../app/config')

const mockFRN = require('../../mock-frn')

jest.mock('../../../app/event')
const mockEvent = require('../../../app/event')

// jest.mock('../../../app/acknowledgement/acknowledge-payment-request')
// const acknowledgePaymentRequest = require('../../../app/acknowledgement/acknowledge-payment-request')

const sendAcknowledgementEvent = require('../../../app/event/send-acknowledgement-event')

jest.mock('../../../app/event/send-processing-ack-error-event')
const sendProcessingAckErrorEvent = require('../../../app/event/send-processing-ack-error-event')

// jest.mock('../../../app/acknowledgement/process-invalid')
// const processInvalid = require('../../../app/acknowledgement/process-invalid')

let mockAcknowledgement
let mockAcknowledgementError
let mockHoldCategoryName

describe('send acknowledgement event', () => {
  beforeEach(() => {
    mockConfig.isAlerting = true

    mockAcknowledgement = require('../../mock-acknowledgement')
    mockAcknowledgementError = require('../../mock-acknowledgement-error')
    
    mockHoldCategoryName = 'DAX rejection'
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
  /*
  test('should call sendProcessingAckErrorEvent when an unsuccessful ack object is given and isAlerting is true', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(mockEvent.sendProcessingAckErrorEvent).toHaveBeenCalled()
  })
  */
  test('should call sendProcessingAckErrorEvent when an unsuccessful ack object is given and holdCategoryName is DAX rejection', async () => {
    await sendAcknowledgementEvent(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
    // expect(sendProcessingAckErrorEvent).toHaveBeenCalled()
    expect(sendProcessingAckErrorEvent).toHaveBeenCalledWith(mockAcknowledgementError)
  })
  /*
    test('should call sendProcessingAckErrorEvent once when an unsuccessful ack object is given and isAlerting is true', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(mockEvent.sendProcessingAckErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendProcessingAckErrorEvent with the unsuccessful ack object when an unsuccessful ack object is given and isAlerting is true', async () => {
    await updateAcknowledgement(mockAcknowledgementError)
    expect(mockEvent.sendProcessingAckErrorEvent).toHaveBeenCalledWith(mockAcknowledgementError)
  })

  test('should not call sendProcessingAckErrorEvent with the unsuccessful ack object when an unsuccessful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await updateAcknowledgement(mockAcknowledgementError)
    expect(mockEvent.sendProcessingAckErrorEvent).not.toHaveBeenCalled()
  })

  test('should not call sendProcessingAckErrorEvent when a successful ack object is given and isAlerting is true', async () => {
    await updateAcknowledgement(mockAcknowledgement)
    expect(mockEvent.sendProcessingAckErrorEvent).not.toHaveBeenCalled()
  })

  test('should not call sendProcessingAckErrorEvent when a successful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await updateAcknowledgement(mockAcknowledgement)
    expect(mockEvent.sendProcessingAckErrorEvent).not.toHaveBeenCalled()
  })
  */
})
