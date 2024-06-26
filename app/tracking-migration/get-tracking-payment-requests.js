const db = require('../data')

const getTrackingPaymentRequests = async (limit) => {
  const transaction = await db.sequelize.transaction()
  try {
    const prToSend = await db.paymentRequest.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { sentToTracking: false },
          { sentToTracking: null }
        ],
        [db.Sequelize.Op.and]: [
          {
            [db.Sequelize.Op.or]: [
              { received: { [db.Sequelize.Op.lte]: new Date('2024-06-24') } },
              { migrationId: { [db.Sequelize.Op.ne]: null } }
            ]
          }
        ]
      },
      include: [{
        model: db.completedPaymentRequest,
        as: 'completedPaymentRequests',
        required: false
      }, {
        model: db.invoiceLine,
        as: 'invoiceLines',
        required: false
      }],
      limit,
      transaction
    })

    const paymentRequestIds = prToSend.map(pr => pr.paymentRequestId)
    if (paymentRequestIds.length) {
      await db.paymentRequest.update(
        { sentToTracking: true },
        {
          where: {
            paymentRequestId: paymentRequestIds
          },
          transaction
        }
      )
    }
    await transaction.commit()
    return prToSend
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

module.exports = {
  getTrackingPaymentRequests
}
