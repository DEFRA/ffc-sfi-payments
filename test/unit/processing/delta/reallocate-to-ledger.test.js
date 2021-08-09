const reallocateToLedger = require('../../../../app/processing/delta/reallocate-to-ledger')

describe('allocate to ledgers', () => {
  test('should reallocate all AP to AR if unsettled', () => {
    const paymentRequest = {
      ledger: 'AP',
      value: 10
    }
    const updatedPaymentRequests = reallocateToLedger(paymentRequest, 'AR')
    expect(updatedPaymentRequests[0].ledger).toBe('AR')
  })

  test('should reallocate all AR to AP if unsettled value is greater than current request recovery', () => {
    const paymentRequest = {
      ledger: 'AR',
      value: -10
    }
    const updatedPaymentRequests = reallocateToLedger(paymentRequest, 'AP')
    expect(updatedPaymentRequests[0].ledger).toBe('AP')
  })
})
