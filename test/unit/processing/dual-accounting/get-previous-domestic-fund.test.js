const domesticFundCodes = require('../../../../app/constants/domestic-fund-codes')

const { getPreviousDomesticFund } = require('../../../../app/processing/dual-accounting/get-previous-domestic-fund')

let previousPaymentRequests

describe('get previous domestic fund', () => {
  beforeEach(() => {
    previousPaymentRequests = [{
      invoiceLines: [{
        fundCode: 'ERD14',
        schemeCode: '1234A'
      }]
    }]
  })

  test('should return undefined in no previous domestic fund', () => {
    const result = getPreviousDomesticFund(previousPaymentRequests)
    expect(result).toBeUndefined()
  })

  test('should return undefined if no previous invoice lines', () => {
    previousPaymentRequests = [{}]
    const result = getPreviousDomesticFund(previousPaymentRequests)
    expect(result).toBeUndefined()
  })

  test('should return undefined if previous invoice lines empty array', () => {
    previousPaymentRequests = [{
      invoiceLines: []
    }]
    const result = getPreviousDomesticFund(previousPaymentRequests)
    expect(result).toBeUndefined()
  })

  test.each(Object.values(domesticFundCodes))('should return domestic fund code if previous domestic fund used', (fundCode) => {
    previousPaymentRequests[0].invoiceLines[0].fundCode = fundCode
    const result = getPreviousDomesticFund(previousPaymentRequests)
    expect(result).toBe(fundCode)
  })

  test('should return fund from last payment request', () => {
    previousPaymentRequests = [{
      invoiceLines: [{
        fundCode: 'ERD14'
      }, {
        fundCode: domesticFundCodes.DOM00
      }]
    }]
    const result = getPreviousDomesticFund(previousPaymentRequests)
    expect(result).toBe(domesticFundCodes.DOM00)
  })
})
