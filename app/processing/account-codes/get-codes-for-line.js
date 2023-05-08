const { CS } = require('../../constants/schemes')
const { isCapital } = require('../is-cs-capital')

const getCodesForLine = (schemeId, lineCode, schemeCode, accountCodeMap) => {
  if (schemeId === CS) {
    return accountCodeMap.find(x => x.lineCode === lineCode && (isCapital(schemeCode) ? x.capital : x.revenue))
  }
  return accountCodeMap.find(x => x.lineCode === lineCode)
}

module.exports = {
  getCodesForLine
}
