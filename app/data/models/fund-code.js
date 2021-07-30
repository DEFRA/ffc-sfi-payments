module.exports = (sequelize, DataTypes) => {
  const fundCode = sequelize.define('fundCode', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    fundCode: DataTypes.STRING
  },
  {
    tableName: 'fundCodes',
    freezeTableName: true,
    timestamps: false
  })
  fundCode.associate = function (models) {
    fundCode.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return fundCode
}
