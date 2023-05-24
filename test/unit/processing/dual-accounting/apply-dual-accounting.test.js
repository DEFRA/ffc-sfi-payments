jest.mock('../../../../app/processing/dual-accounting/bps')
const { applyBPSDualAccounting: mockApplyBPSDualAccounting } = require('../../../../app/processing/dual-accounting/bps')

jest.mock('../../../../app/processing/dual-accounting/cs')
const { applyCSDualAccounting: mockApplyCSDualAccounting } = require('../../../../app/processing/dual-accounting/cs')

const bpsPaymentRequest = require('../../../mocks/payment-requests/bps')
const fdmrPaymentRequest = require('../../../mocks/payment-requests/fdmr')
const csPaymentRequest = require('../../../mocks/payment-requests/cs')
const sfiPaymentRequest = require('../../../mocks/payment-requests/sfi')

const { applyDualAccounting } = require('../../../../app/processing/dual-accounting')

let paymentRequest
let previousPaymentRequests

describe('apply dual accounting', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = bpsPaymentRequest

    previousPaymentRequests = [bpsPaymentRequest]
  })

  test('should apply BPS dual accounting when scheme is BPS', () => {
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply BPS dual accounting with current and previous payment requests when scheme is BPS', () => {
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledWith(paymentRequest, previousPaymentRequests)
  })

  test('should apply BPS dual accounting when scheme is FDMR', () => {
    paymentRequest = fdmrPaymentRequest
    previousPaymentRequests = [fdmrPaymentRequest]
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply BPS dual accounting with current and previous payment requests when scheme is FDMR', () => {
    paymentRequest = fdmrPaymentRequest
    previousPaymentRequests = [fdmrPaymentRequest]
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledWith(paymentRequest, previousPaymentRequests)
  })

  test('should apply CS dual accounting when scheme is CS', () => {
    paymentRequest = csPaymentRequest
    previousPaymentRequests = [csPaymentRequest]
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyCSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply CS dual accounting with current and previous payment requests when scheme is CS', () => {
    paymentRequest = csPaymentRequest
    previousPaymentRequests = [csPaymentRequest]
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyCSDualAccounting).toHaveBeenCalledWith(paymentRequest, previousPaymentRequests)
  })

  test('should not apply dual accounting when scheme is not BPS, FDMR or CS', () => {
    paymentRequest = sfiPaymentRequest
    previousPaymentRequests = [sfiPaymentRequest]
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).not.toHaveBeenCalled()
    expect(mockApplyCSDualAccounting).not.toHaveBeenCalled()
  })
})
