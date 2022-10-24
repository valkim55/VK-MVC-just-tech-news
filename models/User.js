
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create a User model (User table)
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

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
        hooks: {
            // setup beforeCreate() since we need to do this before User instance with its password is crated
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },

            // setup beforeUpdate() hook
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        // table config options: 
        sequelize, //pass in imported sequelize connection (the direct connection to the database)
        timestamps: false, // don't automatically create createdAT/updatedAt timestamp fields
        freezeTableName: true, // don't pluralize name of database table
        underscored: true, //use underscores instead of camel-casing
        modelName: 'user' //make it so the model stays lowercase in the database
    }
);

module.exports = User;