const {
  isFirstClaim
} = require('../../../../app/processing/delta/is-first-claim')

describe('isFirstClaim', () => {
  test('returns true when no previous payment request matches schemeId and agreementNumber', () => {
    const paymentRequest = { schemeId: 1, agreementNumber: 'AG-001' }
    const previousPaymentRequests = [{ schemeId: 2, agreementNumber: 'AG-002' }]
    expect(isFirstClaim(paymentRequest, previousPaymentRequests)).toBe(true)
  })

  test('returns false when a previous payment request matches schemeId and agreementNumber', () => {
    const paymentRequest = { schemeId: 1, agreementNumber: 'AG-001' }
    const previousPaymentRequests = [{ schemeId: 1, agreementNumber: 'AG-001' }]
    expect(isFirstClaim(paymentRequest, previousPaymentRequests)).toBe(false)
  })
})
