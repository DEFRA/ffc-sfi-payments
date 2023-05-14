const capitalSchemes = require('../../../app/constants/capital-schemes')
const { isCapital } = require('../../../app/processing/is-capital')

describe('is capital', () => {
  test.each(capitalSchemes)('should return true for %s', (schemeCode) => {
    expect(isCapital(schemeCode)).toBe(true)
  })

  test('should return false for non-capital scheme', () => {
    expect(isCapital('1234A')).toBe(false)
  })
})
