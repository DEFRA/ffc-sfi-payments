const { AP, AR } = require('../../../app/constants/ledgers')
const { ignoreZeroValueSplits } = require('../../../app/processing/ignore-zero-value-splits')

describe('ignore zero value splits', () => {
  test('should return an empty array when passed an empty array', () => {
    const result = ignoreZeroValueSplits([])
    expect(result).toEqual([])
  })

  test('should remove all zero value pairs from the array', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: 200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: -300
      }
    ]

    const expectedOutput = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: 200
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(expectedOutput)
  })

  test('should not remove any elements if no zero value pairs are found', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: 200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })

  test('should not remove any elements if a pair has different payment request numbers', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: -100
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })

  test('should not remove any elements if a pair has different original invoice numbers', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: 200
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '654',
        ledger: AP,
        value: -200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })

  test('should not remove any elements if a pair has different ledgers', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: 200
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AR,
        value: -200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })

  test('should not remove any elements if a pair has AR ledger', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AR,
        value: 200
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AR,
        value: -200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })

  test('should not remove any elements if a pair has non cancelling out values', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        ledger: AP,
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: 200
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        ledger: AP,
        value: -300
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        ledger: AP,
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })
})
