module.exports = (sequelize, DataTypes) => {
  const accountCode = sequelize.define('accountCode', {
    accountCodeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeCodeId: DataTypes.INTEGER,
    lineDescription: DataTypes.STRING,
    accountCodeAP: DataTypes.STRING,
    accountCodeAR: DataTypes.STRING
  },
  {
    tableName: 'accountCodes',
    freezeTableName: true,
    timestamps: false
  })
  accountCode.associate = function (models) {
    accountCode.belongsTo(models.schemeCode, {
      foreignKey: 'schemeCodeId',
      as: 'schemeCode'
    })
  }
  return accountCode
}
