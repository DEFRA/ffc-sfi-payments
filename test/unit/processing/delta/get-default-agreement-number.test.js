const { getDefaultAgreementNumber } = require('../../../../app/processing/delta/get-default-agreement-number')

const agreementNumber = '12345678'

let paymentRequest
let previousPaymentRequests

describe('get default agreement number', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    previousPaymentRequests = [{ ...paymentRequest, agreementNumber }]
  })

  test('should return current agreement number if no previous payment requests', () => {
    const result = getDefaultAgreementNumber(paymentRequest, [])
    expect(result).toEqual(paymentRequest.agreementNumber)
  })

  test('should return first agreement number if previous payment requests', () => {
    const result = getDefaultAgreementNumber(paymentRequest, previousPaymentRequests)
    expect(result).toEqual(paymentRequest.agreementNumber)
  })
})
