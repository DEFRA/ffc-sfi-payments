const { VET_VISITS } = require('../../../app/constants/schemes')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: VET_VISITS
}
