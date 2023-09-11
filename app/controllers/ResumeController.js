
// Create a new resume
exports.createResume = async (req, res, next) => {
  const {ResumeDetail} = req.db.models;
  try {

    const { resumeLink, resumeDetail,userDataid } = req.body;

    const newResume = await ResumeDetail.create({
      resumeLink:resumeLink,
      resumeDetail:resumeDetail,
      userDataId:userDataid
    });

    return res.status(201).send({
      status: true,
      message: "ResumeDetail created successfully.",
      resume: newResume.toJSON(),
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while creating the resume.",
      error,
    });
  }
};

// Get resume by ID
exports.getallresume = async (req, res, next) => {
  const {ResumeDetail} = req.db.models;

  try {
    const resume = await ResumeDetail.findAll();

    console.log(resume)
    if (resume) {
      return res.status(200).send({
        status: true,
        message: "ResumeDetail retrieved successfully.",
        resume: resume,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    console.error('Error getting All resume:', error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while retrieving the resume.",
      error,
    });
  }
};





exports.getResumeById = async (req, res, next) => {
  const {ResumeDetail} = req.db.models;

  try {
    const resumeId = req.params.id;
    const resume = await ResumeDetail.findByPk(resumeId);

    if (resume) {
      return res.status(200).send({
        status: true,
        message: "ResumeDetail retrieved successfully.",
        resume: resume.toJSON(),
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    console.error('Error getting resume by ID:', error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while retrieving the resume.",
      error,
    });
  }
};

// Update resume by ID
exports.updateResumeById = async (req, res, next) => {
  const {ResumeDetail} = req.db.models;

  try {
    const resumeId = req.params.id;
    const { resumeLink, resumeDetail } = req.body;

    const resume = await ResumeDetail.findByPk(resumeId);

    if (resume) {
      resume.resumeLink = resumeLink;
      resume.resumeDetail = resumeDetail;
      await resume.save();

      return res.status(200).send({
        status: true,
        message: "ResumeDetail updated successfully.",
        resume: resume.toJSON(),
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    console.error('Error updating resume by ID:', error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while updating the resume.",
      error,
    });
  }
};

// Delete resume by ID
exports.deleteResumeById = async (req, res, next) => {
  const {ResumeDetail} = req.db.models;
  try {
    const resumeId = req.params.id;
    const resume = await ResumeDetail.findByPk(resumeId);

    if (resume) {
      await resume.destroy();
      return res.status(200).send({
        status: true,
        message: "ResumeDetail deleted successfully.",
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "ResumeDetail not found.",
      });
    }
  } catch (error) {
    console.error('Error deleting resume by ID:', error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while deleting the resume.",
      error,
    });
  }
};
