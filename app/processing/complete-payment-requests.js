const util = require('util')
const db = require('../data')
const { sendZeroValueEvent } = require('../event')

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
          if (completedInvoiceLine.value !== 0) {
            await db.completedInvoiceLine.create(completedInvoiceLine, { transaction })
          }
        }
        if (!paymentRequest.invoiceLines.every(x => x.value === 0)) {
          await db.outbox.create({ completedPaymentRequestId: savedCompletedPaymentRequest.completedPaymentRequestId }, { transaction })
        } else {
          await sendZeroValueEvent(paymentRequest)
          console.log('Payment request processed with no change to report:', util.inspect(paymentRequest, false, null, true))
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
