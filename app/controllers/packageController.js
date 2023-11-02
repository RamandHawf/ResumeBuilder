const axios = require("axios");

exports.createPackage = async (req, res, next) => {
  const { packages } = req.db.models;
  try {
    const { packageName, packagePriceId, packageDetail } = req.body;
    const newPackage = await packages.create({
      packageName,
      packagePriceId,
      packageDetail,
    });
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new package" });
  }
};

exports.createPackagesss = async (req, res, next) => {
  const { packages } = req.db.models;
  try {
    const { packageName, packagePriceId, packageDetail } = req.body;
    const newPackage = await packages.create({
      packageName,
      packagePriceId,
      packageDetail,
    });
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new package" });
  }
};

// Get all packages
exports.getAllPackage = async (req, res, next) => {
  const { packages } = req.db.models;

  try {
    const allPackages = await packages.findAll();
    res.json(allPackages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve packages" });
  }
};

// Get a specific package by ID
exports.getPackageById = async (req, res, next) => {
  const { packages } = req.db.models;

  const packageId = req.params.id;

  try {
    const package = await packages.findByPk(packageId);
    if (package) {
      res.json(package);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the package" });
  }
};

// Update a specific package by ID

exports.updatePackageById = async (req, res, next) => {
  const { packages } = req.db.models;

  const packageId = req.params.id;
  const { packageName, packagePriceId, packageDetail } = req.body;

  try {
    const package = await packages.findByPk(packageId);
    if (package) {
      package.packageName = packageName;
      package.packagePriceId = packagePriceId;
      package.packageDetail = packageDetail;
      await package.save();
      res.json(package);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the package" });
  }
};

// Delete a specific package by ID

exports.deletePackageById = async (req, res, next) => {
  const { packages } = req.db.models;

  const packageId = req.params.id;

  try {
    const package = await packages.findByPk(packageId);
    if (package) {
      await package.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the package" });
  }
};
