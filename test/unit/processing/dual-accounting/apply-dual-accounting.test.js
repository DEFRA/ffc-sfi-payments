jest.mock('../../../../app/processing/dual-accounting/bps')
const { applyBPSDualAccounting: mockApplyBPSDualAccounting } = require('../../../../app/processing/dual-accounting/bps')

jest.mock('../../../../app/processing/dual-accounting/cs')
const { applyCSDualAccounting: mockApplyCSDualAccounting } = require('../../../../app/processing/dual-accounting/cs')

const { FDMR, BPS, SFI, CS } = require('../../../../app/constants/schemes')

const { applyDualAccounting } = require('../../../../app/processing/dual-accounting')

let paymentRequest
let previousPaymentRequests

describe('apply dual accounting', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = {
      schemeId: FDMR
    }

    previousPaymentRequests = [{
      schemeId: FDMR
    }]
  })

  test('should apply BPS dual accounting when scheme is BPS', () => {
    paymentRequest.schemeId = BPS
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply BPS dual accounting with current and previous payment requests when scheme is BPS', () => {
    paymentRequest.schemeId = BPS
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledWith(paymentRequest, previousPaymentRequests)
  })

  test('should apply BPS dual accounting when scheme is FDMR', () => {
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply BPS dual accounting with current and previous payment requests when scheme is FDMR', () => {
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledWith(paymentRequest, previousPaymentRequests)
  })

  test('should apply CS dual accounting when scheme is CS', () => {
    paymentRequest.schemeId = CS
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyCSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply CS dual accounting with current and previous payment requests when scheme is CS', () => {
    paymentRequest.schemeId = CS
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyCSDualAccounting).toHaveBeenCalledWith(paymentRequest, previousPaymentRequests)
  })

  test('should not apply dual accounting when scheme is not BPS, FDMR or CS', () => {
    paymentRequest.schemeId = SFI
    applyDualAccounting(paymentRequest, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).not.toHaveBeenCalled()
    expect(mockApplyCSDualAccounting).not.toHaveBeenCalled()
  })
})
