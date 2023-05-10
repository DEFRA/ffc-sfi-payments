const calculateLineDeltas = require('../../../../app/processing/delta/calculate-line-deltas')

describe('calculate line deltas', () => {
  test('should calculate delta values by group when one group', () => {
    const invoiceLines = [{
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: 'SIP123456789012',
      description: 'G00',
      value: 10
    }, {
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: 'SIP123456789012',
      description: 'G00',
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === '80001').value).toBe(2)
  })

  test('should calculate delta values by group when multiple groups', () => {
    const invoiceLines = [{
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: 'SIP123456789012',
      description: 'G00',
      value: 10
    }, {
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: 'SIP123456789012',
      description: 'G00',
      value: -8
    }, {
      schemeCode: '80002',
      fundCode: 'DRD10',
      agreementNumber: 'SIP123456789012',
      description: 'G00',
      value: 11
    }, {
      schemeCode: '80002',
      fundCode: 'DRD10',
      agreementNumber: 'SIP123456789012',
      description: 'G00',
      value: -7
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === '80001').value).toBe(2)
    expect(lineDeltas.find(x => x.schemeCode === '80002').value).toBe(4)
  })

  test('should calculate delta values by group when agreementNumber is undefined', () => {
    const invoiceLines = [{
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: undefined,
      description: 'G00',
      value: 10
    }, {
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: undefined,
      description: 'G00',
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === '80001').value).toBe(2)
  })

  test('should calculate delta values by group when multiple groups and agreementNumber is undefined', () => {
    const invoiceLines = [{
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: undefined,
      description: 'G00',
      value: 10
    }, {
      schemeCode: '80001',
      fundCode: 'DRD10',
      agreementNumber: undefined,
      description: 'G00',
      value: -8
    }, {
      schemeCode: '80002',
      fundCode: 'DRD10',
      agreementNumber: undefined,
      description: 'G00',
      value: 11
    }, {
      schemeCode: '80002',
      fundCode: 'DRD10',
      agreementNumber: undefined,
      description: 'G00',
      value: -7
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === '80001').value).toBe(2)
    expect(lineDeltas.find(x => x.schemeCode === '80002').value).toBe(4)
  })
})
