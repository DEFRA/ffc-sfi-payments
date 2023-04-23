jest.mock('../../../app/data')
const db = require('../../../app/data')

const { SFI, BPS, CS } = require('../../../app/constants/schemes')

const { getCompletedPaymentRequestsFilter } = require('../../../app/processing/get-completed-payment-requests-filter')

let paymentRequest

describe('get completed payment requests filter', () => {
  beforeEach(() => {
    paymentRequest = {
      schemeId: SFI,
      frn: 1234567890,
      marketingYear: 2022,
      agreementNumber: 'AG12345678',
      contractNumber: 'C12345678',
      paymentRequestNumber: 1
    }
  })

  test('should return default filter if not BPS or CS', () => {
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toEqual({
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear,
      agreementNumber: paymentRequest.agreementNumber
    })
  })

  test('should return BPS filter if BPS', () => {
    paymentRequest.schemeId = BPS
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toEqual({
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear
    })
  })

  test('should return CS filter if CS', () => {
    paymentRequest.schemeId = CS
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear
    })
  })

  test('should return CS filter including sequelize Or query if CS', () => {
    paymentRequest.schemeId = CS
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      [db.Sequelize.Op.or]: [
        { contractNumber: paymentRequest.contractNumber },
        { contractNumber: paymentRequest.contractNumber.replace('A0', 'A') }
      ]
    })
  })
})
