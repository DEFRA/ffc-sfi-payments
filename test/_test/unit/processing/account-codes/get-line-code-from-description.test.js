const { getLineCodeFromDescription } = require('../../../../../app/processing/account-codes/get-line-code-from-description')

describe('get line code', () => {
  test('should return first 3 characters of description', () => {
    const description = 'G00 - Some description'
    const result = getLineCodeFromDescription(description)
    expect(result).toBe('G00')
  })
})
