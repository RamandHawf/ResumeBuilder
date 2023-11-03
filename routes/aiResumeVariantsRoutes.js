const express = require("express");
const router = express.Router();
const aiResumeVariantsController = require("../app/controllers/AIResumeVariantsController");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
const StripeMidMan = require("../app/middlewares/StripeMaster");

// // Middleware to check subscription validity

router.post(
  "/create-airesumevariants",
  // StripeMidMan.checkSubscriptionValidity,
  aiResumeVariantsController.createAiResumeVariant
);
router.get(
  "/getall-airesumevariants",
  aiResumeVariantsController.getAllAiResumeVariants
);
router.get(
  "/getairesumevariants/:id",
  aiResumeVariantsController.getAiResumeVariantById
);
router.put(
  "/update-airesumevariants/:id",
  aiResumeVariantsController.updateAiResumeVariant
);
router.delete(
  "/deleteairesume-variants/:id",
  aiResumeVariantsController.deleteAiResumeVariant
);

module.exports = router;
