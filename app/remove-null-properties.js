const removeNullProperties = (paymentRequest) => {
  return JSON.parse(JSON.stringify(paymentRequest, (_key, value) => (value === null ? undefined : value)))
}

module.exports = {
  removeNullProperties
}
