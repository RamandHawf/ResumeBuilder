const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class jobDetail extends Model {
    static associate(models) {
  
    }

    static getjobDetails() {
      console.log("getResumeDetails method called");
    }
  }

  jobDetail.init({
    // ... define attributes for ResumeDetail
    jobdetaillink: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    jobdetail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
  }, {
    sequelize,
    modelName: 'jobDetail',
  });

  return jobDetail;
};
