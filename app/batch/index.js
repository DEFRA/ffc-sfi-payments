const generateBatch = require('./generate-batch')
const config = require('../config')

const start = async () => {
  try {
    await generateBatch()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.batchGenerationInterval)
  }
}

module.exports = {
  start
}
