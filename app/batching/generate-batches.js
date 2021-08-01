const allocateToBatches = require('./allocate-to-batches')
const getBatches = require('./get-batches')
const getFileName = require('./get-filename')
const getContent = require('./get-content')
const publishBatch = require('./publish-batch')
const completeBatch = require('./complete-batch')

const generateBatches = async () => {
  await allocateToBatches()
  const batches = await getBatches()
  for (const batch of batches) {
    const filename = getFileName(batch)
    const content = getContent(batch)
    await publishBatch(batch, filename, content)
    await completeBatch(batch.batchId)
  }
}

module.exports = generateBatches
