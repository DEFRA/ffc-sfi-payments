const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransactionObject = {
  commit: mockCommit,
  rollback: mockRollback
}
const mockTransaction = jest.fn().mockImplementation(() => {
  return mockTransactionObject
})

jest.mock('../../../../app/data', () => {
  return {
    sequelize: {
      transaction: mockTransaction
    }
  }
})

jest.mock('../../../../app/holds')
const { getHoldCategoryId: mockGetHoldCategoryId } = require('../../../../app/holds')

jest.mock('../../../../app/reschedule')
const { holdAndReschedule: mockHoldAndReschedule } = require('../../../../app/reschedule')

const { SFI } = require('../../../../app/constants/schemes')
const { FRN } = require('../../../mocks/values/frn')
const { TOP_UP } = require('../../../../app/constants/adjustment-types')

const { applyHold } = require('../../../../app/processing/auto-hold/apply-hold')

const paymentRequestId = 1
const holdCategoryId = 1

describe('apply hold', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetHoldCategoryId.mockReturnValue(holdCategoryId)
  })

  test('should create database transaction', async () => {
    await applyHold(SFI, paymentRequestId, FRN, TOP_UP)
    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })

  test('should get hold category id from category', async () => {
    await applyHold(SFI, paymentRequestId, FRN, TOP_UP)
    expect(mockGetHoldCategoryId).toHaveBeenCalledWith(SFI, TOP_UP, mockTransactionObject)
  })

  test('should hold and reschedule payment request', async () => {
    await applyHold(SFI, paymentRequestId, FRN, TOP_UP)
    expect(mockHoldAndReschedule).toHaveBeenCalledWith(paymentRequestId, holdCategoryId, FRN, mockTransactionObject)
  })

  test('should commit transaction', async () => {
    await applyHold(SFI, paymentRequestId, FRN, TOP_UP)
    expect(mockCommit).toHaveBeenCalledTimes(1)
  })

  test('should rollback transaction if error thrown', async () => {
    mockHoldAndReschedule.mockRejectedValue(new Error())
    await expect(applyHold(SFI, paymentRequestId, FRN, TOP_UP)).rejects.toThrow()
    expect(mockRollback).toHaveBeenCalledTimes(1)
  })
})
