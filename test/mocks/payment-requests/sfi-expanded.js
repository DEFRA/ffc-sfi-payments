const { SFI_EXPANDED } = require('../../../app/constants/schemes')
const paymentRequest = require('./payment-request')

module.exports = {
  ...paymentRequest,
  schemeId: SFI_EXPANDED
}
