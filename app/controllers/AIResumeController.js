const express = require("express");
const axios = require("axios");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
// const fileType = require("file-type");
const FormData = require("form-data");
// const s3 = require("./../../config/config"); // Adjust the path to match the location of your 's3Config.js' file
const s3 = new AWS.S3({
  accessKeyId: process.env.S3BUCKET_ACCESS_KEYID,
  secretAccessKey: process.env.S3BUCKET_SECRETACCESSKEY,
  region: process.env.S3BUCKET_REGION,
});
exports.createAIresume = async (req, res, next) => {
  const { AIresume } = req.db.models;
  const { ResumeDetail } = req.db.models;
  const { jobDetail } = req.db.models;
  const createdBy = req?.auth?.data?.userId;

  const { jobdetailId, resumeId } = req.body;
  try {
    // Check the file type (MIME type)
    if (!createdBy || !jobdetailId || !resumeId) {
      return res.status(400).json({
        message:
          "You are not providing the detail  UserDataId ,job_Description and resume data.",
      });
    }
    if (createdBy && resumeId && jobdetailId) {
      const [resumeData1, jobdetail1, rowCount] = await Promise.all([
        ResumeDetail.findByPk(resumeId),
        jobDetail.findByPk(jobdetailId),
        AIresume.count({ where: { userId: createdBy } }),
      ]);

      // console.log(
      //   resumeData1.dataValues.resumeDetail,
      //   jobdetail1.dataValues.jobdetail,
      //   rowCount
      // );
      if (
        resumeData1?.dataValues?.resumeDetail &&
        jobdetail1?.dataValues?.jobdetail &&
        rowCount < 10
      ) {
        const jsonString1 = JSON.parse(jobdetail1.dataValues.jobdetail);
        const jsonString2 = JSON.parse(resumeData1.dataValues.resumeDetail);
        // console.log("First One", jsonString1);
        // console.log("Second One", jsonString2);
        // fs.writeFileSync("job_desc.json", job_desc);
        // fs.writeFileSync("json_resume.json", json_resume);
        const data = new FormData();
        data.append("job_desc", fs.createReadStream("job_desc.json"));
        data.append("json_resume", fs.createReadStream("json_resume.json"));

        let config = {
          method: "POST",
          maxBodyLength: Infinity,
          url: `${process.env.AI_URL}/generate_ai_resume`,
          headers: {
            ...data.getHeaders(),
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            const decodedBuffer = Buffer.from(response.data[0], "base64");
            // fs.writeFileSync(
            //   `AI-Resume-${userDataId}-${Date.now()}.pdf`,
            //   response.data[0]
            // );
            // console.log(JSON.stringify(response.data));
            const params = {
              Bucket: process.env.S3BUCKET_NAME,
              Key: `AI-Resume-${createdBy}-${Date.now()}.pdf`, // Use the original filename for the S3 object
              Body: decodedBuffer,
            };
            s3.upload(params, async (err, data) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error uploading file to S3.", error: err });
              }
              if (data?.Location) {
                AIresume.create({
                  AIresumeLink: data.Location,
                  AIresumeDetail: JSON.stringify(response.data[1]),
                  UserId: createdBy,
                })
                  .then((response) => {
                    res.status(201).json(response);
                  })
                  .catch((err) => {
                    console.log(err);
                    res
                      .status(500)
                      .send({ message: "Internal Server Error", error: err });
                  });
              } else {
                res.status(200).send({
                  message: "Something Went Wrong Please Try Again",
                  data: data,
                });
              }
              // next();
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ message: "Internal Server Error" });
          });
      } else {
        res.status(200).send({
          status: false,
          message: "No record Found using your resumeId and jobdetailId",
        });
      }
    } else {
      res.status(201).send({ message: "Try Again" });
    }

    // Create a FormData object to send the file to the third-party API
  } catch (error) {
    console.error("Error creating AI resume:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the AI resume.",
      error,
    });
  }
};

exports.getAllAIresume = async (req, res, next) => {
  const { AIresume } = req.db.models;
  try {
    const resume = await AIresume.findAll();
    if (!resume) {
      return res.status(404).send({
        status: false,
        message: "AI resume not found.",
      });
    }

    return res.status(200).send({
      status: true,
      resume: resume,
    });
  } catch (error) {
    console.error("Error getting AI resume by ID:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while getting the AI resume.",
      error,
    });
  }
};

// Read AIresume by ID
exports.getAIresumeById = async (req, res, next) => {
  const { AIresume } = req.db.models;
  const resumeId = req.params.id; // Assuming the ID is passed as a URL parameter
  try {
    const resume = await AIresume.findByPk(resumeId);
    if (!resume) {
      return res.status(404).send({
        status: false,
        message: "AI resume not found.",
      });
    }

    return res.status(200).send({
      status: true,
      resume: resume.toJSON(),
    });
  } catch (error) {
    console.error("Error getting AI resume by ID:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while getting the AI resume.",
      error,
    });
  }
};

// Update AIresume by ID
exports.updateAIresume = async (req, res, next) => {
  const { AIresume } = req.db.models;
  const resumeId = req.params.id; // Assuming the ID is passed as a URL parameter
  const { AIresumeLink, AIresumeDetail } = req.body;

  try {
    const [updatedRowsCount, updatedRows] = await AIresume.update(
      {
        AIresumeLink,
        AIresumeDetail,
      },
      {
        where: { id: resumeId },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).send({
        status: false,
        message: "AI resume not found.",
      });
    }

    return res.status(200).send({
      status: true,
      message: "AI resume updated successfully.",
      resume: updatedRows[0],
    });
  } catch (error) {
    console.error("Error updating AI resume:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while updating the AI resume.",
      error,
    });
  }
};

// Delete AIresume by ID
exports.deleteAIresume = async (req, res, next) => {
  const { AIresume } = req.db.models;
  const resumeId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const deletedRowCount = await AIresume.destroy({ where: { id: resumeId } });
    if (deletedRowCount === 0) {
      return res.status(404).send({
        status: false,
        message: "AI resume not found.",
      });
    }

    return res.status(200).send({
      status: true,
      message: "AI resume deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting AI resume:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while deleting the AI resume.",
      error,
    });
  }
};

function decodeBase64AndExtractFileInfo(base64Data) {
  // Decode Base64 data
  const buffer = Buffer.from(base64Data, "base64");

  // Extract file name and file extension (if available)
  const originalFileName = "decoded_file"; // Default name if not found
  let fileExtension = "";

  // Extract original file name and extension (if available)
  const fileNameMatch = originalFileName.match(/(.+)\.(.+)$/);
  if (fileNameMatch) {
    originalFileName = fileNameMatch[1];
    fileExtension = fileNameMatch[2];
  }

  return {
    originalFileName,
    fileExtension,
    decodedData: buffer,
  };
}
