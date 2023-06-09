const { CS } = require('../../constants/schemes')
const { isCapital } = require('../is-capital')

const getCodesForLine = (schemeId, lineCode, schemeCode, stateAid, accountCodeMap) => {
  if (schemeId === CS) {
    if (stateAid) {
      return accountCodeMap.find(x => x.lineCode === lineCode && x.stateAid)
    }
    return accountCodeMap.find(x => x.lineCode === lineCode && !x.schemeId && (isCapital(schemeCode) ? x.capital : x.revenue))
  }
  return accountCodeMap.find(x => x.lineCode === lineCode)
}

module.exports = {
  getCodesForLine
}
