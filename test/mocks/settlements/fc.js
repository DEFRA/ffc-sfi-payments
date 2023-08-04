const settlement = require('./settlement')
const { GLOS } = require('../../../app/constants/source-systems')
const { AGREEMENT_NUMBER } = require('../values/agreement-number')
const { CONTRACT_NUMBER } = require('../values/contract-number')

module.exports = {
  ...settlement,
  sourceSystem: GLOS,
  agreementNumber: AGREEMENT_NUMBER,
  claimNumber: CONTRACT_NUMBER
}
