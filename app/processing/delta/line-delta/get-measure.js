const { MEASURE_4, MEASURE_8, MEASURE_10, MEASURE_11, MEASURE_15 } = require('../../../constants/measures')

const getMeasure = (schemeCode) => {
  if (schemeCode.startsWith('520') ||
    schemeCode.startsWith('521') ||
    schemeCode.startsWith('522') ||
    schemeCode.startsWith('523') ||
    schemeCode.startsWith('524') ||
    schemeCode.startsWith('525') ||
    schemeCode.startsWith('526') ||
    schemeCode.startsWith('527') ||
    schemeCode.startsWith('528')
  ) {
    return MEASURE_4
  }
  if (schemeCode.startsWith('55')) {
    return MEASURE_8
  }
  if (schemeCode.startsWith('58')) {
    return MEASURE_11
  }
  if (schemeCode.startsWith('59')) {
    return MEASURE_15
  }
  return MEASURE_10
}

module.exports = {
  getMeasure
}
