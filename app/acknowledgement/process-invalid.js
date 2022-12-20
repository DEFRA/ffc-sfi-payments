const db = require('../data')
const { getHoldCategoryId } = require('../holds')
const getHoldCategoryName = require('./get-hold-category-name')
const holdAndReschedule = require('../reschedule')
const { resetPaymentRequestById } = require('../reset')
const { sendInvalidBankDetailsEvent } = require('../event')

const processInvalid = async (schemeId, paymentRequestId, frn, message) => {
  const transaction = await db.sequelize.transaction()
  try {
    await resetPaymentRequestById(paymentRequestId, schemeId, transaction)
    const holdCategoryName = getHoldCategoryName(message)
    const holdCategoryId = await getHoldCategoryId(schemeId, holdCategoryName, transaction)
    await holdAndReschedule(schemeId, paymentRequestId, holdCategoryId, frn, transaction)
    if (holdCategoryName === 'Bank account anomaly') {
      await sendInvalidBankDetailsEvent(message)
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processInvalid
