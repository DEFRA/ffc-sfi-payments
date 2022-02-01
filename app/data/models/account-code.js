module.exports = (sequelize, DataTypes) => {
  const accountCode = sequelize.define('accountCode', {
    accountCodeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    lineDescription: DataTypes.STRING,
    accountCodeAP: DataTypes.STRING,
    accountCodeARAdm: DataTypes.STRING,
    accountCodeARIrr: DataTypes.STRING
  },
  {
    tableName: 'accountCodes',
    freezeTableName: true,
    timestamps: false
  })
  accountCode.associate = function (models) {
    accountCode.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return accountCode
}
