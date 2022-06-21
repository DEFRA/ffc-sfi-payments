module.exports = (sequelize, DataTypes) => {
  const scheme = sequelize.define('scheme', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING
  },
  {
    tableName: 'schemes',
    freezeTableName: true,
    timestamps: false
  })
  scheme.associate = function (models) {
    scheme.hasMany(models.holdCategory, {
      foreignKey: 'schemeId',
      as: 'holdCategories'
    })
    scheme.hasMany(models.paymentRequest, {
      foreignKey: 'schemeId',
      as: 'paymentRequests'
    })
    scheme.hasMany(models.completedPaymentRequest, {
      foreignKey: 'schemeId',
      as: 'completedPaymentRequests'
    })
    scheme.hasMany(models.accountCode, {
      foreignKey: 'schemeId',
      as: 'accountCodes'
    })
  }
  return scheme
}
