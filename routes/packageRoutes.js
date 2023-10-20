const express = require("express");
const router = express.Router();
const packageController = require("../app/controllers/packageController");
// const PackageController = require('../app/controllers/PackageController');

// router.get('/login', jobeDetailController.loginPage);
// Create a new resume
router.post("/createpackage", packageController.createPackage);

// Get resume by ID
router.get("/getallpackage", packageController.getAllPackage);

router.get("/getpackagebyId/:id", packageController.getPackageById);

// Update resume by ID
router.put("/updatepackagebyId/:id", packageController.updatePackageById);

// Delete resume by ID
router.delete("/deletepackage/:id", packageController.deletePackageById);

module.exports = router;
