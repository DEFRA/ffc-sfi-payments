const { getLineCode } = require('../../../../../app/processing/account-codes/get-line-code')

describe('get line code', () => {
  test('should return first 3 characters of description', () => {
    const description = 'G00 - Some description'
    const result = getLineCode(description)
    expect(result).toBe('G00')
  })
})
