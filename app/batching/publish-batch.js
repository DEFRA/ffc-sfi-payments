const publishBatch = async (batch, filename, content) => {
  console.info(`Publishing ${batch.scheme.name} ${batch.ledger} batch ${batch.sequence}`)
  console.log(`Filename: ${filename}`)
  console.log(`content: ${JSON.stringify(content)}`)
}

module.exports = publishBatch
