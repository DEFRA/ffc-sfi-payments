const { INVALID_BANK_DETAILS } = require('../../../app/constants/dax-rejections')
const { BANK_ACCOUNT_ANOMALY, DAX_REJECTION } = require('../../../app/constants/hold-categories-names')

const { getHoldCategoryName } = require('../../../app/acknowledgement/get-hold-category-name')

describe('get hold category name', () => {
  test('should return bank account anomaly if message is invalid bank details', () => {
    const holdCategoryName = getHoldCategoryName(INVALID_BANK_DETAILS)
    expect(holdCategoryName).toBe(BANK_ACCOUNT_ANOMALY)
  })

  test('should return dax rejection if message is not invalid bank details', () => {
    const holdCategoryName = getHoldCategoryName('not invalid bank details')
    expect(holdCategoryName).toBe(DAX_REJECTION)
  })
})
