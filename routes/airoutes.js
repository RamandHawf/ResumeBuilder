const express = require("express");
const router = express.Router();
const aiResumeController = require("./../app/controllers/AIResumeController"); // Replace with the actual path to your AIresume controller
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const AWS = require("aws-sdk");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

const checkSubscriptionValidity = async (req, res, next) => {
  const { User } = req.db.models;
  const { userId } = req.body; // You can adjust this based on your API reques

  try {
    if (!userId) {
      res
        .status(200)
        .send({ message: false, message: "No userId is provided" });
    } else {
      User.findOne({
        where: {
          id: userId,
        },
      }).then(async (user) => {
        try {
          if (user) {
            const subscriptions = await stripe.subscriptions.list({
              customer: user.stripeCustomerId,
            });

            const subscription = subscriptions.data[0]; // Assuming the customer has only one subscription

            if (!subscription) {
              res.status(404).json({
                status: false,
                message:
                  "No subscription found for the customer Purchase Subscription .",
              });
              return;
            }

            const currentDate = Math.floor(Date.now() / 1000); // Current date in Unix timestamp

            if (
              subscription.cancel_at_period_end &&
              subscription.current_period_end <= currentDate
            ) {
              // The subscription is set to cancel at the end of the current period and it's past the end date
              res.status(403).json({
                status: false,
                message:
                  "Your subscription has ended. Please purchase a new subscription.",
              });
            } else {
              // Store the subscription details in the request for later route handlers
              req.subscription = subscription;
              next(); // Proceed to the next route handler
            }
          }
        } catch (error) {
          res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error,
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

//

router.post(
  "/create-airesume",
  checkSubscriptionValidity,
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
