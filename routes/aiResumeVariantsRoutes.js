const express = require("express");
const router = express.Router();
const aiResumeVariantsController = require("../app/controllers/AIResumeVariantsController");

// Define routes for CRUD operations
router.post(
  "/create-airesumevariants",
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
