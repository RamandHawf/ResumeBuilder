const express = require('express');
const router = express.Router();
const aiResumeController = require('./../app/controllers/AIResumeController'); // Replace with the actual path to your AIresume controller

// AIresume routes
router.post('/createAiResume', aiResumeController.createAIresume);

router.get('/getAiResume/:id', aiResumeController.getAIresumeById);

router.get('/getAllAiResume', aiResumeController.getAllAIresume);


router.put('/updateAiResume/:id', aiResumeController.updateAIresume);
router.delete('/deleteAiResume/:id', aiResumeController.deleteAIresume);



module.exports = router;
