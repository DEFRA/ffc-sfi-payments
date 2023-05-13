const { SCHEME_CODE } = require('../values/scheme-code')
const { ACCOUNT_CODE } = require('../values/account-code')
const { FUND_CODE } = require('../values/fund-code')
const { GROSS_DESCRIPTION } = require('../values/description')
const { DELIVERY_BODY_NATURAL_ENGLAND } = require('../values/delivery-body')

module.exports = {
  schemeCode: SCHEME_CODE,
  accountCode: ACCOUNT_CODE,
  fundCode: FUND_CODE,
  description: GROSS_DESCRIPTION,
  value: 250.00,
  deliveryBody: DELIVERY_BODY_NATURAL_ENGLAND
}
