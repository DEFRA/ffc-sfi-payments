const { AP, AR } = require('../../../../app/constants/ledgers')

const { getSettledValue } = require('../../../../app/processing/due-dates/get-settled-value')

let previousPaymentRequests

describe('get settled value', () => {
  beforeEach(() => {
    previousPaymentRequests = [{
      ledger: AP,
      settledValue: 100
    }, {
      ledger: AP,
      settledValue: 200
    }, {
      ledger: AR,
      settledValue: 300
    }]
  })

  test('should return total settled value as sum of all settled values for AP ledger', () => {
    expect(getSettledValue(previousPaymentRequests, AP)).toEqual(300)
  })

  test('should treat undefined settled value as 0 settled', () => {
    previousPaymentRequests[0].settledValue = undefined
    expect(getSettledValue(previousPaymentRequests, AP)).toEqual(200)
  })

  test('should treat null settled value as 0 settled', () => {
    previousPaymentRequests[0].settledValue = null
    expect(getSettledValue(previousPaymentRequests, AP)).toEqual(200)
  })
})
