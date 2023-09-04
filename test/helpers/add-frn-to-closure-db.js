const db = require('../../app/data')

const addFRNToClosureDB = async (frn) => {
  const savedFRN = await db.frnClosed.create({ frn: frn })
  return savedFRN
}

module.exports = {
  addFRNToClosureDB
}
