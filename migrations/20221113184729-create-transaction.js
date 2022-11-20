'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.STRING,
        unique: true
      },
      customer_id: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'customer_id'
        }
      },
      transaction_type: {
        type: Sequelize.ENUM('1', '2'), //1- debit, 2-credit
      },
      transaction_description: {
        type: Sequelize.STRING
      },
      balance_before: {
        type: Sequelize.DECIMAL(20, 2)
      },
      balance_after: {
        type: Sequelize.DECIMAL(20, 2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};