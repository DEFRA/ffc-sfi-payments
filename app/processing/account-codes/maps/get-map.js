const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, CS, BPS, FDMR, SFI23, DELINKED, SFI_EXPANDED } = require('../../../constants/schemes')
const sfi = require('./sfi')
const lumpSums = require('./lump-sums')
const vetVisits = require('./vet-visits')
const cs = require('./cs')
const bps = require('./bps')
const fdmr = require('./fdmr')
const delinked = require('./delinked')

const getMap = (schemeId) => {
  switch (schemeId) {
    case SFI:
    case SFI_PILOT:
    case SFI23:
    case SFI_EXPANDED:
      return sfi
    case LUMP_SUMS:
      return lumpSums
    case VET_VISITS:
      return vetVisits
    case CS:
      return cs
    case BPS:
      return bps
    case FDMR:
      return fdmr
    case DELINKED:
      return delinked
    default:
      throw new Error(`No account codes found for scheme ${schemeId}`)
  }
}

module.exports = {
  getMap
}
