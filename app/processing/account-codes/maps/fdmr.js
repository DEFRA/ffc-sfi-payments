const { SOS216, SOS350 } = require('../../../constants/account-codes/ap')
const { SOS330, SOS464 } = require('../../../constants/account-codes/ar-admin')
const { SOS310, SOS444 } = require('../../../constants/account-codes/ar-irregular')
const { G01, P25 } = require('../../../constants/line-codes')

module.exports = [{
  lineCode: G01,
  ap: SOS216,
  arAdmin: SOS330,
  arIrregular: SOS310
}, {
  lineCode: P25,
  ap: SOS350,
  arAdmin: SOS464,
  arIrregular: SOS444
}]
