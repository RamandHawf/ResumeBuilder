const express = require("express");
const router = express.Router();
const resumeController = require("../app/controllers/ResumeController");
const multer = require("multer");
const AWS = require("aws-sdk");
// const PackageController = require('../app/controllers/PackageController');

// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/createResumeData",
  upload.single("file"),
  resumeController.createResume
);

// Get resume by ID
router.get("/getAllResumeData", resumeController.getallresume);

router.get("/getResumeDataById/:id", resumeController.getResumeById);

// Update resume by ID
router.put("/updateResumeData/:id", resumeController.updateResumeById);

// Delete resume by ID
router.delete("/deleteResume/:id", resumeController.deleteResumeById);

module.exports = router;
