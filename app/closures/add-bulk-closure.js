const db = require('../data')

const addBulkClosure = async (data) => {
  for (let i = 0; i < data.length; i++) {
    data[i].schemeId = 1
  }
  await db.frnAgreementClosed.bulkCreate(data)
}

module.exports = { addBulkClosure }
