const { AR } = require('../../../../app/constants/ledgers')

const { getInvoiceCorrectionReference } = require('../../../../app/processing/enrichment/get-invoice-correction-reference')

let paymentRequest
let paymentRequests

describe('enrich payment requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    paymentRequests = [paymentRequest]
  })

  test('should return undefined if only AP payment requests', () => {
    expect(getInvoiceCorrectionReference(paymentRequests)).toBeUndefined()
  })

  test('should return undefined if no previous payment requests', () => {
    expect(getInvoiceCorrectionReference([])).toBeUndefined()
  })

  test('should return invoice number of only AR payment request', () => {
    paymentRequest.ledger = AR
    expect(getInvoiceCorrectionReference(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })

  test('should return invoice number of last AR payment request', () => {
    paymentRequest.ledger = AR
    paymentRequests.push(JSON.parse(JSON.stringify(paymentRequest)))
    paymentRequests[0].invoiceNumber = '1234'
    expect(getInvoiceCorrectionReference(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })
})
