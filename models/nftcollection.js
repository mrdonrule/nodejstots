'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NftCollection extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    NftCollection.init({
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        minted: DataTypes.ENUM('0', '1'),
        hash: DataTypes.STRING,
        uri: DataTypes.STRING,
        img_url: DataTypes.STRING,
        price: DataTypes.DECIMAL(10, 2)
    }, {
        sequelize,
        modelName: 'NftCollection',
    });
    return NftCollection;
};