const createMessage = (paymentRequest) => {
  return {
    body: paymentRequest,
    type: 'uk.gov.sfi.payment.processed',
    source: 'ffc-pay-processing'
  }
}

module.exports = createMessage
