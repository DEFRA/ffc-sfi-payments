const db = require('../data')

const addBulkClosure = async (data) => {
  for (const closure of data) {
    closure.schemeId = 1
  }
  await db.frnAgreementClosed.bulkCreate(data)
}

module.exports = { addBulkClosure }
