const { createAdjustmentPaymentRequest } = require('../../../helpers')

jest.mock('../../../../app/processing/due-dates/get-settled-value')
const { getSettledValue: mockGetSettledValue } = require('../../../../app/processing/due-dates/get-settled-value')

jest.mock('../../../../app/processing/due-dates/get-total-value')
const { getTotalValue: mockGetTotalValue } = require('../../../../app/processing/due-dates/get-total-value')

jest.mock('../../../../app/processing/due-dates/get-payment-schedule')
const { getPaymentSchedule: mockGetPaymentSchedule } = require('../../../../app/processing/due-dates/get-payment-schedule')

const { TOP_UP } = require('../../../../app/constants/adjustment-types')

const { confirmDueDates } = require('../../../../app/processing/due-dates/confirm-due-dates')

let previousPaymentRequest
let previousPaymentRequests
let paymentRequest
let paymentRequests

describe('confirm due dates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    previousPaymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    previousPaymentRequests = [previousPaymentRequest]
    paymentRequest = createAdjustmentPaymentRequest(previousPaymentRequest, TOP_UP)
    paymentRequests = [paymentRequest]
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
})
