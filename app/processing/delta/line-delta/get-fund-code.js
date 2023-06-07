const { DRD01 } = require('../../../constants/domestic-fund-codes')
const { ERD14 } = require('../../../constants/eu-fund-codes')

const getFundCode = (fundCode) => {
  return fundCode.replace(DRD01, ERD14)
}

module.exports = {
  getFundCode
}
