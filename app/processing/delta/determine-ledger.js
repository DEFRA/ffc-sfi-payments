const determineLedger = (overallDelta) => {
  return overallDelta <= 0 ? 'AR' : 'AP'
}

module.exports = determineLedger
