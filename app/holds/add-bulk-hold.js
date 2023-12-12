const { addHold } = require('./add-hold')

const addBulkHold = async (data, holdCategoryId, transaction) => {
  for (let i = 0; i < data.length; i++) {
    addHold(data[i], holdCategoryId, transaction)
  }
}

module.exports = { addBulkHold }
