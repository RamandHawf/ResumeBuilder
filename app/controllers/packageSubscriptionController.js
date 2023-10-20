// Create a new package subscription
exports.createPackageSubscription = async (req, res) => {
  const { packageSubscription } = req.db.models;

  try {
    const newSubscription = await packageSubscription.create(req.body);
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all package subscriptions
exports.findAllPackageSubscription = async (req, res) => {
  const { packageSubscription } = req.db.models;

  try {
    const subscriptions = await packageSubscription.findAll();
    res.json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve a single package subscription by ID
exports.findOnePackageSubscription = async (req, res) => {
  const { packageSubscription } = req.db.models;

  const id = req.params.id;
  try {
    const subscription = await packageSubscription.findByPk(id);
    if (!subscription) {
      res.status(404).json({ message: "Package subscription not found" });
    } else {
      res.json(subscription);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a package subscription by ID
exports.updatePackageSubscription = async (req, res) => {
  const { packageSubscription } = req.db.models;

  const id = req.params.id;
  try {
    const [updatedRows] = await packageSubscription.update(req.body, {
      where: { id },
    });
    if (updatedRows === 0) {
      res.status(404).json({ message: "Package subscription not found" });
    } else {
      res.json({ message: "Package subscription updated successfully" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a package subscription by ID
exports.deletePackageSubscription = async (req, res) => {
  const { packageSubscription } = req.db.models;

  const id = req.params.id;
  try {
    const deletedRows = await packageSubscription.destroy({ where: { id } });
    if (deletedRows === 0) {
      res.status(404).json({ message: "Package subscription not found" });
    } else {
      res.json({ message: "Package subscription deleted successfully" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
