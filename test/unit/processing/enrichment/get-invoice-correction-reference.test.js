const { AP, AR } = require('../../../../app/ledgers')
const getInvoiceCorrectionReference = require('../../../../app/processing/enrichment/get-invoice-correction-reference')

describe('get invoice correction reference', () => {
  test('should return undefined if no previous requests', () => {
    const paymentRequests = []
    const invoiceCorrectionReference = getInvoiceCorrectionReference(paymentRequests)
    expect(invoiceCorrectionReference).toBeUndefined()
  })

  test('should return undefined if no previous AR requests', () => {
    const paymentRequests = [{
      completedPaymentRequestId: 1,
      ledger: AP
    }]
    const invoiceCorrectionReference = getInvoiceCorrectionReference(paymentRequests)
    expect(invoiceCorrectionReference).toBeUndefined()
  })

  test('should return invoice number of AR request', () => {
    const paymentRequests = [{
      completedPaymentRequestId: 1,
      invoiceNumber: 'InvoiceNumber1',
      ledger: AR
    }]
    const invoiceCorrectionReference = getInvoiceCorrectionReference(paymentRequests)
    expect(invoiceCorrectionReference).toBe('InvoiceNumber1')
  })

  test('should return latest AR request', () => {
    const paymentRequests = [{
      completedPaymentRequestId: 1,
      invoiceNumber: 'InvoiceNumber1',
      ledger: AR
    }, {
      completedPaymentRequestId: 3,
      invoiceNumber: 'InvoiceNumber2',
      ledger: AR
    }, {
      completedPaymentRequestId: 2,
      invoiceNumber: 'InvoiceNumber3',
      ledger: AR
    }]
    const invoiceCorrectionReference = getInvoiceCorrectionReference(paymentRequests)
    expect(invoiceCorrectionReference).toBe('InvoiceNumber3')
  })
})
