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

const convertPaymentHoldFrns = (frns) => {
  const paymentHoldFrns = []

  for (const frn of frns) {
    const value = {
      sbi: frn.sbi,
      frn: frn.frn
    }
    paymentHoldFrns.push(value)
  }

  return paymentHoldFrns
}

module.exports = {
  convertPaymentHolds,
  convertPaymentHoldCategories,
  convertPaymentHoldFrns
}
