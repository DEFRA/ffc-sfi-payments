jest.mock('uuid')
const { v4: uuidv4 } = require('uuid')

jest.mock('../../../app/event/raise-event')
const raiseEvent = require('../../../app/event/raise-event')

const sendProcessingAckInvalidBankDetailsErrorEvent = require('../../../app/event/send-processing-ack-invalid-bank-details-error-event')
const mockUUID = require('../../mock-uuid')
const mockFRN = require('../../mock-frn')

let mockEvent

describe('send invalid bank details event', () => {
  beforeEach(async () => {
    uuidv4.mockReturnValue(mockUUID)

    mockEvent = {
      id: mockUUID,
      name: 'invalid-bank-details',
      type: 'error',
      message: 'No valid bank details held',
      data: { mockFRN }
    }
  })

  afterEach(async () => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  test('should call uuidv4 when a frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when an empty frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when undefined is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(undefined)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when null is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 when an empty string is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 once when a frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when an empty frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when undefined is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(undefined)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when null is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 once when an empty string is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 with no parameters when a frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when an empty frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when undefined is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(undefined)
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when null is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call uuidv4 with no parameters when an empty string is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(uuidv4).toHaveBeenCalledWith()
  })

  test('should call raiseEvent when a frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when an empty frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when undefined is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(undefined)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when null is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent when an empty string is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent once when a frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when an empty frn is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when undefined is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(undefined)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when null is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent once when an empty string is given', async () => {
    await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent with mockEvent when a frn is given', async () => {
    mockEvent.data = { frn: mockFRN }
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with empty frn data when an empty frn is given', async () => {
    mockEvent.data = { frn: {} }
    await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with undefined frn data when undefined is given', async () => {
    mockEvent.data = { frn: mockFRN }
    await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with null frn data when null is given', async () => {
    mockEvent.data = { frn: null }
    await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should call raiseEvent with mockEvent with empty string frn data when an empty string is given', async () => {
    mockEvent.data = { frn: '' }
    await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(raiseEvent).toHaveBeenCalledWith(mockEvent)
  })

  test('should return undefined when a frn is given', async () => {
    const result = await sendProcessingAckInvalidBankDetailsErrorEvent(mockFRN)
    expect(result).toBeUndefined()
  })

  test('should return undefined when an empty frn is given', async () => {
    const result = await sendProcessingAckInvalidBankDetailsErrorEvent({})
    expect(result).toBeUndefined()
  })

  test('should return undefined when undefined is given', async () => {
    const result = await sendProcessingAckInvalidBankDetailsErrorEvent(undefined)
    expect(result).toBeUndefined()
  })

  test('should return undefined when null is given', async () => {
    const result = await sendProcessingAckInvalidBankDetailsErrorEvent(null)
    expect(result).toBeUndefined()
  })

  test('should return undefined when an empty string is given', async () => {
    const result = await sendProcessingAckInvalidBankDetailsErrorEvent('')
    expect(result).toBeUndefined()
  })
})
