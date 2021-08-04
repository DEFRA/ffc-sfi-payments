const moment = require('moment')

const getFileName = (batch) => {
  return `${batch.scheme.batchProperties.prefix}${batch.sequence.toString().padStart(4, '0')}_${batch.ledger}_${moment().format('YYYYMMDDHHmmss')}${batch.scheme.batchProperties.suffix}.csv`
}

module.exports = getFileName
