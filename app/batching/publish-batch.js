const publishBatch = async (batch, filename, content) => {
  console.info(`Publishing ${batch.scheme.name} ${batch.ledger} batch ${batch.sequence}`)
  console.info(`Filename: ${filename}`)
  console.info(`content: ${JSON.stringify(content)}`)
}

module.exports = publishBatch
