const { getDefaultAgreementNumber } = require('../../../../app/processing/delta/get-default-agreement-number')

let paymentRequest
let previousPaymentRequests

describe('get default agreement number', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    previousPaymentRequests = [paymentRequest]
  })

  test('should return current agreement number if no previous payment requests', () => {
    const result = getDefaultAgreementNumber(paymentRequest, [])
    expect(result).toEqual(paymentRequest.agreementNumber)
  })
})
