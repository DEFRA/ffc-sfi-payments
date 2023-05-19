const { MANUAL } = require('../../../app/constants/schemes')
const { PILLAR } = require('../values/pillar')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: MANUAL,
  pillar: PILLAR
}
