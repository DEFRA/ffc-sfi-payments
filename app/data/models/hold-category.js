module.exports = (sequelize, DataTypes) => {
  const holdCategory = sequelize.define('scheme', {
    holdCategoryId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    name: DataTypes.STRING
  },
  {
    tableName: 'holdCategories',
    freezeTableName: true,
    timestamps: false
  })
  holdCategory.associate = function (models) {
    holdCategory.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
    holdCategory.hasMany(models.hold, {
      foreignKey: 'holdCategoryId',
      as: 'holds'
    })
  }
  return holdCategory
}
