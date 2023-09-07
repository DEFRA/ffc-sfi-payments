const db = require('../data')

const isAgreementClosed = async (paymentRequest) => {
  const { schemeId, frn, agreementNumber } = paymentRequest
  const currentDate = new Date()
  const agreement = await db.frnAgreementClosed.findOne({
    where: { schemeId, frn, agreementNumber },
    raw: true
  })
  if (agreement === null) {
    return false
  }
  if (agreement.closureDate <= currentDate) {
    console.log(`Agreement number ${agreementNumber} for scheme ID ${schemeId} under FRN ${frn} has been closed. AR will be stripped and request editor skipped.`)
    return true
  }

  return false
}

module.exports = {
  isAgreementClosed
}
