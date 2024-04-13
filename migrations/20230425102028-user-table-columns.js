'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('USER', 'job', {
        type: Sequelize.UUID,
      }),
      queryInterface.addColumn('USER', 'technology', {
        type: Sequelize.UUID,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('USER', 'job'),
      queryInterface.removeColumn('USER', 'technology'),
    ]);
  }
};
