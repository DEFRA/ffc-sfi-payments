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
  scheme.associate = function (models) {
    scheme.hasOne(models.sequence, {
      foreignKey: 'schemeId',
      as: 'sequence'
    })
    scheme.hasMany(models.holdCategory, {
      foreignKey: 'schemeId',
      as: 'holdCategories'
    })
    scheme.hasOne(models.fundCode, {
      foreignKey: 'schemeId',
      as: 'fundCode'
    })
    scheme.hasOne(models.deliveryBody, {
      foreignKey: 'schemeId',
      as: 'deliveryBody'
    })
    scheme.hasMany(models.sourceSystem, {
      foreignKey: 'schemeId',
      as: 'sourceSystems'
    })
  }
  return scheme
}
