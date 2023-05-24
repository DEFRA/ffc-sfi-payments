const { calculateOverallDelta } = require('../../../../app/processing/delta/calculate-overall-delta')

describe('calculate overall delta', () => {
  test('should calculate delta', () => {
    const invoiceLines = [{
      schemeCode: '80001',
      fundCode: 'DRD10',
      description: 'G00',
      value: 10
    }, {
      schemeCode: '80001',
      fundCode: 'DRD10',
      description: 'G00',
      value: -8
    }]

    const delta = calculateOverallDelta(invoiceLines)
    expect(delta).toBe(2)
  })
})
