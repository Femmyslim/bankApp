'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class beneficiary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  beneficiary.init({
    fullname: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    fullname: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    bank_account: DataTypes.STRING,
    details: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'beneficiary',
  });
  return beneficiary;
};