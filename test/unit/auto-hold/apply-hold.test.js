const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransactionObject = {
  commit: mockCommit,
  rollback: mockRollback
}
const mockTransaction = jest.fn().mockImplementation(() => {
  return mockTransactionObject
})

jest.mock('../../../app/data', () => {
  return {
    sequelize: {
      transaction: mockTransaction
    }
  }
})

jest.mock('../../../app/auto-hold/get-hold-category-id')
const { getHoldCategoryId: mockGetHoldCategoryId } = require('../../../app/auto-hold/get-hold-category-id')
jest.mock('../../../app/auto-hold/hold-and-reschedule')
const { holdAndReschedule: mockHoldAndReschedule } = require('../../../app/auto-hold/hold-and-reschedule')

const { TOP_UP } = require('../../../app/constants/adjustment-types')

const { applyHold } = require('../../../app/auto-hold/apply-hold')
const paymentRequest = require('../../mocks/payment-requests/payment-request')

const holdCategoryId = 1

describe('apply hold', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetHoldCategoryId.mockResolvedValue(holdCategoryId)
    mockHoldAndReschedule.mockResolvedValue(true)
  })

  test('should create database transaction', async () => {
    await applyHold(paymentRequest, TOP_UP)
    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })

  test('should get hold category id from category', async () => {
    await applyHold(paymentRequest, TOP_UP)
    expect(mockGetHoldCategoryId).toHaveBeenCalledWith(paymentRequest.schemeId, TOP_UP, mockTransactionObject)
  })

  test('should hold and reschedule payment request', async () => {
    await applyHold(paymentRequest, TOP_UP)
    expect(mockHoldAndReschedule).toHaveBeenCalledWith(paymentRequest, holdCategoryId, mockTransactionObject)
  })

  test('should commit transaction', async () => {
    await applyHold(paymentRequest, TOP_UP)
    expect(mockCommit).toHaveBeenCalledTimes(1)
  })

  test('should rollback transaction if error thrown', async () => {
    mockHoldAndReschedule.mockImplementationOnce(async () => {
      throw new Error('Simulated error in holdAndReschedule')
    })
    try {
      await applyHold(paymentRequest, TOP_UP)
    } catch (error) {
      expect(error.message).toBe('Simulated error in holdAndReschedule')
      expect(mockRollback).toHaveBeenCalledTimes(1)
    }
  })
})
