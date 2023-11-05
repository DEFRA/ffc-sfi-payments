const db = require('../data')
const { removeNullProperties } = require('../remove-null-properties')
const { processingConfig } = require('../config')

const getPendingPaymentRequests = async (transaction) => {
  const outbox = await db.sequelize.query(`
    SELECT
      "outbox".*
    FROM "outbox"
    INNER JOIN "completedPaymentRequests"
      ON "outbox"."completedPaymentRequestId" = "completedPaymentRequests"."completedPaymentRequestId"
    INNER JOIN "completedInvoiceLines"
      ON "completedPaymentRequests"."completedPaymentRequestId" = "completedInvoiceLines"."completedPaymentRequestId"
    WHERE "outbox"."submitted" IS NULL
      AND "completedPaymentRequests"."submitted" IS NULL
    ORDER BY "completedPaymentRequests"."paymentRequestId"
    LIMIT :processingCap
    FOR UPDATE OF "outbox" SKIP LOCKED
    `, {
    replacements: {
      processingCap: processingConfig.processingCap
    },
    transaction,
    type: db.Sequelize.QueryTypes.SELECT,
    raw: true
  })

  const completedPaymentRequests = await db.completedPaymentRequest.findAll({
    transaction,
    include: [{
      model: db.completedInvoiceLine,
      as: 'invoiceLines'
    }],
    where: {
      completedPaymentRequestId: {
        [db.Sequelize.Op.in]: [...outbox.map(x => x.completedPaymentRequestId)]
      }
    }
  })

  return completedPaymentRequests.map(x => x.get({ plain: true })).map(removeNullProperties)
}

module.exports = {
  getPendingPaymentRequests
}
