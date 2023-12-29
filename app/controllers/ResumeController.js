const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Create a new resume

// const axios = require('axios');


exports.createResume = async (req, res, next) => {
  const { ResumeDetail } = req.db.models;

  try {
    const createdBy = req?.auth?.data?.userId;

    if (!createdBy || !req.file) {
      return res.status(400).json({ message: "No file uploaded or user data provided." });
    }

    // Check the file type
    if (req.file.mimetype !== "application/pdf" && req.file.mimetype !== "application/msword") {
      return res.status(400).json({ message: "Only PDF or DOC files are allowed." });
    }

    // Decode the buffer (assuming it's base64 encoded)
    const decodedBuffer = Buffer.from(req.file.buffer, 'base64');

    // Create form data
    const formData = new FormData();
    formData.append('file', decodedBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Set up axios configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.AI_URL}/parse_resume`,
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
      timeout: 128000, // Set timeout to 2 minutes and 8 seconds

    };

    const response = await axios.request(config);
    // console.log(response);
    if (response?.data) {
      const newResume = await ResumeDetail.create({
        resumeDetail: JSON.stringify(response.data),
        userId: createdBy,
      });

      return res.status(201).send({
        status: true,
        message: "ResumeDetail created successfully.",
        resume: newResume.toJSON(),
      });
    }
    else {
      res.status(500).send({ message: "Resume Not Created successfully" });
    }

  } catch (error) {
    console.error("Error creating resume:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while creating the resume.",
      error: error.message,
    });
  }
};


// Get resume by ID
exports.getallresume = async (req, res, next) => {
  const { ResumeDetail } = req.db.models;

  try {
    const resume = await ResumeDetail.findAll();

    // console.log(resume);
    if (resume) {
      return res.status(200).send({
        status: true,
        message: "ResumeDetail retrieved successfully.",
        resume: resume,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    // console.error("Error getting All resume:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while retrieving the resume.",
      error,
    });
  }
};

exports.getResumeById = async (req, res, next) => {
  const { ResumeDetail } = req.db.models;

  try {
    const resumeId = req.params.id;
    const resume = await ResumeDetail.findByPk(resumeId);

    if (resume) {
      return res.status(200).send({
        status: true,
        message: "ResumeDetail retrieved successfully.",
        resume: resume.toJSON(),
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    // console.error("Error getting resume by ID:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while retrieving the resume.",
      error,
    });
  }
};

// Update resume by ID
exports.updateResumeById = async (req, res, next) => {
  const { ResumeDetail } = req.db.models;

  try {
    const resumeId = req.params.id;
    const { resumeLink, resumeDetail } = req.body;

    const resume = await ResumeDetail.findByPk(resumeId);

    if (resume) {
      resume.resumeLink = resumeLink;
      resume.resumeDetail = resumeDetail;
      await resume.save();

      return res.status(200).send({
        status: true,
        message: "ResumeDetail updated successfully.",
        resume: resume.toJSON(),
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    // console.error("Error updating resume by ID:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while updating the resume.",
      error,
    });
  }
};

// Delete resume by ID
exports.deleteResumeById = async (req, res, next) => {
  const { ResumeDetail } = req.db.models;
  try {
    const resumeId = req.params.id;
    const resume = await ResumeDetail.findByPk(resumeId);

    if (resume) {
      await resume.destroy();
      return res.status(200).send({
        status: true,
        message: "ResumeDetail deleted successfully.",
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    // console.error("Error deleting resume by ID:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while deleting the resume.",
      error,
    });
  }
};
