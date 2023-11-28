const db = require('../data')

const addClosure = async (frn, agreementNumber, closureDate) => {
  await db.frnAgreementClosed.create({ schemeId: 1, frn, agreementNumber, closureDate })
}

module.exports = { addClosure }
