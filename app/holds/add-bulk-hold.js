const { addHold } = require('./add-hold')

const addBulkHold = async (data, holdCategoryId, transaction) => {
  for (const frn of data) {
    addHold(frn, holdCategoryId, transaction)
  }
}

module.exports = { addBulkHold }
