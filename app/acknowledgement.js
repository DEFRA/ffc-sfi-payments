const db = require('./data')

const updateAcknowledgement = async (acknowledgement) => {
  if (acknowledgement.success) {
    await db.completedPaymentRequest.update({ acknowledged: acknowledgement.acknowledged }, { where: { invoiceNumber: acknowledgement.invoiceNumber } })
  }
}

module.exports = updateAcknowledgement
