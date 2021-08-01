const { writeToPath } = require('@fast-csv/format')
const path = require('path')

const publishBatch = async (batch, filename, content) => {
  const filepath = path.resolve(__dirname, filename)
  await writeBatchFile(batch, filepath, content)
}

const writeBatchFile = async (batch, filepath, content) => {
  return new Promise(function (resolve, reject) {
    writeToPath(filepath, content)
      .on('error', err => reject(err))
      .on('finish', () => {
        console.log(`${batch.ledger} batch ${batch.sequence} created`)
        resolve()
      })
  })
}

module.exports = publishBatch
