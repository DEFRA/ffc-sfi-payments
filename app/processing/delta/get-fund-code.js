const { ERD14, EGF00 } = require('../../constants/eu-fund-codes')
const { EXQ00 } = require('../../constants/domestic-fund-codes')

const getFundCode = (fundCode, domesticFundCode, stateAid = false) => {
  if (stateAid) {
    return fundCode
  }
  return fundCode.replace(EGF00, domesticFundCode).replace(ERD14, domesticFundCode).replace(EXQ00, domesticFundCode)
}

module.exports = {
  getFundCode
}
