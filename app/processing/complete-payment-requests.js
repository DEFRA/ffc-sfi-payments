const db = require('../data')
const handleZeroValueInvoiceLine = async (completedInvoiceLine, transaction) => {
  // placeholder for whatever function I want to add, for now console maybe?
  console.log('Zero value invoice line', completedInvoiceLine, { transaction })
  await db.zeroValueInvoiceLine.create(completedInvoiceLine, { transaction })
}
const completePaymentRequests = async (scheduleId, paymentRequests) => {
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
          // get this to check for zero value completedInvoiceLine and handle it or else create it in the completedInvoiceLine db ready for outbox
          if (completedInvoiceLine.value === 0) {
            await handleZeroValueInvoiceLine(completedInvoiceLine, transaction)
          } else {
            await db.completedInvoiceLine.create(completedInvoiceLine, { transaction })
          }
        }
        if (!paymentRequest.invoiceLines.every(x => x.value === 0)) {
          await db.outbox.create({ completedPaymentRequestId: savedCompletedPaymentRequest.completedPaymentRequestId }, { transaction })
        }
      }
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = {
  completePaymentRequests
}
