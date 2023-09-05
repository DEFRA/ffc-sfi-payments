const db = require('../data')

const isAgreementClosed = async (paymentRequest) => {
  const schemeId = paymentRequest.schemeId
  const frn = paymentRequest.frn
  const agreementNumber = paymentRequest.agreementNumber
  const todaysDate = new Date()
  const agreement = await db.frnAgreementClosed.findOne({
    where: { schemeId, frn, agreementNumber },
    raw: true
  })
  if (new Date(agreement?.closureDate) < todaysDate) {
    console.log(`Agreement number ${agreementNumber} for scheme ID ${schemeId} under FRN ${frn} has been closed. AR will be stripped and request editor skipped.`)
    return true
  }

  return false
}

module.exports = {
  isAgreementClosed
}
