module.exports = (sequelize, DataTypes) => {
  const frnAgreementClosed = sequelize.define('frnAgreementClosed', {
    closedId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    frn: DataTypes.BIGINT,
    agreementNumber: DataTypes.STRING,
    closureDate: DataTypes.DATE
  },
  {
    tableName: 'frnAgreementClosed',
    freezeTableName: true,
    timestamps: false
  })
  return frnAgreementClosed
}
