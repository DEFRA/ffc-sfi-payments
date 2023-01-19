const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

jest.mock('../../../app/config')
const mockConfig = require('../../../app/config')

jest.mock('../../../app/event')
const mockEvent = require('../../../app/event')

jest.mock('../../../app/acknowledgement/get-hold-category-name')
const getHoldCategoryName = require('../../../app/acknowledgement/get-hold-category-name')

jest.mock('../../../app/holds/get-hold-category-id')
const getHoldCategoryId = require('../../../app/holds/get-hold-category-id')

jest.mock('../../../app/reschedule')
const holdAndReschedule = require('../../../app/reschedule')

jest.mock('../../../app/reset')
const { resetPaymentRequestById } = require('../../../app/reset')

const processInvalid = require('../../../app/acknowledgement/process-invalid')

const mockFRN = require('../../mock-frn')
const { SFI } = require('../../../app/schemes')

let mockAcknowledgement
let mockAcknowledgementError
let mockHoldCategoryName
let mockHoldCategoryId

let schemeId
let paymentRequestId

describe('send acknowledgement error event', () => {
  beforeEach(() => {
    mockConfig.isAlerting = true

    mockAcknowledgement = JSON.parse(JSON.stringify(require('../../mock-acknowledgement')))
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mock-acknowledgement-error')))
    mockHoldCategoryName = JSON.parse(JSON.stringify(require('../../../app/constants/hold-categories-names'))).DAX_REJECTION
    mockHoldCategoryId = 3

    schemeId = SFI
    paymentRequestId = 1

    mockEvent.sendAcknowledgementErrorEvent.mockReturnValue(undefined)

    getHoldCategoryName.mockReturnValue(mockHoldCategoryName)

    getHoldCategoryId.mockReturnValue(mockHoldCategoryId)

    holdAndReschedule.mockReturnValue({
      undefined
    })

    resetPaymentRequestById.mockReturnValue({
      undefined
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return undefined when processInvalid is called', async () => {
    const result = await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(result).toBeUndefined()
  })

  test('should call resetPaymentRequestById when a schemeId, paymentRequestId, frn and unsuccessful ack object are given', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(resetPaymentRequestById).toHaveBeenCalled()
  })

  test('should call resetPaymentRequestById once when a schemeId, paymentRequestId, frn and unsuccessful ack object are given', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(resetPaymentRequestById).toHaveBeenCalledTimes(1)
  })

  test('should call resetPaymentRequestById with paymentRequestId, schemeId and transaction when a schemeId, paymentRequestId, frn and unsuccessful ack object are given', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(resetPaymentRequestById).toHaveBeenCalledWith(paymentRequestId, schemeId, mockTransaction)
  })

  test('should call getHoldCategoryName', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(getHoldCategoryName).toHaveBeenCalled()
  })

  test('should call getHoldCategoryName once', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(getHoldCategoryName).toHaveBeenCalledTimes(1)
  })

  test('should call getHoldCategoryName with an unsuccessful ack object message', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(getHoldCategoryName).toHaveBeenCalledWith(mockAcknowledgementError.message)
  })

  test('should call getHoldCategoryId', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(getHoldCategoryId).toHaveBeenCalled()
  })

  test('should call getHoldCategoryId once', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(getHoldCategoryId).toHaveBeenCalledTimes(1)
  })

  test('should call getHoldCategoryId with a schemeId, holdCategoryName and transaction', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(getHoldCategoryId).toHaveBeenCalledWith(schemeId, mockHoldCategoryName, mockTransaction)
  })

  test('should call holdAndReschedule', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(holdAndReschedule).toHaveBeenCalled()
  })

  test('should call holdAndReschedule once', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(holdAndReschedule).toHaveBeenCalledTimes(1)
  })

  test('should call holdAndReschedule with a schemeId, paymentRequestId, holdCategoryId, frn and transaction', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(holdAndReschedule).toHaveBeenCalledWith(schemeId, paymentRequestId, mockHoldCategoryId, mockFRN, mockTransaction)
  })

  test('should call sendAcknowledgementErrorEvent when a schemeId, paymentRequestId, frn and unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementErrorEvent).toHaveBeenCalled()
  })

  test('should call sendAcknowledgementErrorEvent once when a schemeId, paymentRequestId, frn and unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendAcknowledgementErrorEvent with a holdCategoryName, an unsuccessful ack object and frn when a schemeId, paymentRequestId, frn and unsuccessful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementErrorEvent).toHaveBeenCalledWith(mockHoldCategoryName, mockAcknowledgementError, mockFRN)
  })

  test('should not call sendAcknowledgementErrorEvent when a schemeId, paymentRequestId, frn and successful ack object is given and isAlerting is true', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgement)
    expect(mockEvent.sendAcknowledgementErrorEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAcknowledgementErrorEvent when a schemeId, paymentRequestId, frn and unsuccessful ack object is given but isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementErrorEvent).not.toHaveBeenCalled()
  })

  test('should not call sendAcknowledgementErrorEvent when a schemeId, paymentRequestId, frn and successful ack object is given and isAlerting is false', async () => {
    mockConfig.isAlerting = false
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgement)
    expect(mockEvent.sendAcknowledgementErrorEvent).not.toHaveBeenCalled()
  })

  test('should call mockTransaction.commit', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockTransaction.commit).toHaveBeenCalled()
  })

  test('should call mockTransaction.commit once', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockTransaction.commit).toHaveBeenCalledTimes(1)
  })

  test('should not call mockTransaction.rollback when a schemeId, paymentRequestId, frn and unsuccessful ack object is given and nothing throws', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockTransaction.rollback).not.toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback when resetPaymentRequestById throws', async () => {
    resetPaymentRequestById.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when resetPaymentRequestById throws', async () => {
    resetPaymentRequestById.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when getHoldCategoryId throws', async () => {
    getHoldCategoryId.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when getHoldCategoryId throws', async () => {
    getHoldCategoryId.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when holdAndReschedule throws', async () => {
    holdAndReschedule.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when holdAndReschedule throws', async () => {
    holdAndReschedule.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should call mockTransaction.rollback when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('should call mockTransaction.rollback once when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error())
    try { await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError) } catch { }
    expect(mockTransaction.rollback).toHaveBeenCalledTimes(1)
  })

  test('should throw processInvalid when resetPaymentRequestById throws', async () => {
    resetPaymentRequestById.mockRejectedValue(new Error())

    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw processInvalid when getHoldCategoryId throws', async () => {
    getHoldCategoryId.mockRejectedValue(new Error())

    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw processInvalid when holdAndReschedule throws', async () => {
    holdAndReschedule.mockRejectedValue(new Error())

    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw processInvalid when sendAcknowledgementErrorEvent throws', async () => {
    mockEvent.sendAcknowledgementErrorEvent.mockRejectedValue(new Error())

    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw processInvalid when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error())

    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw processInvalid when mockTransaction.rollback throws', async () => {
    mockTransaction.rollback.mockRejectedValue(new Error())

    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }

    expect(wrapper).rejects.toThrow()
  })
})
