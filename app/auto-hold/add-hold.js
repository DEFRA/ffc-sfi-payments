const db = require('../data')
const { ADDED } = require('../constants/hold-statuses')
const { sendHoldEvent } = require('../event')

const addHold = async (deltaPaymentRequest, autoHoldCategoryId, transaction) => {
  const { frn, marketingYear, agreementNumber } = deltaPaymentRequest
  const hold = await db.autoHold.create({ frn, autoHoldCategoryId, marketingYear, agreementNumber, added: Date.now() }, { transaction })
  await sendHoldEvent(hold.get({ plain: true }), ADDED)
}

module.exports = { addHold }
