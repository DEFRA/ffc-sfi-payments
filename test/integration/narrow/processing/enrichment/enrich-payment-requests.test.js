const { AP, AR } = require('../../../../../app/constants/ledgers')
const { enrichPaymentRequests } = require('../../../../../app/processing/enrichment')

describe('enrich payment request', () => {
  test('should not make any change if no previous payment requests', () => {
    const paymentRequests = [{
      ledger: AP
    }]
    const previousPaymentRequests = []
    enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].originalSettlementDate).toBeUndefined()
    expect(paymentRequests[0].invoiceCorrectionReference).toBeUndefined()
  })

  test('should not make any change if only AP requests', () => {
    const paymentRequests = [{
      ledger: AP
    }]
    const previousPaymentRequests = [{
      ledger: AP,
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
      ledger: AP,
      lastSettlement: new Date(2021, 8, 4)
    }]
    enrichPaymentRequests(paymentRequests, previousPaymentRequests)
    expect(paymentRequests[0].originalSettlementDate).toEqual('04/09/2021')
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
