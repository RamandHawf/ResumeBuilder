const express = require("express");
const router = express.Router();
const jobeDetailController = require("../app/controllers/JobDetailController");
// const PackageController = require('../app/controllers/PackageController');

// router.get('/login', jobeDetailController.loginPage);
router.post("/scrapjobdetail-usinglink", jobeDetailController.createJobDetail);
router.get("/getjobdetailbyid/:id", jobeDetailController.getJobDetailById);
router.get("/getalljobdetail", jobeDetailController.getAllJobDetail);

router.put("/updatejobdetail/:id", jobeDetailController.updateJobDetail);
router.delete("/deletejobdetail/:id", jobeDetailController.deleteJobDetail);

module.exports = router;
