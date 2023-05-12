module.exports = (sequelize, DataTypes) => {
  const scheme = sequelize.define('scheme', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  },
  {
    tableName: 'schemes',
    freezeTableName: true,
    timestamps: false
  })
  scheme.associate = (models) => {
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
  }
  return scheme
}
