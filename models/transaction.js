'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    transaction_id: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    transaction_type: DataTypes.ENUM(1, 2), // 1- debit, 2-credit
    transaction_amount: DataTypes.DECIMAL,
    transaction_description: DataTypes.STRING,
    balance_before: DataTypes.DECIMAL,
    balance_after: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};