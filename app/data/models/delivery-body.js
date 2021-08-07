module.exports = (sequelize, DataTypes) => {
  const deliveryBody = sequelize.define('deliveryBody', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    deliveryBody: DataTypes.STRING
  },
  {
    tableName: 'deliveryBodies',
    freezeTableName: true,
    timestamps: false
  })
  deliveryBody.associate = function (models) {
    deliveryBody.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return deliveryBody
}
