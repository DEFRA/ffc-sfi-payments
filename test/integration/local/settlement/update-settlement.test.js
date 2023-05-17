const moment = require('moment')

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

  test('should update last settled date if no previous settlements', async () => {
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.lastSettlement).toStrictEqual(new Date(settlement.settlementDate))
  })

  test('should return true if no previous settlements', async () => {
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toBe(true)
  })

  test('should update settled value if previous settlement has earlier date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).subtract(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(settlement.value)
  })

  test('should update last settled date if previous settlement has earlier date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).subtract(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.lastSettlement).toStrictEqual(new Date(settlement.settlementDate))
  })

  test('should return true if previous settlement has earlier date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).subtract(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toBe(true)
  })

  test('should not update settled value if previous settlement has later date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).add(1, 'day').toDate()
    paymentRequest.settledValue = 50
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(paymentRequest.settledValue)
  })

  test('should not update last settled date if previous settlement has later date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).add(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.lastSettlement).toStrictEqual(paymentRequest.lastSettlement)
  })

  test('should return false if previous settlement has later date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).add(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toBe(false)
  })

  test('should not update settled value if previous settlement has same date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).toDate()
    paymentRequest.settledValue = 50
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(paymentRequest.settledValue)
  })

  test('should not update last settled date if previous settlement has same date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).toDate()
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.lastSettlement).toStrictEqual(paymentRequest.lastSettlement)
  })

  test('should return false if previous settlement has same date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).toDate()
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toBe(false)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
