const moment = require('moment')

const getFileName = (batch) => {
  return `PFELM${batch.sequence.padStart(4, '0')}_${batch.ledger}_${moment(batch.started).format('YYYYMMDDHHmmss')} (SITI).csv`
}

module.exports = getFileName
