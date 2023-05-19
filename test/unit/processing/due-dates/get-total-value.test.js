const { AP, AR } = require('../../../../app/constants/ledgers')

const { getTotalValue } = require('../../../../app/processing/due-dates/get-total-value')

let previousPaymentRequests

describe('get total value', () => {
  beforeEach(() => {
    previousPaymentRequests = [{
      ledger: AP,
      value: 100
    }, {
      ledger: AP,
      value: 200
    }, {
      ledger: AR,
      value: 300
    }]
  })

  test('should return total settled value as sum of all settled values for AP ledger', () => {
    expect(getTotalValue(previousPaymentRequests, AP)).toEqual(300)
  })

  test('should treat undefined settled value as 0 settled', () => {
    previousPaymentRequests[0].value = undefined
    expect(getTotalValue(previousPaymentRequests, AP)).toEqual(200)
  })

  test('should treat null settled value as 0 settled', () => {
    previousPaymentRequests[0].value = null
    expect(getTotalValue(previousPaymentRequests, AP)).toEqual(200)
  })
})
