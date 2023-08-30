const { getOriginalSettlementDate } = require('../../../../app/processing/enrichment/get-original-settlement-date')
const { ORIGINAL_SETTLEMENT_DATE } = require('../../../mocks/values/original-settlement-date')

let paymentRequest
let paymentRequests

describe('get original settlement date', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    paymentRequest.lastSettled = '01/01/2023'

    paymentRequests = [paymentRequest]
  })

  test('should retain original settlement date if already exists', () => {
    paymentRequest.originalSettlementDate = ORIGINAL_SETTLEMENT_DATE
    expect(getOriginalSettlementDate(paymentRequests)).toEqual(ORIGINAL_SETTLEMENT_DATE)
  })

  test('if no original settlement date, should return undefined if no previous payment requests', () => {
    expect(getOriginalSettlementDate([])).toBeUndefined()
  })

  test('if no original settlement date, should get settlement date if only one payment request', () => {
    expect(getOriginalSettlementDate(paymentRequests)).toEqual(paymentRequest.settlementDate)
  })

  test('if no original settlement date, should get earliest settlement date if multiple payment requests and earliest settled first', () => {
    paymentRequests.push(JSON.parse(JSON.stringify(paymentRequest)))
    paymentRequests[1].paymentRequestNumber = 2
    paymentRequests[1].lastSettled = '01/01/2024'
    expect(getOriginalSettlementDate(paymentRequests)).toEqual(paymentRequests[0].settlementDate)
  })

  test('if no original settlement date, should get earliest settlement date if multiple payment requests and earliest settled last', () => {
    paymentRequests.push(JSON.parse(JSON.stringify(paymentRequest)))
    paymentRequests[1].paymentRequestNumber = 2
    paymentRequests[1].lastSettled = '01/01/2022'
    expect(getOriginalSettlementDate(paymentRequests)).toEqual(paymentRequests[1].settlementDate)
  })
})
