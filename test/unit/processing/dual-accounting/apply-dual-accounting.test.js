jest.mock('../../../../app/processing/dual-accounting/bps')
const { applyBPSDualAccounting: mockApplyBPSDualAccounting } = require('../../../../app/processing/dual-accounting/bps')

jest.mock('../../../../app/processing/dual-accounting/cs')
const { applyCSDualAccounting: mockApplyCSDualAccounting } = require('../../../../app/processing/dual-accounting/cs')

const { FDMR, BPS, SFI, CS } = require('../../../../app/constants/schemes')

const { applyDualAccounting } = require('../../../../app/processing/dual-accounting')

let paymentRequests
let previousPaymentRequests

describe('apply dual accounting', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequests = [{
      schemeId: FDMR
    }]

    previousPaymentRequests = [{
      schemeId: FDMR
    }]
  })

  test('should apply BPS dual accounting when scheme is BPS', () => {
    paymentRequests[0].schemeId = BPS
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply BPS dual accounting with current and previous payment requests when scheme is BPS', () => {
    paymentRequests[0].schemeId = BPS
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledWith(paymentRequests, previousPaymentRequests)
  })

  test('should apply BPS dual accounting when scheme is FDMR', () => {
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply BPS dual accounting with current and previous payment requests when scheme is FDMR', () => {
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).toHaveBeenCalledWith(paymentRequests, previousPaymentRequests)
  })

  test('should apply CS dual accounting when scheme is CS', () => {
    paymentRequests[0].schemeId = CS
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyCSDualAccounting).toHaveBeenCalledTimes(1)
  })

  test('should apply CS dual accounting with current and previous payment requests when scheme is CS', () => {
    paymentRequests[0].schemeId = CS
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyCSDualAccounting).toHaveBeenCalledWith(paymentRequests, previousPaymentRequests)
  })

  test('should not apply dual accounting when scheme is not BPS, FDMR or CS', () => {
    paymentRequests[0].schemeId = SFI
    applyDualAccounting(paymentRequests, previousPaymentRequests)
    expect(mockApplyBPSDualAccounting).not.toHaveBeenCalled()
    expect(mockApplyCSDualAccounting).not.toHaveBeenCalled()
  })
})
