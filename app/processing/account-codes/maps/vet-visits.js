const { SOS210 } = require('../../../constants/account-codes/ap')
const { SOS330 } = require('../../../constants/account-codes/ar-admin')
const { SOS310 } = require('../../../constants/account-codes/ar-irregular')
const { G00 } = require('../../../constants/line-codes')

module.exports = [{
  lineCode: G00,
  ap: SOS210,
  arAdmin: SOS330,
  arIrregular: SOS310
}]
