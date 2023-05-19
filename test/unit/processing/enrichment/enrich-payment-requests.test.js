jest.mock('../../../../app/processing/enrichment/get-original-settlement-date')
const { getOriginalSettlementDate: mockGetOriginalSettlementDate } = require('../../../../app/processing/enrichment/get-original-settlement-date')

jest.mock('../../../../app/processing/enrichment/get-invoice-correction-reference')
const { getInvoiceCorrectionReference: mockGetInvoiceCorrectionReference } = require('../../../../app/processing/enrichment/get-invoice-correction-reference')

jest.mock('../../../../app/processing/enrichment/get-original-invoice-number')
const { getOriginalInvoiceNumber: mockGetOriginalInvoiceNumber } = require('../../../../app/processing/enrichment/get-original-invoice-number')

const { DATE } = require('../../../mocks/values/date')
const { INVOICE_NUMBER } = require('../../../mocks/values/invoice-number')

const { AR } = require('../../../../app/constants/ledgers')

const { enrichPaymentRequests } = require('../../../../app/processing/enrichment/enrich-payment-requests')

let paymentRequest
let paymentRequests
let previousPaymentRequests

describe('enrich payment requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockGetOriginalSettlementDate.mockResolvedValue(DATE)
    mockGetInvoiceCorrectionReference.mockResolvedValue(INVOICE_NUMBER)
    mockGetOriginalInvoiceNumber.mockResolvedValue(INVOICE_NUMBER)

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    paymentRequests = [paymentRequest]
    previousPaymentRequests = [paymentRequest]
  })

  test('should should not enrich AP payment requests', async () => {
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(mockGetOriginalSettlementDate).not.toHaveBeenCalled()
    expect(mockGetInvoiceCorrectionReference).not.toHaveBeenCalled()
    expect(mockGetOriginalInvoiceNumber).not.toHaveBeenCalled()
  })

  test('should get original settlement date for AR payment request', async () => {
    paymentRequest.ledger = AR
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(mockGetOriginalSettlementDate).toHaveBeenCalledWith(previousPaymentRequests)
  })

  test('should update original settlement date for AR payment request', async () => {
    paymentRequest.ledger = AR
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequest.originalSettlementDate).toEqual(DATE)
  })

  test('should get invoice correction reference for AR payment request', async () => {
    paymentRequest.ledger = AR
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(mockGetInvoiceCorrectionReference).toHaveBeenCalledWith(previousPaymentRequests)
  })

  test('should update invoice correction reference for AR payment request', async () => {
    paymentRequest.ledger = AR
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequest.invoiceCorrectionReference).toEqual(INVOICE_NUMBER)
  })

  test('should get original invoice number for AR payment request', async () => {
    paymentRequest.ledger = AR
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(mockGetOriginalInvoiceNumber).toHaveBeenCalledWith(previousPaymentRequests)
  })

  test('should update original invoice number for AR payment request', async () => {
    paymentRequest.ledger = AR
    await enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequest.originalInvoiceNumber).toEqual(INVOICE_NUMBER)
  })
})
