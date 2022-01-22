"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Photography",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Design",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Development",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Marketing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Business",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Lifestyle",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Music",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
