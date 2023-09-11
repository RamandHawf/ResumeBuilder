const { Model, DataTypes } = require('sequelize');
const AIresume = require('./AIresume');

module.exports = (sequelize, DataTypes) => {
  class UserData extends Model {
    static associate(models) {
      // Define associations here
			const { UserData,ResumeDetail ,jobDetail,AIresume,User} = models;
      UserData.belongsTo(User, {
        foreignKey: 'userId', // The foreign key referencing the User model
      });
      UserData.hasMany(ResumeDetail, {
        onDelete: 'CASCADE',
        foreignKey: 'userDataId',
      });
      UserData.hasMany(jobDetail, {
        onDelete: 'CASCADE',
        foreignKey: 'userDataId',
      });
      UserData.hasMany(AIresume, {
        onDelete: 'CASCADE',
        foreignKey: 'userDataId',
      });

    }

    static getUserWithRole() {
      console.log("getUserWithRole method called");
    }
  }

  UserData.init({

    designation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    account_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    // For JobDetail relationship
   
  }, {
    sequelize,
    modelName: 'UserData',
  });

  return UserData;
};
