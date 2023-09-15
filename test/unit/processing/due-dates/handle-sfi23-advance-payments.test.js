const { createAdjustmentPaymentRequest } = require('../../../helpers')

const { RECOVERY } = require('../../../../app/constants/adjustment-types')
const { SFI23, SFI } = require('../../../../app/constants/schemes')
const { Q1, Q3 } = require('../../../../app/constants/schedules')

const { handleSFI23AdvancePayments } = require('../../../../app/processing/due-dates/handle-sfi23-advance-payments')
const { AR } = require('../../../../app/constants/ledgers')

let advancePaymentRequest
let previousPaymentRequest
let previousPaymentRequests
let paymentRequest
let paymentRequests
let paymentSchedule

describe('handle sfi 23 advance payments', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    previousPaymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    previousPaymentRequest.schemeId = SFI23
    advancePaymentRequest = { ...previousPaymentRequest, paymentRequestNumber: 0, schedule: Q1 }
    previousPaymentRequests = [previousPaymentRequest, advancePaymentRequest]
    paymentRequest = createAdjustmentPaymentRequest(previousPaymentRequest, RECOVERY)
    paymentRequest.paymentRequestNumber = 1
    paymentRequests = [paymentRequest]

    paymentSchedule = JSON.parse(JSON.stringify(require('../../../mocks/payment-schedule')))
  })

  test('should update first payment request for SFI 23 to Q3', () => {
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests[0].schedule).toBe(Q3)
  })

  test('should update first payment request for SFI 23 with due date of second instalment', () => {
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests[0].dueDate).toBe(paymentSchedule[1].dueDate)
  })

  test('should not change payment requests if not SFI 23', () => {
    paymentRequest.schemeId = SFI
    const originalPaymentRequests = JSON.parse(JSON.stringify(paymentRequests))
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests).toStrictEqual(originalPaymentRequests)
  })

  test('should not change payment requests if not payment request 1', () => {
    paymentRequest.paymentRequestNumber = 2
    const originalPaymentRequests = JSON.parse(JSON.stringify(paymentRequests))
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests).toStrictEqual(originalPaymentRequests)
  })

  test('should not change payment requests if no advance payment', () => {
    previousPaymentRequests = [previousPaymentRequest]
    const originalPaymentRequests = JSON.parse(JSON.stringify(paymentRequests))
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests).toStrictEqual(originalPaymentRequests)
  })

  test('should not change payment requests if advance payment was not for 2023 payment date', () => {
    advancePaymentRequest.dueDate = '2024-01-01'
    const originalPaymentRequests = JSON.parse(JSON.stringify(paymentRequests))
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests).toStrictEqual(originalPaymentRequests)
  })

  test('should not change AR payment requests', () => {
    paymentRequest.ledger = AR
    const originalPaymentRequests = JSON.parse(JSON.stringify(paymentRequests))
    handleSFI23AdvancePayments(paymentRequests, previousPaymentRequests, paymentSchedule)
    expect(paymentRequests).toStrictEqual(originalPaymentRequests)
  })
})
