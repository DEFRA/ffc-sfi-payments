const getHold = require('./get-hold')
const db = require('../data')
const sendEvent = require('../events')

const removeHold = async (holdId) => {
  await db.hold.update({ closed: Date.now() }, { where: { holdId: holdId } })
  const hold = await getHold(holdId)
  await sendEvent({ frn: hold.frn, scheme: hold.holdCategory.scheme.name, holdCategory: hold.holdCategory.name }, 'uk.gov.sfi.payment.hold.removed')
}

module.exports = removeHold
