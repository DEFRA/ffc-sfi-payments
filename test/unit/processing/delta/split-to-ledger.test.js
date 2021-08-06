const allocateToLedgers = require('../../../../app/processing/delta/allocate-to-ledgers')

describe('allocate to ledgers', () => {
  test('should reallocate all AP to AR if unsettled value is greater than current request value', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 10
    }
    const unsettled = {
      AR: 100,
      AP: 0
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests[0].ledger).toBe('AR')
  })

  test('should reallocate all AR to AP if unsettled value is greater than current request recovery', () => {
    const paymentRequest = {
      ledger: 'AR',
      value: -10
    }
    const unsettled = {
      AR: 0,
      AP: 100
    }
    const updatedPaymentRequests = allocateToLedgers(paymentRequest, unsettled)
    expect(updatedPaymentRequests[0].ledger).toBe('AP')
  })
})
