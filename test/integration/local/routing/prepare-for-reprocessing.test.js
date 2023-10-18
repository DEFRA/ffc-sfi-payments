const { resetDatabase, closeDatabaseConnection, savePaymentRequest } = require('../../../helpers')

jest.mock('../../../../app/holds')
const { removeHoldByFrn: mockRemoveHoldByFrn } = require('../../../../app/holds')

const paymentRequest = require('../../../mocks/payment-requests/payment-request')
const { RECOVERY_DATE } = require('../../../mocks/values/recovery-date')

const { ADMINISTRATIVE, IRREGULAR } = require('../../../../app/constants/debt-types')
const { AWAITING_DEBT_ENRICHMENT } = require('../../../../app/constants/hold-categories-names')

const db = require('../../../../app/data')

const { prepareForReprocessing } = require('../../../../app/routing/prepare-for-reprocessing')

describe('prepare for reprocessing', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await resetDatabase()
    const { id } = await savePaymentRequest(paymentRequest)
    paymentRequest.paymentRequestId = id
  })

  test('should update payment request with new debt type when administrative debt', async () => {
    await prepareForReprocessing(paymentRequest, ADMINISTRATIVE, RECOVERY_DATE)
    const updatedPaymentRequest = await db.paymentRequest.findOne({ where: { paymentRequestId: paymentRequest.paymentRequestId } })
    expect(updatedPaymentRequest.debtType).toEqual(ADMINISTRATIVE)
  })

  test('should update payment request with new debt type when irregular debt', async () => {
    await prepareForReprocessing(paymentRequest, IRREGULAR, RECOVERY_DATE)
    const updatedPaymentRequest = await db.paymentRequest.findOne({ where: { paymentRequestId: paymentRequest.paymentRequestId } })
    expect(updatedPaymentRequest.debtType).toEqual(IRREGULAR)
  })

  test('should update payment request with new recovery date', async () => {
    await prepareForReprocessing(paymentRequest, ADMINISTRATIVE, RECOVERY_DATE)
    const updatedPaymentRequest = await db.paymentRequest.findOne({ where: { paymentRequestId: paymentRequest.paymentRequestId } })
    expect(updatedPaymentRequest.recoveryDate).toEqual(RECOVERY_DATE)
  })

  test('should remove debt enrichment hold', async () => {
    await prepareForReprocessing(paymentRequest, ADMINISTRATIVE, RECOVERY_DATE)
    expect(mockRemoveHoldByFrn).toHaveBeenCalledWith(paymentRequest.schemeId, paymentRequest.frn, AWAITING_DEBT_ENRICHMENT)
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })
})
