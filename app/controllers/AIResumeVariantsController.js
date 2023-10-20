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
// Create a new aiResumeVariant
exports.createAiResumeVariant = async (req, res) => {
  const { aiResumeVariants, AIresume } = req.db.models;

  const { aiResumeId, section_name, comment, resumeDetailId, jobDetailId } =
    req.body;

  console.log(req.body);
  try {
    const resume = await AIresume.findByPk(aiResumeId);
    if (!resume) {
      return res.status(404).send({
        status: false,
        message: "AI resume not found in your Record .",
      });
    } else {
      try {
        // console.log("Umer usman");
        // console.log(resume.dataValues.AIresumeDetail);
        // const jsonString1 = JSON.parse(resume.dataValues.AIresumeDetail);
        // console.log("First One", jsonString1);

        fs.writeFileSync("json_resume.json", resume.dataValues.AIresumeDetail);

        const data = new FormData();
        data.append("json_resume", fs.createReadStream("json_resume.json"));
        data.append("section_name", section_name);
        data.append("comment", comment);
        // console.log("First first");
        let config = {
          method: "POST",
          maxBodyLength: Infinity,
          url: `${process.env.AI_URL}/airesumevariant`,
          headers: {
            ...data.getHeaders(),
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            try {
              // console.log("Name is name");
              // res.status(200).send(response.data[]);

              console.log(response);
              const decodedBuffer = Buffer.from(response.data[0], "base64");
              console.log("Name is khan");
              // fs.writeFileSync(
              //   `AI-Resume-${userDataId}-${Date.now()}.pdf`,
              //   response.data[0]
              // );
              // console.log(JSON.stringify(response.data));
              const params = {
                Bucket: process.env.S3BUCKET_NAME,
                Key: `AI-Variant-Resume-${aiResumeId}-${Date.now()}.pdf`, // Use the original filename for the S3 object
                Body: decodedBuffer,
              };
              s3.upload(params, async (err, data) => {
                if (err) {
                  return res.status(500).json({
                    message: "Error uploading file to S3.",
                    error: err,
                  });
                }
                if (data?.Location) {
                  console.log("Cloud Storage");
                  aiResumeVariants
                    .create({
                      aiResumeId: aiResumeId,
                      aiResume_VariantLink: data.Location,
                      aiResume_VariantDetail: JSON.stringify(response.data[1]),
                      jobDetailId: jobDetailId,
                      resumeDetailId: resumeDetailId,
                    })
                    .then((response) => {
                      res.status(201).json({ status: true, response });
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
            } catch (error) {
              console.log(error);
              res.status(500).send({ status: false, error: error });
            }
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: "Internal Server Error", error: err });
          });
      } catch (err) {
        console.log("Error", err);
        res.status(500).send({ status: false, error: err });
      }
    }
  } catch (error) {
    console.error("Error creating aiResumeVariant:", error);
    res.status(500).json({
      message: "Failed to create aiResumeVariant",
      error: error.message,
    });
  }
};

// Retrieve all aiResumeVariants
exports.getAllAiResumeVariants = async (req, res) => {
  const { aiResumeVariants } = req.db.models;

  try {
    const aiResumeVariant = await aiResumeVariants.findAll();
    res.status(200).json(aiResumeVariant);
  } catch (error) {
    console.error("Error fetching aiResumeVariants:", error);
    res.status(500).json({
      message: "Failed to fetch aiResumeVariants",
      error: error.message,
    });
  }
};

// Retrieve a single aiResumeVariant by ID
exports.getAiResumeVariantById = async (req, res) => {
  const { aiResumeVariants } = req.db.models;

  const { id } = req.params;
  try {
    const aiResumeVariant = await aiResumeVariants.findByPk(id);
    if (!aiResumeVariant) {
      return res.status(404).json({ message: "aiResumeVariant not found" });
    }
    res.status(200).json(aiResumeVariant);
  } catch (error) {
    console.error("Error fetching aiResumeVariant:", error);
    res.status(500).json({
      message: "Failed to fetch aiResumeVariant",
      error: error.message,
    });
  }
};

// Update an aiResumeVariant by ID
exports.updateAiResumeVariant = async (req, res) => {
  const { aiResumeVariants } = req.db.models;

  const { id } = req.params;
  try {
    const [updated] = await aiResumeVariants.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: "aiResumeVariant not found" });
    }
    res.status(200).json({ message: "aiResumeVariant updated successfully" });
  } catch (error) {
    console.error("Error updating aiResumeVariant:", error);
    res.status(500).json({
      message: "Failed to update aiResumeVariant",
      error: error.message,
    });
  }
};

// Delete an aiResumeVariant by ID
exports.deleteAiResumeVariant = async (req, res) => {
  const { aiResumeVariants } = req.db.models;

  const { id } = req.params;
  try {
    const deleted = await aiResumeVariants.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "aiResumeVariant not found" });
    }
    res.status(200).json({ message: "aiResumeVariant deleted successfully" });
  } catch (error) {
    console.error("Error deleting aiResumeVariant:", error);
    res.status(500).json({
      message: "Failed to delete aiResumeVariant",
      error: error.message,
    });
  }
};
