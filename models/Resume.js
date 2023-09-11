'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    static associate(models) {
      
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
