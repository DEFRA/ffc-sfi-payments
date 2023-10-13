const { CROSS_BORDER } = require('../../../app/constants/delivery-bodies')

const { isCrossBorder } = require('../../../app/processing/is-cross-border')

let invoiceLines

describe('is cross border', () => {
  test('should return true if only line has cross border delivery body', () => {
    invoiceLines = [{
      deliveryBody: CROSS_BORDER
    }]
    expect(isCrossBorder(invoiceLines)).toBe(true)
  })

  test('should return true if multiple lines have cross border delivery body', () => {
    invoiceLines = [{
      deliveryBody: CROSS_BORDER
    }, {
      deliveryBody: CROSS_BORDER
    }]
    expect(isCrossBorder(invoiceLines)).toBe(true)
  })

  test('should return true if at least one line has cross border delivery body', () => {
    invoiceLines = [{
      deliveryBody: CROSS_BORDER
    }, {
      deliveryBody: 'Something else'
    }]
    expect(isCrossBorder(invoiceLines)).toBe(true)
  })

  test('should return false if no lines have cross border delivery body', () => {
    invoiceLines = [{
      deliveryBody: 'Something else'
    }]
    expect(isCrossBorder(invoiceLines)).toBe(false)
  })

  test('should return false if no lines', () => {
    invoiceLines = []
    expect(isCrossBorder(invoiceLines)).toBe(false)
  })

  test('should return false if lines undefined', () => {
    expect(isCrossBorder(invoiceLines)).toBe(false)
  })
})
