// Create AIresume
exports.createAIresume = async (req, res, next) => {
    const { AIresume } = req.db.models;
    try {
      const { AIresumeLink, AIresumeDetail ,userDataId} = req.body;
  
      const newAIresume = await AIresume.create({
        AIresumeLink,
        AIresumeDetail,
        userDataId
      });
  
      return res.status(201).send({
        status: true,
        message: "AI resume created successfully.",
        resume: newAIresume.toJSON(),
      });
    } catch (error) {
      console.error('Error creating AI resume:', error);
      return res.status(500).send({
        status: false,
        message: "An error occurred while creating the AI resume.",
        error,
      });
    }
  };
  
  

  exports.getAllAIresume = async (req, res, next) => {
    const { AIresume } = req.db.models;
    try {
      const resume = await AIresume.findAll();
      if (!resume) {
        return res.status(404).send({
          status: false,
          message: "AI resume not found.",
        });
      }
  
      return res.status(200).send({
        status: true,
        resume: resume,
      });
    } catch (error) {
      console.error('Error getting AI resume by ID:', error);
      return res.status(500).send({
        status: false,
        message: "An error occurred while getting the AI resume.",
        error,
      });
    }
  };
 


  // Read AIresume by ID
  exports.getAIresumeById = async (req, res, next) => {
    const { AIresume } = req.db.models;
    const resumeId = req.params.id; // Assuming the ID is passed as a URL parameter
    try {
      const resume = await AIresume.findByPk(resumeId);
      if (!resume) {
        return res.status(404).send({
          status: false,
          message: "AI resume not found.",
        });
      }
  
      return res.status(200).send({
        status: true,
        resume: resume.toJSON(),
      });
    } catch (error) {
      console.error('Error getting AI resume by ID:', error);
      return res.status(500).send({
        status: false,
        message: "An error occurred while getting the AI resume.",
        error,
      });
    }
  };
  
  // Update AIresume by ID
  exports.updateAIresume = async (req, res, next) => {
    const { AIresume } = req.db.models;
    const resumeId = req.params.id; // Assuming the ID is passed as a URL parameter
    const { AIresumeLink, AIresumeDetail } = req.body;
  
    try {
      const [updatedRowsCount, updatedRows] = await AIresume.update(
        {
          AIresumeLink,
          AIresumeDetail,
        },
        {
          where: { id: resumeId },
          returning: true,
        }
      );
  
      if (updatedRowsCount === 0) {
        return res.status(404).send({
          status: false,
          message: "AI resume not found.",
        });
      }
  
      return res.status(200).send({
        status: true,
        message: "AI resume updated successfully.",
        resume: updatedRows[0],
      });
    } catch (error) {
      console.error('Error updating AI resume:', error);
      return res.status(500).send({
        status: false,
        message: "An error occurred while updating the AI resume.",
        error,
      });
    }
  };
  
  // Delete AIresume by ID
  exports.deleteAIresume = async (req, res, next) => {
    const { AIresume } = req.db.models;
    const resumeId = req.params.id; // Assuming the ID is passed as a URL parameter
  
    try {
      const deletedRowCount = await AIresume.destroy({ where: { id: resumeId } });
      if (deletedRowCount === 0) {
        return res.status(404).send({
          status: false,
          message: "AI resume not found.",
        });
      }
  
      return res.status(200).send({
        status: true,
        message: "AI resume deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting AI resume:', error);
      return res.status(500).send({
        status: false,
        message: "An error occurred while deleting the AI resume.",
        error,
      });
    }
  };
  