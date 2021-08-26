const createMessage = (paymentRequest) => {
  return {
    body: paymentRequest,
    type: 'uk.gov.sfi.payment.processed',
    source: 'ffc-sfi-payments'
  }
}

module.exports = createMessage
