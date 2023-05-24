const { createAdjustmentPaymentRequest } = require('../../../helpers')

jest.mock('../../../../app/processing/due-dates/get-settled-value')
const { getSettledValue: mockGetSettledValue } = require('../../../../app/processing/due-dates/get-settled-value')

jest.mock('../../../../app/processing/due-dates/get-total-value')
const { getTotalValue: mockGetTotalValue } = require('../../../../app/processing/due-dates/get-total-value')

jest.mock('../../../../app/processing/due-dates/get-payment-schedule')
const { getPaymentSchedule: mockGetPaymentSchedule } = require('../../../../app/processing/due-dates/get-payment-schedule')

const { RECOVERY } = require('../../../../app/constants/adjustment-types')
const { AR } = require('../../../../app/constants/ledgers')
const { Q1, Q2, Q3 } = require('../../../../app/constants/schedules')

const { confirmDueDates } = require('../../../../app/processing/due-dates/confirm-due-dates')

const settledValue = 0

let previousPaymentRequest
let previousPaymentRequests
let paymentRequest
let paymentRequests
let paymentSchedule

describe('confirm due dates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    previousPaymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    previousPaymentRequests = [previousPaymentRequest]
    paymentRequest = createAdjustmentPaymentRequest(previousPaymentRequest, RECOVERY)
    paymentRequests = [paymentRequest]

    paymentSchedule = JSON.parse(JSON.stringify(require('../../../mocks/payment-schedule')))

    mockGetSettledValue.mockReturnValue(settledValue)
    mockGetTotalValue.mockReturnValue(previousPaymentRequest.value)
    mockGetPaymentSchedule.mockReturnValue(paymentSchedule)
  })

  test('should not recalculate due dates if first payment request does not have a schedule', async () => {
    delete previousPaymentRequest.schedule
    await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(mockGetSettledValue).not.toHaveBeenCalled()
  })

  test('should return payment requests unchanged if first payment request does not have a schedule', async () => {
    delete previousPaymentRequest.schedule
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result).toEqual(paymentRequests)
  })

  test('should not recalculate due dates if no first payment request', async () => {
    previousPaymentRequest.paymentRequestNumber = 2
    await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(mockGetSettledValue).not.toHaveBeenCalled()
  })

  test('should return payment requests unchanged if no first payment request', async () => {
    previousPaymentRequest.paymentRequestNumber = 2
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result).toEqual(paymentRequests)
  })

  test('should calculate total settled of all previous payment requests', async () => {
    await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(mockGetSettledValue).toHaveBeenCalledWith(previousPaymentRequests)
  })

  test('should calculate total value of all previous payment requests', async () => {
    await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(mockGetTotalValue).toHaveBeenCalledWith(previousPaymentRequests)
  })

  test('should calculate payment schedule', async () => {
    await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(mockGetPaymentSchedule).toHaveBeenCalledWith(previousPaymentRequest.schedule, previousPaymentRequest.dueDate, settledValue, previousPaymentRequest.value, expect.any(Date))
  })

  test('should return payment requests unchanged if no outstanding payments', async () => {
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result).toEqual(paymentRequests)
  })

  test('should return payment requests unchanged if outstanding payments but all requests AR', async () => {
    paymentSchedule[3].outstanding = true
    paymentRequests[0].ledger = AR
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result).toEqual(paymentRequests)
  })

  test('should return payment requests unchanged if outstanding payments but all values positive', async () => {
    paymentSchedule[3].outstanding = true
    paymentRequests[0].value = 1
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result).toEqual(paymentRequests)
  })

  test('should reduce remaining schedule to one if only one instalment remaining', async () => {
    paymentSchedule[3].outstanding = true
    paymentRequests[0].value = -1
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result[0].schedule).toBe(Q1)
  })

  test('should reduce remaining schedule to two if only two instalments remaining', async () => {
    paymentSchedule[2].outstanding = true
    paymentSchedule[3].outstanding = true
    paymentRequests[0].value = -1
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result[0].schedule).toBe(Q2)
  })

  test('should reduce remaining schedule to three if only three instalments remaining', async () => {
    paymentSchedule[1].outstanding = true
    paymentSchedule[2].outstanding = true
    paymentSchedule[3].outstanding = true
    paymentRequests[0].value = -1
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result[0].schedule).toBe(Q3)
  })

  test('should update due date to date of next outstanding instalment', async () => {
    paymentSchedule[3].outstanding = true
    paymentRequests[0].value = -1
    const result = await confirmDueDates(paymentRequests, previousPaymentRequests)
    expect(result[0].dueDate).toEqual(paymentSchedule[3].dueDate)
  })
})
