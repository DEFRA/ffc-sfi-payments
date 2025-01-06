const { checkInvoiceNumberBlocked } = require('../../../app/settlement/verify-settlement')

describe('verify invoice number', () => {
  test('should return true if invoice number matches the blocked pattern', () => {
    const blockedInvoiceNumber = 'F0000001C0000001V001'
    const result = checkInvoiceNumberBlocked(blockedInvoiceNumber)
    expect(result).toBe(true)
  })

  test('should return false if invoice number does not match the blocked pattern', () => {
    const regularInvoiceNumber = 'F1234567C1234567V999'
    const result = checkInvoiceNumberBlocked(regularInvoiceNumber)
    expect(result).toBe(false)
  })

  test('should return false if invoice number is undefined', () => {
    const result = checkInvoiceNumberBlocked(undefined)
    expect(result).toBe(false)
  })

  test('should return false if invoice number is an empty string', () => {
    const result = checkInvoiceNumberBlocked('')
    expect(result).toBe(false)
  })

  test('should return false if invoice number is null', () => {
    const result = checkInvoiceNumberBlocked(null)
    expect(result).toBe(false)
  })
})
