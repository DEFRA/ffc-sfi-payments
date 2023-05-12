const { DRD00, DRD01 } = require('../../../../app/constants/domestic-fund-codes')

const { selectDomesticFundCode } = require('../../../../app/processing/dual-accounting/select-domestic-fund-code')

let paymentRequests
const firstPaymentFundCode = DRD00
const previousFundCode = DRD00
const defaultFundCode = DRD01

describe('select domestic fund code', () => {
  beforeEach(() => {
    paymentRequests = []
  })

  test('should return first payment fund code if no previous payment requests', () => {
    const result = selectDomesticFundCode(paymentRequests, firstPaymentFundCode, previousFundCode, defaultFundCode)
    expect(result).toBe(firstPaymentFundCode)
  })

  test('should return previous fund code if previous payment requests and previous fund code', () => {
    paymentRequests = [{}]
    const result = selectDomesticFundCode(paymentRequests, firstPaymentFundCode, previousFundCode, defaultFundCode)
    expect(result).toBe(previousFundCode)
  })

  test('should return default fund code if previous payment requests and no previous fund code', () => {
    paymentRequests = [{}]
    const result = selectDomesticFundCode(paymentRequests, firstPaymentFundCode, undefined, defaultFundCode)
    expect(result).toBe(defaultFundCode)
  })
})
