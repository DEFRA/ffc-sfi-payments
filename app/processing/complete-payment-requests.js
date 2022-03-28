const db = require('../data')

const completePaymentRequest = async (scheduleId, paymentRequests) => {
  const transaction = await db.sequelize.transaction()
  try {
    const schedule = await db.schedule.findByPk(scheduleId, { transaction })
    // Check if completed already in case of duplicate processing
    if (schedule.completed === null) {
      await db.schedule.update({ completed: new Date() }, { where: { scheduleId }, transaction })
      for (const paymentRequest of paymentRequests) {
        // Extract data values from Sequelize object if exists
        const completedPaymentRequest = paymentRequest.dataValues ?? paymentRequest
        const savedCompletedPaymentRequest = await db.completedPaymentRequest.create(completedPaymentRequest, { transaction })
        for (const invoiceLine of paymentRequest.invoiceLines) {
          // Extract data values from Sequelize object if exists
          const completedInvoiceLine = invoiceLine.dataValues ?? invoiceLine
          completedInvoiceLine.completedPaymentRequestId = savedCompletedPaymentRequest.completedPaymentRequestId
          await db.completedInvoiceLine.create(completedInvoiceLine, { transaction })
        }
      }
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = completePaymentRequest
