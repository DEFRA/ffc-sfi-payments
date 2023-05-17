const { getHoldCategoryId } = require('./get-hold-category-id')
const { getHolds } = require('./get-holds')
const { getHoldCategories } = require('./get-hold-categories')
const { getSchemeId } = require('./get-scheme-id')
const { addHold } = require('./add-hold')
const { removeHoldById } = require('./remove-hold-by-id')
const { removeHoldByFrn } = require('./remove-hold-by-frn')

module.exports = {
  getHoldCategoryId,
  getHolds,
  getHoldCategories,
  getSchemeId,
  addHold,
  removeHoldById,
  removeHoldByFrn
}
