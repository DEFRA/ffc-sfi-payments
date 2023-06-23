const { ERD14, EGF00 } = require('../../constants/eu-fund-codes')
const { EXQ00 } = require('../../constants/domestic-fund-codes')

const getFundCode = (fundCode, domesticFundCode, stateAid = false) => {
  if (stateAid) {
    return fundCode
  }
  return fundCode === EGF00 || fundCode === ERD14 || fundCode === EXQ00 ? domesticFundCode : fundCode
}

module.exports = {
  getFundCode
}
