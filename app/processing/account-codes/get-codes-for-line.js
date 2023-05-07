const capitalSchemes = require('../../constants/capital-schemes')
const { CS } = require('../../constants/schemes')

const getCodesForLine = (schemeId, lineCode, schemeCode, accountCodeMap) => {
  if (schemeId === CS) {
    const isCapital = capitalSchemes.includes(schemeCode)
    return accountCodeMap.find(x => x.lineCode === lineCode && (isCapital ? x.capital : x.revenue))
  }
  return accountCodeMap.find(x => x.lineCode === lineCode)
}

module.exports = {
  getCodesForLine
}
