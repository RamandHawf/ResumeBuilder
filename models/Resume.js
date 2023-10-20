'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    static associate(models) {
      // models.jobDetail.belongsTo(models.packages, {
      //   foreignKey: "jobDetailId", // This is the name of the foreign key column in the packageSubscription table
      //   as: "package", // Alias for the association
      // });
    }
    
    static getResumeDetails() {
      console.log("getResumeDetails method called");
    }
  }

  Resume.init({


    resumeLink: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    resumeDetail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
 
  
  }, {
    sequelize,
    modelName: 'ResumeDetail',
  });
  
  return Resume;
};
