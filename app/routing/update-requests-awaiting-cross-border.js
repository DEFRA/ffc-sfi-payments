const db = require('../data')
const { removeAutoHold } = require('../auto-hold')
const { CROSS_BORDER } = require('../constants/hold-categories-names')
const { saveInvoiceLines } = require('../inbound/save-invoice-lines')
const { invalidateInvoiceLines } = require('./invalidate-invoice-lines')

const updateRequestsAwaitingCrossBorder = async (paymentRequest) => {
  const transaction = await db.sequelize.transaction()
  try {
    const originalPaymentRequest = await db.paymentRequest.findOne({ transaction, where: { invoiceNumber: paymentRequest.invoiceNumber } })

    if (!originalPaymentRequest) {
      throw new Error(`No payment request matching Cross Border invoice number: ${paymentRequest.invoiceNumber}`)
    }

    await db.paymentRequest.update({
      deliveryBody: paymentRequest.deliveryBody,
      value: paymentRequest.value
    }, {
      transaction,
      where: { paymentRequestId: originalPaymentRequest.paymentRequestId }
    })

    await invalidateInvoiceLines(originalPaymentRequest.paymentRequestId, transaction)
    await saveInvoiceLines(paymentRequest.invoiceLines, originalPaymentRequest.paymentRequestId, transaction)
    await removeAutoHold(paymentRequest, CROSS_BORDER)
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    console.log(err)
  }
}

module.exports = {
  updateRequestsAwaitingCrossBorder
}
