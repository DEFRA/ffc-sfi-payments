const { convertToPence } = require('../../currency-convert')
const { createInvoiceNumber } = require('../../invoice-number')
const getDeliveryBody = require('../get-delivery-body')
const getFrn = require('../get-frn')
const getSchemeId = require('../get-scheme-id')
const { AP } = require('../ledgers')

const enrichPaymentRequest = async (paymentRequest, transaction) => {
  paymentRequest.invoiceNumber = createInvoiceNumber(paymentRequest)
  paymentRequest.schemeId = await getSchemeId(paymentRequest.sourceSystem, transaction)
  paymentRequest.ledger = AP
  paymentRequest.value = convertToPence(paymentRequest.value)
  paymentRequest.schemeId = await getSchemeId(paymentRequest.sourceSystem, transaction)
  paymentRequest.frn = await getFrn(paymentRequest.sbi, transaction)
  paymentRequest.deliveryBody = await getDeliveryBody(paymentRequest.schemeId, transaction)
}

module.exports = enrichPaymentRequest
