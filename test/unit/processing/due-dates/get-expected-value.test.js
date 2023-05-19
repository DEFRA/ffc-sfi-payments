const { getExpectedValue } = require('../../../../app/processing/due-dates/get-expected-value')

describe('get expected value', () => {
  test.each([
    [100, 4, 1, 25],
    [100, 4, 2, 50],
    [100, 4, 3, 75],
    [100, 4, 4, 100],
    [100, 3, 1, 33],
    [100, 3, 2, 66],
    [100, 3, 3, 100],
    [100, 2, 1, 50],
    [100, 2, 2, 100],
    [100, 1, 1, 100]
  ])('should calculated expected value', (totalValue, totalPayments, segment, expectedValue) => {
    const result = getExpectedValue(totalValue, totalPayments, segment)
    expect(result).toBe(expectedValue)
  })
})
