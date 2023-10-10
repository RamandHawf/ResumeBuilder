const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
let data = new FormData();
exports.createAIresume = async (req, res, next) => {
  const { AIresume } = req.db.models;

  const { username, password, link } = req.query;
  const id = req.params.id;

  try {
    // Check the file type (MIME type)

    if (!req.file) {
      res.status(500).send({ message: "Please Upload the pdf or .docs file" });
    }

    if (req.file) {
      const pdfFilePath = `public/uploads/${req.file.filename}`;

      const data = new FormData();
      data.append("file", fs.createReadStream(pdfFilePath));
      data.append("username", username);
      data.append("password", password);
      data.append("link", link);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.AI_URL}/parse_resume`,
        headers: {
          ...data.getHeaders(),
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          let resp = JSON.stringify(response.data);
          let resps = JSON.parse(resp);
          if (resps.error) {
            res.status(500).send({
              status: false,
              response: resps,
            });
          } else {
            const AIResumeLink = `${
              process.env.URL_SERVER + req.file.filename
            }`;

            console.log(AIResumeLink);
            const newAIresume = {
              AIresumeLink: "your_link_here",
              AIresumeDetail: resps,
              JobDescriptionUrl: link,
              ParsedResumeDetail: "your_parsed_resume_detail_here",
              userId: id,
            };

            AIresume.create(newAIresume)
              .then((createdAIresume) => {
                console.log(
                  "AIresume created successfully:",
                  createdAIresume.toJSON()
                );
                res.status(200).send({ status: true, data: createdAIresume });
              })
              .catch((error) => {
                console.error("Error creating AIresume:", error);
                res.status(400).send({ status: false, data: error });
              });
          }
        })
        .catch((error) => {
          console.log("Error calling the third-party API:", error);
          return res.status(500).json({
            status: false,
            message: "An error occurred while calling the third-party API.",
            error,
          });
        });
    }
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
