const { SOS210, SOS471, SOS472, SOS473, SOS474 } = require('../../../constants/account-codes/ap')
const { SOS210: SOS210Ad, SOS471: SOS471Ad, SOS472: SOS472Ad, SOS473: SOS473Ad, SOS474: SOS474Ad } = require('../../../constants/account-codes/ar-admin')
const { SOS210: SOS210Irr, SOS471: SOS471Irr, SOS472: SOS472Irr, SOS473: SOS473Irr, SOS474: SOS474Irr } = require('../../../constants/account-codes/ar-irregular')
const { G00, X01, X02, X03, X04 } = require('../../../constants/line-codes')

module.exports = [{
  lineCode: G00,
  ap: SOS210,
  arAdmin: SOS210Ad,
  arIrregular: SOS210Irr
}, {
  lineCode: X01,
  ap: SOS471,
  arAdmin: SOS471Ad,
  arIrregular: SOS471Irr
}, {
  lineCode: X02,
  ap: SOS472,
  arAdmin: SOS472Ad,
  arIrregular: SOS472Irr
}, {
  lineCode: X03,
  ap: SOS473,
  arAdmin: SOS473Ad,
  arIrregular: SOS473Irr
}, {
  lineCode: X04,
  ap: SOS474,
  arAdmin: SOS474Ad,
  arIrregular: SOS474Irr
}]
