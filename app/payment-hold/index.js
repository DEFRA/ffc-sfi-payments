const db = require('../data')

const getPaymentHolds = async (open) => {
  if (open) {
    return db.hold.findAll({
      include: [
        {
          model: db.holdCategory, as: 'holdCategory'
        }
      ],
      where: {
        closed: null
      }
    })
  } else {
    return db.hold.findAll({
      include: [
        {
          model: db.holdCategory, as: 'holdCategory'
        }
      ]
    })
  }
}

const getPaymentHoldCatgories = async () => {
  return db.holdCategory.findAll()
}

const getPaymentHoldFrns = async () => {
  return db.frn.findAll(
    {
      limit: 20,
      order: [
        ['frn', 'ASC']
      ]
    }
  )
}

const addPaymentHold = async (frn, holdCategoryId) => {
  await db.hold.create({ frn: frn, holdCategoryId: holdCategoryId, added: Date.now() })
}

const removePaymentHold = async (holdId) => {
  await db.hold.update({ closed: Date.now() }, { where: { holdId: holdId } })
}

module.exports = {
  getPaymentHolds,
  getPaymentHoldCatgories,
  getPaymentHoldFrns,
  addPaymentHold,
  removePaymentHold
}
