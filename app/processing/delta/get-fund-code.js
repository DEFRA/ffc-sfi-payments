const { ERD14, EGF00 } = require('../../constants/eu-fund-codes')

const getFundCode = (fundCode, domesticFundCode) => {
  return fundCode.replace(ERD14, domesticFundCode).replace(EGF00, domesticFundCode)
}

module.exports = {
  getFundCode
}
