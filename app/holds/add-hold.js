const db = require('../data')
const sendEvent = require('../events')
const getHoldCategory = require('./get-hold-category')

const addHold = async (frn, holdCategoryId, transaction) => {
  await db.hold.create({ frn, holdCategoryId, added: Date.now() }, { transaction })
  const holdCategory = await getHoldCategory(holdCategoryId)
  await sendEvent({ frn, scheme: holdCategory.scheme.name, holdCategory: holdCategory.name }, 'uk.gov.pay.hold.added')
}

module.exports = addHold
