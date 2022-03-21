'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('NftCollections', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            minted: {
                type: Sequelize.ENUM('0', '1')
            },
            uri: {
                type: Sequelize.STRING
            },
            hash: {
                type: Sequelize.STRING
            },
            img_url: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.DECIMAL(10, 2)
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
        await queryInterface.dropTable('NftCollections');
    }
};