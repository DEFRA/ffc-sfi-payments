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
    scheme.hasOne(models.sequence, {
      foreignKey: 'schemeId',
      as: 'sequence'
    })
    scheme.hasMany(models.holdCategory, {
      foreignKey: 'schemeId',
      as: 'holdCategories'
    })
  }
  return scheme
}
