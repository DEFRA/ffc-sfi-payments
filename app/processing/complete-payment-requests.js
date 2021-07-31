const db = require('../data')

const completePaymentRequest = async (scheduleId, paymentRequests) => {
  const transaction = await db.sequelize.transaction()
  try {
    const schedule = await db.schedule.findByPk(scheduleId, { transaction })

    // Check if completed already in case of duplicate processing
    if (schedule.completed === null) {
      await db.schedule.update({ completed: new Date() }, { where: { scheduleId }, transaction })
      for (const paymentRequest of paymentRequests) {
        const completedPaymentRequest = await db.completedPaymentRequest.create(paymentRequest, { transaction })
        paymentRequest.invoiceLines.map(x => {
          return {
            ...x, completedPaymentRequestId: completedPaymentRequest.completedPaymentRequestId
          }
        })
        await db.completedInvoiceLine.bulkCreate(paymentRequest.invoiceLines, { transaction })
      }
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = completePaymentRequest
