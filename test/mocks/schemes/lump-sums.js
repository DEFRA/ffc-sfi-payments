const { LUMP_SUMS } = require('../../../app/constants/schemes')
const scheme = require('./scheme')

module.exports = {
  ...scheme,
  schemeId: LUMP_SUMS
}
