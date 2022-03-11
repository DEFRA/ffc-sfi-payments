const { AP, AR } = require('../../../../app/ledgers')
const getOriginalSettlementDate = require('../../../../app/processing/enrichment/get-original-settlement-date')

describe('get original settlement date', () => {
  test('should return undefined if no previous requests', () => {
    const paymentRequests = []
    const originalSettlementDate = getOriginalSettlementDate(paymentRequests)
    expect(originalSettlementDate).toBeUndefined()
  })

  test('should return undefined if no previous AP requests', () => {
    const paymentRequests = [{
      ledger: AR
    }]
    const originalSettlementDate = getOriginalSettlementDate(paymentRequests)
    expect(originalSettlementDate).toBeUndefined()
  })

  test('should return settlement date of AP request', () => {
    const paymentRequests = [{
      lastSettlement: new Date(2022, 8, 6),
      ledger: AP
    }]
    const originalSettlementDate = getOriginalSettlementDate(paymentRequests)
    expect(originalSettlementDate).toEqual('06/08/2022')
  })

  test('should return undefined if outstanding only', () => {
    const paymentRequests = [{
      lastSettlement: null,
      ledger: AP
    }]
    const originalSettlementDate = getOriginalSettlementDate(paymentRequests)
    expect(originalSettlementDate).toBeUndefined()
  })

  test('should return undefined if outstanding only', () => {
    const paymentRequests = [{
      ledger: AP
    }]
    const originalSettlementDate = getOriginalSettlementDate(paymentRequests)
    expect(originalSettlementDate).toBeUndefined()
  })

  test('should return first AP request', () => {
    const paymentRequests = [{
      lastSettlement: new Date(2022, 7, 6),
      ledger: AP
    }, {
      lastSettlement: new Date(2022, 6, 6),
      ledger: AP
    }, {
      lastSettlement: new Date(2022, 9, 6),
      ledger: AP
    }]
    const originalSettlementDate = getOriginalSettlementDate(paymentRequests)
    expect(originalSettlementDate).toEqual('06/06/2022')
  })
})
