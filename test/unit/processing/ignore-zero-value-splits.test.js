const { ignoreZeroValueSplits } = require('../../../app/processing/ignore-zero-value-splits')

describe('ignore zero value splits', () => {
  test('should return an empty array when passed an empty array', () => {
    const result = ignoreZeroValueSplits([])
    expect(result).toEqual([])
  })

  test('should remove the negative side of zero value pairs from the array', () => {
    const input = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        value: 100
      },
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        value: -100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        value: 200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        value: 300
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        value: -300
      }
    ]

    const expectedOutput = [
      {
        paymentRequestNumber: 1,
        originalInvoiceNumber: '123',
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        value: 200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        value: 300
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
        value: 100
      },
      {
        paymentRequestNumber: 2,
        originalInvoiceNumber: '456',
        value: 200
      },
      {
        paymentRequestNumber: 3,
        originalInvoiceNumber: '789',
        value: 300
      }
    ]

    const result = ignoreZeroValueSplits(input)
    expect(result).toEqual(input)
  })
})
