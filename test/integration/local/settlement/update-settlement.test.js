const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

const db = require('../../../../app/data')

const { updateSettlementStatus } = require('../../../../app/settlement/update-settlement-status')

let settlement
let paymentRequest

describe('update settlement status', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    settlement = JSON.parse(JSON.stringify(require('../../../mocks/settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
  })

  test('should return false if matching payment request not found', async () => {
    const result = await updateSettlementStatus(settlement)
    expect(result).toBe(false)
  })

  test('should update settled value if no previous settlements', async () => {
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(settlement.value)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
