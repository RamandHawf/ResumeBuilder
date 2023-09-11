'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AIresume extends Model {
    static associate(models) {
      
    }
    
    static getResumeDetails() {
      console.log("getResumeDetails method called");
    }
  }

  AIresume.init({


    AIresumeLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AIresumeDetail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
 
  
  }, {
    sequelize,
    modelName: 'AIresume',
  });
  
  return AIresume;
};
