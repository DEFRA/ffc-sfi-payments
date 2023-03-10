const { AP, AR } = require('../../constants/ledgers')

const getDefaultLedger = (overallDelta) => {
  return overallDelta < 0 ? AR : AP
}

module.exports = getDefaultLedger
