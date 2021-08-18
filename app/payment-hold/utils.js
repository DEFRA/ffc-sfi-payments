const convertPaymentHolds = (holds) => {
  const paymentHolds = []

  for (const hold of holds) {
    const payment = {
      holdId: hold.holdId,
      frn: hold.frn,
      holdCategoryName: hold.holdCategory.name,
      dateTimeAdded: hold.added,
      dateTimeClosed: hold.closed
    }
    paymentHolds.push(payment)
  }

  return paymentHolds
}

const convertPaymentHoldCategories = (holdCategories) => {
  const paymentHoldCategories = []

  for (const holdCategory of holdCategories) {
    const category = {
      holdCategoryId: holdCategory.holdCategoryId,
      name: holdCategory.name
    }
    paymentHoldCategories.push(category)
  }

  return paymentHoldCategories
}

module.exports = {
  convertPaymentHolds,
  convertPaymentHoldCategories
}
