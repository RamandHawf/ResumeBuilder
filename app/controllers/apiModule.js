const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { AWS } = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3BUCKET_ACCESS_KEYID,
  secretAccessKey: process.env.S3BUCKET_SECRETACCESSKEY,
  region: process.env.S3BUCKET_REGION,
});

const processAndUploadResume = async (section_name, comment, aiResumeId) => {
  try {
    const data = new FormData();
    data.append("json_resume", fs.createReadStream("json_resume.json"));
    data.append("section_name", section_name);
    data.append("comment", comment);

    const config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `${process.env.AI_URL}/airesumevariant`,
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios.request(config);

    const decodedBuffer = Buffer.from(response.data[0], "base64");
    const params = {
      Bucket: process.env.S3BUCKET_NAME,
      Key: `AI-Variant-Resume-${aiResumeId}-${Date.now()}.pdf`,
      Body: decodedBuffer,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve({ response, data });
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  processAndUploadResume,
};
