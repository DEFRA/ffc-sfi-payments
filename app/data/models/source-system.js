module.exports = (sequelize, DataTypes) => {
  const sourceSystem = sequelize.define('sourceSystem', {
    sourceSystemId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    name: DataTypes.STRING
  },
  {
    tableName: 'sourceSystems',
    freezeTableName: true,
    timestamps: false
  })
  sourceSystem.associate = function (models) {
    sourceSystem.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return sourceSystem
}
