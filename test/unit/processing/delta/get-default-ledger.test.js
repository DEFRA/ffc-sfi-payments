const { AP, AR } = require('../../../../app/constants/ledgers')
const { getDefaultLedger } = require('../../../../app/processing/delta/get-default-ledger')

describe('get default ledger', () => {
  test('should return AP if top up', () => {
    const defaultLedger = getDefaultLedger(100)
    expect(defaultLedger).toBe(AP)
  })

  test('should return AR if recovery', () => {
    const defaultLedger = getDefaultLedger(-100)
    expect(defaultLedger).toBe(AR)
  })

  test('should return AP if zero value', () => {
    const defaultLedger = getDefaultLedger(0)
    expect(defaultLedger).toBe(AP)
  })
})
