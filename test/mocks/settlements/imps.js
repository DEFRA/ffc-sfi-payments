const settlement = require('./settlement')
const { IMPS } = require('../../../app/constants/source-systems')
const { AGREEMENT_NUMBER } = require('../values/agreement-number')

module.exports = {
  ...settlement,
  sourceSystem: IMPS,
  transactionNumber: `${AGREEMENT_NUMBER}-001-001`
}
