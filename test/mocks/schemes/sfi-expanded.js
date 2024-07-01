const { SFI_EXPANDED } = require('../../../app/constants/schemes')
const scheme = require('./scheme')

module.exports = {
  ...scheme,
  schemeId: SFI_EXPANDED
}
