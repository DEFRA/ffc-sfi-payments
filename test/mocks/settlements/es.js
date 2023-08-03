const settlement = require('./settlement')
const { GENESIS } = require('../../../app/constants/source-systems')
const { AGREEMENT_NUMBER } = require('../values/agreement-number')

module.exports = {
  ...settlement,
  sourceSystem: GENESIS,
  transactionNumber: AGREEMENT_NUMBER
}
