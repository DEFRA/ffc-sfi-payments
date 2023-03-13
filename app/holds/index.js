const getHoldCategoryId = require('./get-hold-category-id')
const getHolds = require('./get-holds')
const getHoldCategories = require('./get-hold-categories')
const addHold = require('./add-hold')
const removeHold = require('./remove-hold')
const getSchemeId = require('./get-scheme-id')

module.exports = {
  getHoldCategoryId,
  getHolds,
  getHoldCategories,
  getSchemeId,
  addHold,
  removeHold
}
