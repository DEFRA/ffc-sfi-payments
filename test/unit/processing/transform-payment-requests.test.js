jest.mock('../../../app/processing/confirm-due-dates')
const confirmDueDates = require('../../../app/processing/confirm-due-dates')

jest.mock('../../../app/processing/delta')
const calculateDelta = require('../../../app/processing/delta')

jest.mock('../../../app/processing/enrichment')
const enrichPaymentRequests = require('../../../app/processing/enrichment')

jest.mock('../../../app/processing/get-completed-payment-requests')
const getCompletedPaymentRequests = require('../../../app/processing/get-completed-payment-requests')

jest.mock('../../../app/processing/confirm-payment-request-number')
const { confirmPaymentRequestNumber } = require('../../../app/processing/confirm-payment-request-number')

const transformPaymentRequest = require('../../../app/processing/transform-payment-request')

let paymentRequest

describe('transform payment request', () => {
  beforeEach(() => {
    paymentRequest = {
      paymentRequestId: 1,
      paymentRequestNumber: 1,
      schemeId: 1,
      frn: 1234567890,
      marketingYear: 2022,
      invalid: false
    }
  })

  test('should confirm payment request number if BPS', async () => {
    const result = await transformPaymentRequest(paymentRequest)
  })
})
