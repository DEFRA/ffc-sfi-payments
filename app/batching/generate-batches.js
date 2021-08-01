const allocateToBatches = require('./allocate-to-batches')

const generateBatches = async () => {
  await allocateToBatches()
}

module.exports = generateBatches
