jest.mock('../../../app/data')
const db = require('../../../app/data')

const { SFI, BPS, CS, FDMR } = require('../../../app/constants/schemes')

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

  test('should return default filter if not BPS, FDMR or CS', () => {
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.lt]: paymentRequest.paymentRequestNumber },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear,
      agreementNumber: paymentRequest.agreementNumber
    })
  })

  test('should return default filter with all existing payment requests if manually injected payment and not BPS, FDMR or CS', () => {
    paymentRequest.paymentRequestNumber = 0
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.not]: null },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear,
      agreementNumber: paymentRequest.agreementNumber
    })
  })

  test('should return BPS filter if BPS', () => {
    paymentRequest.schemeId = BPS
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.lt]: paymentRequest.paymentRequestNumber },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear
    })
  })

  test('should return BPS filter with all existing payment requests if manually injected payment and BPS', () => {
    paymentRequest.schemeId = BPS
    paymentRequest.paymentRequestNumber = 0
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.not]: null },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      marketingYear: paymentRequest.marketingYear
    })
  })

  test('should return FDMR filter if FDMR', () => {
    paymentRequest.schemeId = FDMR
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.lt]: paymentRequest.paymentRequestNumber },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn
    })
  })

  test('should return FDMR filter with all existing payment requests if manually injected payment and FDMR', () => {
    paymentRequest.schemeId = FDMR
    paymentRequest.paymentRequestNumber = 0
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.not]: null },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn
    })
  })

  test('should return CS filter if CS', () => {
    paymentRequest.schemeId = CS
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.lt]: paymentRequest.paymentRequestNumber },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn
    })
  })

  test('should return CS filter with all existing payment requests if manually injected payment and CS', () => {
    paymentRequest.schemeId = CS
    paymentRequest.paymentRequestNumber = 0
    const filter = getCompletedPaymentRequestsFilter(paymentRequest)
    expect(filter).toMatchObject({
      paymentRequestNumber: { [db.Sequelize.Op.not]: null },
      invalid: false,
      schemeId: paymentRequest.schemeId,
      frn: paymentRequest.frn,
      [db.Sequelize.Op.or]: [
        { contractNumber: paymentRequest.contractNumber },
        db.Sequelize.where(db.Sequelize.fn('replace', db.Sequelize.col('contractNumber'), 'A0', 'A'), paymentRequest.contractNumber?.replace('A0', 'A'))
      ]
    })
  })
})
