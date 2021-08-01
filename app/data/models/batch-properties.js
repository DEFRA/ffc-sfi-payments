module.exports = (sequelize, DataTypes) => {
  const sequence = sequelize.define('batchProperties', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    prefix: DataTypes.STRING,
    suffix: DataTypes.STRING,
    source: DataTypes.STRING
  },
  {
    tableName: 'batchProperties',
    freezeTableName: true,
    timestamps: false
  })
  sequence.associate = function (models) {
    sequence.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return sequence
}
