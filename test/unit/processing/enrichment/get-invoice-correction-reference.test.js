const { AR } = require('../../../../app/constants/ledgers')

const { getInvoiceCorrectionReference } = require('../../../../app/processing/enrichment/get-invoice-correction-reference')
const { INVOICE_CORRECTION_REFERENCE } = require('../../../mocks/values/invoice-correction-reference')

let paymentRequest
let paymentRequests

describe('get invoice correction reference', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    paymentRequests = [paymentRequest]
  })

  test('should retain reference if already exists', () => {
    paymentRequest.invoiceCorrectionReference = INVOICE_CORRECTION_REFERENCE
    expect(getInvoiceCorrectionReference(paymentRequests)).toEqual(INVOICE_CORRECTION_REFERENCE)
  })

  test('if no reference exists, should return undefined if only AP payment requests', () => {
    expect(getInvoiceCorrectionReference(paymentRequests)).toBeUndefined()
  })

  test('if no reference exists, should return undefined if no previous payment requests', () => {
    expect(getInvoiceCorrectionReference([])).toBeUndefined()
  })

  test('if no reference exists, should return invoice number of only AR payment request', () => {
    paymentRequest.ledger = AR
    expect(getInvoiceCorrectionReference(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })

  test('if no reference exists, should return invoice number of last AR payment request', () => {
    paymentRequest.ledger = AR
    paymentRequests.push(JSON.parse(JSON.stringify(paymentRequest)))
    paymentRequests[0].invoiceNumber = '1234'
    expect(getInvoiceCorrectionReference(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })
})
