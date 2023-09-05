const db = require('../../app/data')

const addAgreementToClosureDB = async (schemeId, frn, agreementNumber) => {
  const closedId = 1
  const date = new Date()
  const closureDate = date.getFullYear + '-' + date.getMonth() + '-' + date.getDate()
  const savedAgreementClosure = await db.frnAgreementClosed.create({ closedId, schemeId, frn, agreementNumber, closureDate })
  return savedAgreementClosure
}

module.exports = {
  addAgreementToClosureDB
}
