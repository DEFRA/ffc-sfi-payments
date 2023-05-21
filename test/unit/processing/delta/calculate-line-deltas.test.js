const { DRD10 } = require('../../../../app/constants/domestic-fund-codes')
const { G00 } = require('../../../../app/constants/line-codes')
const { calculateLineDeltas } = require('../../../../app/processing/delta/calculate-line-deltas')
const { AGREEMENT_NUMBER } = require('../../../mocks/values/agreement-number')
const { SCHEME_CODE } = require('../../../mocks/values/scheme-code')

describe('calculate line deltas', () => {
  test('should calculate delta values by group when one group', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === SCHEME_CODE).value).toBe(2)
  })

  test('should calculate delta values by group when multiple groups', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      value: -8
    }, {
      schemeCode: '80002',
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      value: 11
    }, {
      schemeCode: '80002',
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      value: -7
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === SCHEME_CODE).value).toBe(2)
    expect(lineDeltas.find(x => x.schemeCode === '80002').value).toBe(4)
  })

  test('should calculate delta values by group when agreementNumber is undefined', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: undefined,
      description: G00,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: undefined,
      description: G00,
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === SCHEME_CODE).value).toBe(2)
  })

  test('should calculate delta values by group when multiple groups and agreementNumber is undefined', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: undefined,
      description: G00,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: undefined,
      description: G00,
      value: -8
    }, {
      schemeCode: '80002',
      fundCode: DRD10,
      agreementNumber: undefined,
      description: G00,
      value: 11
    }, {
      schemeCode: '80002',
      fundCode: DRD10,
      agreementNumber: undefined,
      description: G00,
      value: -7
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.schemeCode === SCHEME_CODE).value).toBe(2)
    expect(lineDeltas.find(x => x.schemeCode === '80002').value).toBe(4)
  })

  test('should calculate delta values by group when convergence is mixed', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: false,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: false,
      value: -5
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: true,
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.convergence).value).toBe(-8)
    expect(lineDeltas.find(x => !x.convergence).value).toBe(5)
  })

  test('should calculate delta values by group treating convergence as false when convergence is undefined', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: false,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: undefined,
      value: -5
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: true,
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.convergence).value).toBe(-8)
    expect(lineDeltas.find(x => !x.convergence).value).toBe(5)
  })

  test('should calculate delta values by group treating convergence as false when convergence is null', () => {
    const invoiceLines = [{
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: false,
      value: 10
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: null,
      value: -5
    }, {
      schemeCode: SCHEME_CODE,
      fundCode: DRD10,
      agreementNumber: AGREEMENT_NUMBER,
      description: G00,
      convergence: true,
      value: -8
    }]

    const lineDeltas = calculateLineDeltas(invoiceLines)
    expect(lineDeltas.find(x => x.convergence).value).toBe(-8)
    expect(lineDeltas.find(x => !x.convergence).value).toBe(5)
  })
})
