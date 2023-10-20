const env = require("dotenv");

env.config();

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3BUCKET_ACCESS_KEYID,
  secretAccessKey: process.env.S3BUCKET_SECRETACCESSKEY,
  region: process.env.S3BUCKET_REGION,
});

module.exports = s3;

module.exports = {
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
  },
  test: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
  },
};
