jest.mock('ffc-messaging')
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
const { processingConfig: mockConfig } = require('../../../app/config')

jest.mock('../../../app/event')
const mockEvent = require('../../../app/event')

jest.mock('../../../app/acknowledgement/get-hold-category-name')
const { getHoldCategoryName } = require('../../../app/acknowledgement/get-hold-category-name')

jest.mock('../../../app/holds/get-hold-category-id')
const { getHoldCategoryId } = require('../../../app/holds/get-hold-category-id')

jest.mock('../../../app/reschedule')
const holdAndReschedule = require('../../../app/reschedule')

jest.mock('../../../app/reset')
const { resetPaymentRequestById } = require('../../../app/reset')

const { processInvalid } = require('../../../app/acknowledgement/process-invalid')

const mockFRN = require('../../mocks/frn')
const { SFI } = require('../../../app/constants/schemes')

let mockAcknowledgement
let mockAcknowledgementError
let mockHoldCategoryName
let mockHoldCategoryId

let schemeId
let paymentRequestId

describe('send acknowledgement error event', () => {
  beforeEach(() => {
    mockConfig.isAlerting = true

    mockAcknowledgement = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement')))
    mockAcknowledgementError = JSON.parse(JSON.stringify(require('../../mocks/acknowledgement-error')))
    mockHoldCategoryName = JSON.parse(JSON.stringify(require('../../../app/constants/hold-categories-names'))).DAX_REJECTION
    mockHoldCategoryId = 3

    schemeId = SFI
    paymentRequestId = 1

    mockEvent.sendAcknowledgementErrorEvent.mockReturnValue(undefined)

    getHoldCategoryName.mockReturnValue(mockHoldCategoryName)

    getHoldCategoryId.mockReturnValue(mockHoldCategoryId)

    holdAndReschedule.mockReturnValue(undefined)

    resetPaymentRequestById.mockReturnValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return undefined', async () => {
    const result = await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(result).toBeUndefined()
  })

  test('should call resetPaymentRequestById', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(resetPaymentRequestById).toHaveBeenCalled()
  })

  test('should call resetPaymentRequestById once', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(resetPaymentRequestById).toHaveBeenCalledTimes(1)
  })

  test('should call resetPaymentRequestById with paymentRequestId, schemeId and transaction', async () => {
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

  test('should call sendAcknowledgementErrorEvent', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementErrorEvent).toHaveBeenCalled()
  })

  test('should call sendAcknowledgementErrorEvent once', async () => {
    await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    expect(mockEvent.sendAcknowledgementErrorEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendAcknowledgementErrorEvent with a holdCategoryName, an unsuccessful ack object and frn', async () => {
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

  test('should not call mockTransaction.rollback and nothing throws', async () => {
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

  test('should throw when resetPaymentRequestById throws', async () => {
    resetPaymentRequestById.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when resetPaymentRequestById throws', async () => {
    resetPaymentRequestById.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue resetting payment request by Id" error when resetPaymentRequestById throws "Issue resetting payment request by Id" error', async () => {
    resetPaymentRequestById.mockRejectedValue(new Error('Issue resetting payment request by Id'))
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(/^Issue resetting payment request by Id$/)
  })

  test('should throw when getHoldCategoryId throws', async () => {
    getHoldCategoryId.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when getHoldCategoryId throws', async () => {
    getHoldCategoryId.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue receiving hold category Id" error when getHoldCategoryId throws "Issue receiving hold category Id" error', async () => {
    getHoldCategoryId.mockRejectedValue(new Error('Issue receiving hold category Id'))
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(/^Issue receiving hold category Id$/)
  })

  test('should throw when holdAndReschedule throws', async () => {
    holdAndReschedule.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when holdAndReschedule throws', async () => {
    holdAndReschedule.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue applying a hold" error when holdAndReschedule throws "Issue applying a hold" error', async () => {
    holdAndReschedule.mockRejectedValue(new Error('Issue applying a hold'))
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(/^Issue applying a hold$/)
  })

  test('should throw when sendAcknowledgementErrorEvent throws', async () => {
    mockEvent.sendAcknowledgementErrorEvent.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when sendAcknowledgementErrorEvent throws', async () => {
    mockEvent.sendAcknowledgementErrorEvent.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue sending acknowledgement error event" error when sendAcknowledgementErrorEvent throws "Issue sending acknowledgement error event" error', async () => {
    mockEvent.sendAcknowledgementErrorEvent.mockRejectedValue(new Error('Issue sending acknowledgement error event'))
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(/^Issue sending acknowledgement error event$/)
  })

  test('should throw when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.commit throws', async () => {
    mockTransaction.commit.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue committing a transaction" error when mockTransaction.commit throws "Issue committing a transaction" error', async () => {
    mockTransaction.commit.mockRejectedValue(new Error('Issue committing a transaction'))
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(/^Issue committing a transaction$/)
  })

  test('should throw when mockTransaction.rollback throws', async () => {
    mockTransaction.rollback.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw Error when mockTransaction.rollback throws', async () => {
    mockTransaction.rollback.mockRejectedValue(new Error())
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(Error)
  })

  test('should throw "Issue when attempting to rollback a transaction" error when mockTransaction.rollback throws "Issue when attempting to rollback a transaction" error', async () => {
    mockTransaction.rollback.mockRejectedValue(new Error('Issue when attempting to rollback a transaction'))
    const wrapper = async () => {
      await processInvalid(schemeId, paymentRequestId, mockFRN, mockAcknowledgementError)
    }
    expect(wrapper).rejects.toThrow(/^Issue when attempting to rollback a transaction$/)
  })
})
