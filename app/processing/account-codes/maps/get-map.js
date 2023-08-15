const { SFI, SFI_PILOT, LUMP_SUMS, VET_VISITS, CS, BPS, FDMR, SFI23 } = require('../../../constants/schemes')
const sfi = require('./sfi')
const lumpSums = require('./lump-sums')
const vetVisits = require('./vet-visits')
const cs = require('./cs')
const bps = require('./bps')
const fdmr = require('./fdmr')

const getMap = (schemeId) => {
  switch (schemeId) {
    case SFI:
    case SFI_PILOT:
    case SFI23:
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
    default:
      throw new Error(`No account codes found for scheme ${schemeId}`)
  }
}

module.exports = {
  getMap
}
