const { getOriginalInvoiceNumber } = require('../../../../app/processing/enrichment/get-original-invoice-number')

let paymentRequest
let paymentRequests

describe('get original invoice number', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    paymentRequest = JSON.parse(JSON.stringify(require('../../../mocks/payment-requests/payment-request')))
    paymentRequests = [paymentRequest]
  })

  test('should return undefined if no previous payment requests', () => {
    expect(getOriginalInvoiceNumber([])).toBeUndefined()
  })

  test('should return invoice number of only payment request if only is payment request is payment request one', () => {
    expect(getOriginalInvoiceNumber(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })

  test('should return invoice number of payment request one if multiple payment requests', () => {
    paymentRequests.push(JSON.parse(JSON.stringify(paymentRequest)))
    paymentRequests[1].paymentRequestNumber = 2
    paymentRequests[1].invoiceNumber = '1234'
    expect(getOriginalInvoiceNumber(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })

  test('should return invoice number of first payment request if no payment request one', () => {
    paymentRequests.push(JSON.parse(JSON.stringify(paymentRequest)))
    paymentRequests[0].paymentRequestNumber = 2
    paymentRequests[1].paymentRequestNumber = 3
    paymentRequests[1].invoiceNumber = '1234'
    expect(getOriginalInvoiceNumber(paymentRequests)).toEqual(paymentRequest.invoiceNumber)
  })
})
