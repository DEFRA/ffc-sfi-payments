const moment = require('moment')

const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

const db = require('../../../../app/data')

jest.mock('../../../../app/settlement/adjust-settlement-value')
const { adjustSettlementValue } = require('../../../../app/settlement/adjust-settlement-value')

const { updateSettlementStatus } = require('../../../../app/settlement/update-settlement-status')
const { BPS, FDMR } = require('../../../../app/constants/schemes')

let settlement
let paymentRequest

describe('update settlement status', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()

    settlement = JSON.parse(JSON.stringify(require('../../../mocks/settlements/settlement')))
    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
  })

  test('should return undefined if matching payment request not found', async () => {
    const result = await updateSettlementStatus(settlement)
    expect(result).toBeUndefined()
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

  test('should return invoice number and FRN if no previous settlements', async () => {
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toStrictEqual({ frn: paymentRequest.frn, invoiceNumber: paymentRequest.invoiceNumber })
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

  test('should return invoice number and FRN if previous settlement has earlier date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).subtract(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toStrictEqual({ frn: paymentRequest.frn, invoiceNumber: paymentRequest.invoiceNumber })
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

  test('should return invoice number and FRN if previous settlement has later date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).add(1, 'day').toDate()
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toStrictEqual({ frn: paymentRequest.frn, invoiceNumber: paymentRequest.invoiceNumber })
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

  test('should return invoice number and frn if previous settlement has same date', async () => {
    paymentRequest.lastSettlement = moment(settlement.settlementDate).toDate()
    await savePaymentRequest(paymentRequest, true)
    const result = await updateSettlementStatus(settlement)
    expect(result).toStrictEqual({ frn: paymentRequest.frn, invoiceNumber: paymentRequest.invoiceNumber })
  })

  test('should update value to output of adjustSettlementValue if schemeId of completedPaymentRequest is BPS', async () => {
    adjustSettlementValue.mockResolvedValue(56723)
    paymentRequest.schemeId = BPS
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(56723)
  })

  test('should update value to output of adjustSettlementValue if schemeId of completedPaymentRequest is FDMR', async () => {
    adjustSettlementValue.mockResolvedValue(56723)
    paymentRequest.schemeId = FDMR
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(56723)
  })

  test('should update settled value to value, not output of adjustSettlementValue, if scheme not BPS or FDMR', async () => {
    await savePaymentRequest(paymentRequest, true)
    await updateSettlementStatus(settlement)
    const updatedPaymentRequest = await db.completedPaymentRequest.findOne({ where: { invoiceNumber: paymentRequest.invoiceNumber } })
    expect(updatedPaymentRequest.settledValue).toBe(settlement.value)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
