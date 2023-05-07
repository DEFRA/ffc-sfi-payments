const { SOS710, SOS920, SOS921, SOS922, SOS923, SOS924, SOS925, SOS926, SOS927, SOS928 } = require('../../../constants/account-codes/ap')
const { SOS750, SOS940, SOS941, SOS942, SOS943, SOS944, SOS945, SOS946, SOS948 } = require('../../../constants/account-codes/ar-admin')
const { SOS770, SOS960, SOS961, SOS962, SOS963, SOS964, SOS965, SOS966, SOS967, SOS968 } = require('../../../constants/account-codes/ar-irregular')
const { G00, P02, P05, P06, P08, P14, P22, P23, P24 } = require('../../../constants/line-codes')

module.exports = [{
  lineCode: G00,
  ap: SOS710,
  arAdmin: SOS750,
  arIrregular: SOS770,
  capital: true,
  revenue: true
}, {
  lineCode: P02,
  ap: SOS928,
  arAdmin: SOS948,
  arIrregular: SOS968,
  capital: true,
  revenue: true
}, {
  lineCode: P05,
  ap: SOS921,
  arAdmin: SOS941,
  arIrregular: SOS961,
  capital: true,
  revenue: true
}, {
  lineCode: P06,
  ap: SOS922,
  arAdmin: SOS942,
  arIrregular: SOS962,
  capital: true,
  revenue: true
}, {
  lineCode: P08,
  ap: SOS923,
  arAdmin: SOS943,
  arIrregular: SOS963,
  capital: true,
  revenue: true
}, {
  lineCode: P14,
  ap: SOS924,
  arAdmin: SOS944,
  arIrregular: SOS964,
  capital: true,
  revenue: true
}, {
  lineCode: P22,
  ap: SOS925,
  arAdmin: SOS945,
  arIrregular: SOS965,
  capital: true,
  revenue: true
}, {
  lineCode: P23,
  ap: SOS926,
  arAdmin: SOS946,
  arIrregular: SOS966,
  capital: true,
  revenue: true
}, {
  lineCode: P24,
  ap: SOS920,
  arAdmin: SOS940,
  arIrregular: SOS967,
  capital: true,
  revenue: false
}, {
  lineCode: P24,
  ap: SOS927,
  arAdmin: SOS960,
  arIrregular: SOS967,
  capital: false,
  revenue: true
}]
