const express = require("express");
const router = express.Router();
const aiResumeController = require("./../app/controllers/AIResumeController"); // Replace with the actual path to your AIresume controller
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const AWS = require("aws-sdk");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const StripeMidMan = require("./../app/middlewares/StripeMaster");

//

router.post(
  "/create-airesume",
  // StripeMidMan.checkSubscriptionValidity,
  aiResumeController.createAIresume
);

router.get("/getairesume/:id", aiResumeController.getAIresumeById);

router.get("/getAllAiResume", aiResumeController.getAllAIresume);

router.put("/updateAiResume/:id", aiResumeController.updateAIresume);
router.delete("/deleteAiResume/:id", aiResumeController.deleteAIresume);

module.exports = router;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = function (req, file, cb) {
//   // Check the file type here
//   if (
//     file.mimetype === "application/pdf" ||
//     file.mimetype === "application/msword" ||
//     file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   ) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(
//       new Error("File not accepted. Only PDF or .doc files are allowed."),
//       false
//     ); // Reject the file
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter, // Apply the file filter
// }).single("file"); // Use 'file' as the field name for the uploaded file

// Define a middleware to handle file uploads and validation
// const handleFileUpload = (req, res, next) => {
//   upload(req, res, function (err) {
//     if (err) {
//       // A Multer error occurred, handle it
//       return res.status(400).json({ error: err.message }); // Use err.message to get the error message
//     }

//     // If no errors, move to the next middleware or route handler
//     next();
//   });
// };
