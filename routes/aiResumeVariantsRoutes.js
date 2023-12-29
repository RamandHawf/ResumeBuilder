const express = require("express");
const router = express.Router();
const aiResumeVariantsController = require("../app/controllers/AIResumeVariantsController");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
const StripeMidMan = require("../app/middlewares/StripeMaster");

// // Middleware to check subscription validity

router.post(
  "/createAiResumeVariants",
  // StripeMidMan.checkSubscriptionValidity,
  aiResumeVariantsController.createAiResumeVariant
);
router.get(
  "/getAllAiresumeVariants",
  aiResumeVariantsController.getAllAiResumeVariants
);
router.get(
  "/getAiResumeVariants/:id",
  aiResumeVariantsController.getAiResumeVariantById
);
router.put(
  "/updateAiResumeVariants/:id",
  aiResumeVariantsController.updateAiResumeVariant
);
router.delete(
  "/deleteAiresumeVariants/:id",
  aiResumeVariantsController.deleteAiResumeVariant
);

module.exports = router;
