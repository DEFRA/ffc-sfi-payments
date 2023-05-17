const { SFI_PILOT } = require('../../../app/constants/schemes')
const scheme = require('./scheme')

module.exports = {
  ...scheme,
  schemeId: SFI_PILOT
}
