'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('otps', {
      id: {  
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      otp: { 
          type: Sequelize.STRING,
      },
      phone: { 
          type: Sequelize.STRING,
      
      },
      email: { 
          type: Sequelize.STRING,
      
      },

    createdAt: { //createdAt
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: { //updatedAt
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('otps');
  }
};