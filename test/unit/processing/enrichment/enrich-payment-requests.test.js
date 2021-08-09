const { AR } = require('../../../../app/ledgers')
const enrichPaymentRequests = require('../../../../app/processing/enrichment')

describe('enrich payment request', () => {
  test('should not make any change if no previous payment requests', () => {
    const paymentRequests = [{
      ledger: AR
    }]
    const previousPaymentRequests = []
    enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].originalSettlementDate).toBeUndefined()
    expect(paymentRequests[0].invoiceCorrectionReference).toBeUndefined()
  })

  test('should not make any change if only AP requests', () => {
    const paymentRequests = [{
      ledger: AR
    }]
    const previousPaymentRequests = [{
      ledger: AR,
      settled: new Date(2021, 8, 4)
    }, {
      ledger: AR,
      invoiceNumber: 'invoiceNumber1'
    }]
    enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].originalSettlementDate).toBeUndefined()
    expect(paymentRequests[0].invoiceCorrectionReference).toBeUndefined()
  })

  test('should update original settlement date for AR', () => {
    const paymentRequests = [{
      ledger: AR
    }]
    const previousPaymentRequests = [{
      ledger: AR,
      settled: new Date(2021, 8, 4)
    }]
    enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].originalSettlementDate).toEqual(new Date(2021, 8, 4))
  })

  test('should update invoice correction reference for AR', () => {
    const paymentRequests = [{
      ledger: AR
    }]
    const previousPaymentRequests = [{
      completedPaymentRequestId: 1,
      ledger: AR,
      invoiceNumber: 'invoiceNumber1'
    }]
    enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].invoiceCorrectionReference).toBe('invoiceNumber1')
  })
})
