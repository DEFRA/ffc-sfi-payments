const db = require('../data')

const removeClosureById = async (closedId) => {
  await db.frnAgreementClosed.destroy({ where: { closedId } })
}

module.exports = {
  removeClosureById
}
