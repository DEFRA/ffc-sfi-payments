const capitalSchemes = require('../constants/capital-schemes')

const isCapital = (schemeCode) => {
  return capitalSchemes.includes(schemeCode)
}

module.exports = {
  isCapital
}
