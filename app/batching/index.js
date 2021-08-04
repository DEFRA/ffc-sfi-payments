const generateBatches = require('./generate-batches')
const config = require('../config')

const start = async () => {
  try {
    await generateBatches()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.batchGenerationInterval)
  }
}

module.exports = {
  start
}
