const db = require('../../data')
const { getHoldCategoryId } = require('../../holds')
const { holdAndReschedule } = require('../../reschedule')

const applyHold = async (schemeId, paymentRequestId, frn, category) => {
  const transaction = await db.sequelize.transaction()
  try {
    console.log(`${category} automatically held: ${frn}`)
    const holdCategoryId = await getHoldCategoryId(schemeId, category, transaction)
    await holdAndReschedule(schemeId, paymentRequestId, holdCategoryId, frn, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  applyHold
}
