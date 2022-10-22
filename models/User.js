const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

//create a User model (User table)
class User extends Model {}

//define table columns and configuration
User.init(
    {
        //table columns definition, define an ID COLUMN
        id: {
            type: DataTypes.INTEGER, //use the Sequelize DataTypes object from line1 to provide what type of data it is
            allowNull: false, // set as NOT NULL
            primaryKey: true, //instruct that this is PRiMARY KEY
            autoIncrement: true // set AUTO_INCREMENT
            },
        //define a USERNAME COLUMN
        username: {
            type: DataTypes.STRING,
            allowNull: false
            },
        //define EMAIL COLUMN
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, //set to no duplicates
            validate: { isEmail: true } // validate data before creating the table data
            },
        //define a PASSWORD COLUMN
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [4] }  //means the password has to be at least 4 chars long
            }
    },
    {
        // table config options: 
        sequelize, //pass in imported sequelize connection (the direct connection to the database)
        timestamps: false, // don't automatically create createdAT/updatedAt timestamp fields
        freezeTableName: true, // don't pluralize name of database table
        underscored: true, //use underscores instead of camel-casing
        modelName: 'user' //make it so the model stays lowercase in the database
    }
);

module.exports = User;