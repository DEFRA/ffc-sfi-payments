const db = require('../../app/data')

const addFRNToClosureDB = async (frn) => {
  const savedFRN = await db.frnClosed.create({ frn })
  return savedFRN
}

module.exports = {
  addFRNToClosureDB
}
