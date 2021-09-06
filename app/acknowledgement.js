const db = require('./data')

const updateAcknowledgement = async (acknowledgement) => {
  const completedPaymentRequest = await db.completedPaymentRequest.update({ acknowledged: acknowledgement.acknowledged }, { where: { invoiceNumber: acknowledgement.invoiceNumber } })

  if (!acknowledgement.success) {
    const transaction = await db.sequelize.transaction()
    try {
      await db.completedPaymentRequest.update({ invalid: true }, { where: { paymentRequestId: completedPaymentRequest.paymentRequestId }, transaction })
      const holdCategoryName = acknowledgement.message === 'Invalid bank details' ? acknowledgement.message : 'DAX rejection'
      const holdCategory = await db.holdCategory.findOne({ where: { schemeId: completedPaymentRequest.schemeId, name: holdCategoryName }, transaction })
      const existingHold = await db.hold.findOne({
        transaction,
        lock: true,
        skipLocked: true,
        where: { holdCategoryId: holdCategory.holdCategoryId, frn: completedPaymentRequest.frn }
      })
      if (!existingHold) {
        await db.hold.create({ frn: completedPaymentRequest.frn, holdCategoryId: holdCategory.holdCategoryId, added: Date.now() }, { transaction })
        const existingSchedule = await db.schedule.findOne({
          transaction,
          lock: true,
          skipLocked: true,
          where: { paymentRequestId: completedPaymentRequest.paymentRequestId, completed: null }
        })
        if (!existingSchedule) {
          await db.schedule.create({ schemeId: completedPaymentRequest.schemeId, paymentRequestId: completedPaymentRequest.paymentRequestId, planned: new Date() }, { transaction })
        }
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw (error)
    }
  }
}

module.exports = updateAcknowledgement
