module.exports = (sequelize, DataTypes) => {
  const schemeCode = sequelize.define('schemeCode', {
    schemeCodeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeCode: DataTypes.STRING
  },
  {
    tableName: 'schemeCodes',
    freezeTableName: true,
    timestamps: false
  })
  schemeCode.associate = function (models) {
    schemeCode.hasMany(models.accountCode, {
      foreignKey: 'schemeCodeId',
      as: 'accountCode'
    })
  }
  return schemeCode
}
