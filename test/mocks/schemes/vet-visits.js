const { VET_VISITS } = require('../../../app/constants/schemes')
const scheme = require('./scheme')

module.exports = {
  ...scheme,
  schemeId: VET_VISITS
}
